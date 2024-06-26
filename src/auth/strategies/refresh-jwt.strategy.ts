import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadDto } from "../dto/jwt-payload-dto";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy( Strategy, 'jwt-refresh'){

    constructor(
        @InjectRepository(User)
        private readonly userRepository : Repository<User>,

        private readonly configService : ConfigService,
    ){
        super({
            secretOrKey: configService.get('refresh_jwt_secret'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // passReqToCallback: true,
        });
    }

    async validate( payload: JwtPayloadDto ): Promise<User> {
        const { sub } = payload;

        const user = await this.userRepository.findOneBy({id_user_blogger: sub});
        if ( !user ) 
            throw new UnauthorizedException('Refresh Token not valid')
        
        // if ( !user.confirmed ) 
        //     throw new UnauthorizedException('User is inactive, talk with an admin');
        
        return user;
    }
}