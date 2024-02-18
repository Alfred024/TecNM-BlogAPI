import { Module } from '@nestjs/common';
import { BloggerService } from './blogger.service';
import { BloggerController } from './blogger.controller';
// DTO´s
import { CreateBloggerDto } from './dto/create-blogger.dto';
import { Blogger } from './entities/blogger.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Blog } from 'src/blog/entities/blog.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [BloggerController],
  providers: [BloggerService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Blogger, Blog]),
    //AuthModule, 

    // Require to use the JWTGuard
    PassportModule, JwtModule,
  ],
  exports: [
    TypeOrmModule,
    // DTO´s and Entities
    //CreateBloggerDto, Blogger,
  ],
})
export class BloggerModule {}
