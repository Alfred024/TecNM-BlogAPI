import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CreateBloggerDto } from 'src/blogger/dto/create-blogger.dto';
import { Blogger } from 'src/blogger/entities/blogger.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
// Module
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { BloggerModule } from 'src/blogger/blogger.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports:[
    ConfigModule,

    TypeOrmModule.forFeature([User]),

    PassportModule.register({'defaultStrategy': 'jwt'}),

    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    }),

    // Modules components
    BloggerModule,
    // DTO´s
    CreateBloggerDto, Blogger
  ],
  exports: [
    TypeOrmModule, JwtModule, PassportModule, 
  ],
})
export class AuthModule {}
