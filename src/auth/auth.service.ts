import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
// Database ORM
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// DTO´s
import { LoginUserDto } from './dto/login-user-dto';
import { CreateUserByAdminDto } from './dto/create-user-by-admin-dto';
import { CreateUserAdminDto } from './dto/create-user-admin-dto';
import { CreateBloggerDto } from 'src/blogger/dto/create-blogger.dto';
// Entities
import { Blogger } from 'src/blogger/entities/blogger.entity';
// Hashing
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from './dto/jwt-payload-dto';
import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { ConfirmationEmailDto } from 'src/email/dto/confirmation-email';


@Injectable()
export class AuthService {
  constructor(
    // private readonly configService : ConfigService,

    @Inject(REQUEST) private readonly request : any,

    private readonly dataSource : DataSource,

    private readonly jwtService : JwtService,

    private config: ConfigService,

    private readonly emailService: EmailService,

    @InjectRepository(User)
    private readonly userRepository : Repository<User>,

    @InjectRepository(Blogger)
    private readonly bloggerRepository : Repository<Blogger>,

  ){}

    async loginUser( loginUserDto : LoginUserDto ){
      const user : User = await this.findUserLogin(loginUserDto);
      return {
        ...user,
        token: this.getJwtToken({ sub: user.id_user_blogger }),
        refreshToken: this.getRefreshJwtToken({ sub: user.id_user_blogger }),
      };
    }

    async getNewTokens() {
      try {
        const sub : number = this.request.user.id_user_blogger;

        // TODO CAMBIRA POR UN RETURN TIPADO
        return {
          "newToken": this.getJwtToken({ sub: sub }),
          "newRefreshToken": this.getRefreshJwtToken({ sub: sub })
        };
      } catch (error) {
        throw Error('Couldn´t do this action. Please login again');
      }
    }

    async findUserLogin(loginUserDto : LoginUserDto) : Promise<User>{
      const { password, email } = loginUserDto;

      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id_user_blogger: true } //! OJO!
      });
      
      if ( !user ) 
        throw new UnauthorizedException('Credentials are not valid (email)');
    
      if ( !bcrypt.compareSync( password, user.password ) )
        throw new UnauthorizedException('Credentials are not valid (password)');
      
      return user;
    }

    private getJwtToken( jwtPayloadDto : JwtPayloadDto ){
      const payload = jwtPayloadDto;
      //return this.jwtService.sign(payload);
      return this.jwtService.sign(payload, {
        secret: this.config.get('jwt_secret'),
        expiresIn: '3600s'
      });
    }
    private getRefreshJwtToken( jwtPayloadDto : JwtPayloadDto ){
      const payload = jwtPayloadDto;
      return this.jwtService.sign(payload, {
        secret: this.config.get('refresh_jwt_secret'),
        expiresIn: '7d'
      });
    }
    // Se crea un usuario admin
    async createAdminUser( createUserAdminDto : CreateUserAdminDto ){
      try {
        const { password, ...userData } = createUserAdminDto;
        userData.role = 'ADMIN';
        
        
        const user = this.userRepository.create({
          password: bcrypt.hashSync( password, 10 ),
          ...userData,
        });

        await this.userRepository.save(user);

        delete user.password;
        return user;
      } catch (error) {
        this.handleDBErrors(error);
      }
    }

    // El admin crea un usario 
    async createUser( createUserByAdminDto : CreateUserByAdminDto ){
      try { 
        const user = this.userRepository.create({
          ...createUserByAdminDto
        }); 

        const token = this.getJwtToken({ sub: user.id_user_blogger  });
        const confirmationEmailDto : ConfirmationEmailDto = {
          'destinationEmail': user.email,
        }

        await this.emailService.sendConfirmationEmail(confirmationEmailDto);
        await this.userRepository.save(user);

        return {
          "message": "User cretion succesfull, the email confirmation has been sent to complete the register",
          'user': user,
        };
      } catch (error) {
        this.handleDBErrors(error);
      }
    }

    // El usuario registrado por un ADMIN crea un blogger
    async createBlogger(createBloggerDto : CreateBloggerDto) {      
      const {email, password, id_career,...bloggerData } = createBloggerDto;

      // 1.- busca el usuario por el email
      let user = await this.userRepository.findOne({where: {email}});
      if (!user) throw new NotFoundException(`User with email: ${email} not found!!!`);

      // 2.- actualiza la contrasseña del usuario 
      await this.updateUserPassword(user, password);
      
      // 3.- hace el insert de un blogger
      const blogger = this.bloggerRepository.create({...bloggerData, id_user_blogger: user.id_user_blogger, id_career: {id_career: id_career}});
      await this.bloggerRepository.save(blogger);
      return blogger;
    }

    async updateUserPassword( user : User, userPassword : string ){
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        user.password = bcrypt.hashSync( userPassword, 10 );
        await this.userRepository.save(user);
        return;
      } catch (error) {
        this.handleDBErrors(error);
      }      
    } 

    private handleDBErrors( error: any ): never {
      if ( error.code === '23505' ) 
        throw new BadRequestException( error.detail );
  
      console.log(error)
  
      throw new InternalServerErrorException('Please check server logs');
  
    }
}
