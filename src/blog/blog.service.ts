import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination-dto';

@Injectable()
export class BlogService {

  private readonly logger = new Logger('BlogService');

  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository : Repository<Blog>,

    private readonly dataSource: DataSource,
  ){}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const blogs = await this.blogRepository.find({
      take: limit, 
      skip: offset, 
    });
    return blogs;
  }

  async findOne(term: string) {
    let blog : Blog;

    if(Number.isNaN(+term)){
      const queryBuilder = this.blogRepository.createQueryBuilder('bloger');
      blog = await queryBuilder.where('name =:name or first_username =:first_username or second_username =:second_username', 
      {name: term, first_username: term, second_username: term}).getOne();
    }else{
      blog = await this.blogRepository.findOneBy({id_blog: +term})
    }

    if (!blog) throw new NotFoundException(`Blgger with term: ${term} not found`);

    return blog;
  }

  async update(id_blog: number, updateBlogDto: UpdateBlogDto) {
    const blog = await this.blogRepository.preload({
      id_blog, ...updateBlogDto
    });
    if (!blog) throw new NotFoundException(`Blog with id: ${id_blog} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save( blog );
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return blog;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    // const blog = await this.findOne(id);
    // const bloggerDeleted = await this.blogRepository.remove(blog);
    // return bloggerDeleted;
    return 'Create code to delete BLOG';
  }

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
