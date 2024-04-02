import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PaginationDto } from 'src/common/dtos/pagination-dto';
import { CheckApiKeyGuard } from 'src/auth/guards/check-api-key.guard';

// Protegí temporalmente todas las rutas directas para la creación de un blog

@Controller('blog')
// @UseGuards(CheckApiKeyGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findAll(@Query() paginationDto:PaginationDto) {
    return this.blogService.findAll( paginationDto );
  }

  @Get(':id')
  findOne(@Param('term') term: string) {
    return this.blogService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
