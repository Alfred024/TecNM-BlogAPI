import { Controller, Get, Post, Body, Patch, Param, Delete,  Query, UseGuards } from '@nestjs/common';
import { BloggerService } from './blogger.service';
import { UpdateBloggerDto } from './dto/update-blogger.dto';
//import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { CreateBlogDto } from 'src/blog/dto/create-blog.dto';
import { PaginationDto } from 'src/common/dtos/pagination-dto';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { CheckApiKeyGuard } from 'src/auth/guards/check-api-key.guard';
import { RoleProtected } from 'src/auth/decorators/role.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { UpdateBlogDto } from 'src/blog/dto/update-blog.dto';

@Controller('blogger')
export class BloggerController {
  constructor(private readonly bloggerService: BloggerService) {}

  @Get()
  findAll(@Query() paginationDto : PaginationDto ){
    return this.bloggerService.fingBloggers(paginationDto);
  }

  @Get('my-blogs')
  @UseGuards(JWTGuard)
  findAllMine() {
    return this.bloggerService.findMyBlogs();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.bloggerService.findOne(term);
  }

  @Post('create-new-blog')
  @UseGuards(JWTGuard)
  createBlog(@Body() createBlogDto : CreateBlogDto ){
    return this.bloggerService.createBlog(createBlogDto);
  }

  @Patch('update-blog/:id')
  @UseGuards(JWTGuard)
  updateBlog(
    @Param('id') id: string, 
    @Body() updateBlogtDto: UpdateBlogDto,
  ){
    return this.bloggerService.updateBlog(id, updateBlogtDto);
    return 'blogUpdated';
  }

  // @Delete('delete-blog')
  // @UseGuards(JWTGuard)
  // deleteBlog(@Body() createBlogDto : CreateBlogDto ){
  //   return this.bloggerService.createBlog(createBlogDto);
  // }

  @Patch('update-blogger/:id')
  // Checar que el rol sea admin u owner
  update(@Param('id') id: string, @Body() updateBloggerDto: UpdateBloggerDto) {
    return this.bloggerService.update(+id, updateBloggerDto);
  }

  @Delete(':id')
  // Checar que el rol sea admin u owner
  @UseGuards(CheckApiKeyGuard)
  remove(@Param('id') id: string) {
    return this.bloggerService.remove(id);
  }
}
