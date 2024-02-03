import { Module } from '@nestjs/common';
import { BloggerService } from './blogger.service';
import { BloggerController } from './blogger.controller';
// DTO´s
import { CreateBloggerDto } from './dto/create-blogger.dto';
import { Blogger } from './entities/blogger.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [BloggerController],
  providers: [BloggerService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Blogger]),
  ],
  exports: [
    TypeOrmModule,
    // DTO´s and Entities
    //CreateBloggerDto, Blogger,
  ],
})
export class BloggerModule {}
