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
import { Career } from 'src/career/entities/career.entity';
import { JWTGuard } from './guards/jwt.guard';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
// import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';

@Module({
  controllers: [AuthController],
  //providers: [AuthService, JwtStrategy, JWTGuard],
  imports:[
    ConfigModule,

    TypeOrmModule.forFeature([User]),

    PassportModule.register({'defaultStrategy': 'jwt'}),

    JwtModule.register({}),
    
    // JwtModule.registerAsync({
    //   imports: [ ConfigModule ],
    //   inject: [ ConfigService ],
    //   useFactory: ( configService: ConfigService ) => {
    //     return {
    //       secret: configService.get('jwt_secret'),
    //       signOptions: {
    //         expiresIn: '3600s'
    //       }
    //     }
    //   }
    // }),

    // Modules components
    BloggerModule, Career,
    // EmailModule,
    // DTO´s
    CreateBloggerDto, Blogger
  ],
  providers: [AuthService, JwtStrategy, RefreshJwtStrategy, JWTGuard,],
  exports: [
    TypeOrmModule, JwtModule, PassportModule, 
  ],
})
export class AuthModule {}
