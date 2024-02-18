import { Controller, Get, Post, Body, Patch, Param, Delete,  Query, UseGuards } from '@nestjs/common';
import { BloggerService } from './blogger.service';
import { UpdateBloggerDto } from './dto/update-blogger.dto';
//import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { CreateBlogDto } from 'src/blog/dto/create-blog.dto';
import { PaginationDto } from 'src/common/dtos/pagination-dto';
import { JWTGuard } from 'src/auth/guards/jwt.guard';

@Controller('blogger')
export class BloggerController {
  constructor(private readonly bloggerService: BloggerService) {}

  @Get('my-blogs')
  @UseGuards(JWTGuard)
  findAll(@Query() paginationDto:PaginationDto) {
    return this.bloggerService.findBlogs( paginationDto );
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.bloggerService.findOne(term);
  }

  @Post('create-new-blog')
  @UseGuards(JWTGuard)
  create(@Body() createBlogDto : CreateBlogDto ){
    return this.bloggerService.createBlog(createBlogDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBloggerDto: UpdateBloggerDto) {
    return this.bloggerService.update(+id, updateBloggerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bloggerService.remove(id);
  }
}
