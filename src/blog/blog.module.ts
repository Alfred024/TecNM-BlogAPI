import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  controllers: [BlogController],
  providers: [BlogService],
  imports: [
    // ConfigModule,
    // JwtModule.registerAsync({
    //   imports: [ ConfigModule ],
    //   inject: [ ConfigService ],
    //   useFactory: ( configService: ConfigService ) => {
    //     return {
    //       secret: configService.get('jwt_secret'),
    //       signOptions: {
    //         expiresIn: '2h'
    //       }
    //     }
    //   }
    // }),
    TypeOrmModule.forFeature([Blog])
  ],
  exports: [ TypeOrmModule, BlogModule ],
})
export class BlogModule {}
