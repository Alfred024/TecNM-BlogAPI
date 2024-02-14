import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { ConfigService } from '@nestjs/config';
import { Career } from 'src/career/entities/career.entity';


@Injectable()
export class AuthService {
  constructor(
    // private readonly configService : ConfigService,

    private readonly dataSource : DataSource,

    private readonly jwtService : JwtService,

    @InjectRepository(User)
    private readonly userRepository : Repository<User>,

    @InjectRepository(Blogger)
    private readonly bloggerRepository : Repository<Blogger>,

  ){}

    
    async loginUser( loginUserDto : LoginUserDto ){
      const { password, email } = loginUserDto;

      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id_user_blogger: true } //! OJO!
      });

      if ( !user ) 
        throw new UnauthorizedException('Credentials are not valid (email)');
        
      if ( !bcrypt.compareSync( password, user.password ) )
        throw new UnauthorizedException('Credentials are not valid (password)');

      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ email: user.email })
      };
    }

    private getJwtToken( jwtPayloadDto : JwtPayloadDto ){
      const payload = jwtPayloadDto;
      return this.jwtService.sign(payload);
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
        const token = this.getJwtToken({ email: user.email });
        // TODO: await función para mandar un correo al usuario, usa el token para concatenarlo al link del email 
        // Vamos a definir que cree el JWT dentro de la función de email, tenemos el token aquí por cuestiones prácticas
        await this.userRepository.save(user);

        // Este token no va aquí, se quita cuando se cree el servicio de email
        return {
          'message': 'Este token se debe quitar una vez se implemnete el servicio de SMTP',
          'user': user,
          'token': token,
        };
      } catch (error) {
        this.handleDBErrors(error);
      }
    }

    // El usuario registrado por un ADMIN crea un blogger
    async createBlogger(createBloggerDto : CreateBloggerDto) {
      const {email, password,...bloggerData } = createBloggerDto;

      // 1.- busca el usuario por el email
      let user = await this.userRepository.findOne({where: {email}});
      if (!user) throw new NotFoundException(`User with email: ${email} not found!!!`);

      // 2.- actualiza la contrasseña del usuario 
      await this.updateUserPassword(user, password);
      
      // 3.- hace el insert de un blogger
      //return {...bloggerData, user: user};
      const blogger = this.bloggerRepository.create({...bloggerData, id_user_blogger: user.id_user_blogger });
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
