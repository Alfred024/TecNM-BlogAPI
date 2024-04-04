import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { UpdateBloggerDto } from './dto/update-blogger.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Blogger } from './entities/blogger.entity';
import { Blog } from 'src/blog/entities/blog.entity';
import { CreateBlogDto } from 'src/blog/dto/create-blog.dto';
import { PaginationDto } from 'src/common/dtos/pagination-dto';
import { REQUEST } from '@nestjs/core';
import { User } from 'src/auth/entities/user.entity';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload-dto';
import { UpdateBlogDto } from 'src/blog/dto/update-blog.dto';

@Injectable()
export class BloggerService {
   
  private readonly logger = new Logger('BloggerService');

  constructor(
    @Inject(REQUEST) private readonly request : any,

    @InjectRepository(Blogger)
    private readonly bloggerRepository : Repository<Blogger>,

    @InjectRepository(Blog)
    private readonly blogRepository : Repository<Blog>,

    private readonly dataSource: DataSource,
  ){}

  private async findByUserBloggerId() : Promise<Blogger>{
    try {
      const payload : JwtPayloadDto = this.request.user;
      const sub : number = payload.sub;
      const blogger = await this.bloggerRepository.findOneBy({id_user_blogger : sub});
      return blogger;
    } catch (error) {
      throw Error('Blogger wansnt found');
    }
  }

  async findOne(term: string) {
    let blogger : Blogger;

    // Es un string
    if(Number.isNaN(+term)){
      const queryBuilder = this.bloggerRepository.createQueryBuilder('bloger');
      blogger = await queryBuilder.where('name =:name or first_username =:first_username or second_username =:second_username', 
      {name: term, first_username: term, second_username: term}).getOne();
    }else{
      blogger = await this.bloggerRepository.findOneBy({id_blogger: +term})
    }

    if (!blogger) throw new NotFoundException(`Blgger with term: ${term} not found`);

    return blogger;
  }

  async fingBloggers( paginationDto : PaginationDto ){
    const { limit = 20, offset = 0 } = paginationDto;

    const bloggers = await this.bloggerRepository.find({
      take: limit,
      skip: offset,
    });

    const bloggersResponse = bloggers.map(blogger => {
      delete blogger.blogs
      return blogger;
    });
    
    return bloggersResponse;
  }

  async findMyBlogs(){
    const blogger = await this.findByUserBloggerId();
    return blogger.blogs;
  }

  // TODO: Comprobar que funcione
  async update(id_blogger: number, updateBloggerDto: UpdateBloggerDto) {
    // const blogger = await this.bloggerRepository.preload({
    //   id_blogger, ...updateBloggerDto
    // });

    const {name, first_username, second_username, id_career} = updateBloggerDto;
    const blogger = await this.bloggerRepository.preload({
      'id_blogger': id_blogger,
      'name': name,
      'first_username': first_username,
      'second_username': second_username,
      'id_career': {'id_career': id_career},
    });
    if (!blogger) throw new NotFoundException(`Blgger with id: ${id_blogger} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save( blogger );
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return blogger;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async updateBlog(id:string, updateBlogDto : UpdateBlogDto) {
    const blog = await this.blogRepository.preload({id_blog: +id, ...updateBlogDto});
    
    if ( !blog ) throw new NotFoundException(`Blog with id: ${ id } wasn´t found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save( blog );
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return 'Blog succesfully updated!!';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }     
  }

  async remove(id: string) {
    const blogger = await this.findOne(id);
    const bloggerDeleted = await this.bloggerRepository.remove(blogger);
    return bloggerDeleted;
  }

  async createBlog(createBlogDto : CreateBlogDto){
    const blogger = await this.findByUserBloggerId();
    try {
      const blog = this.blogRepository.create({...createBlogDto, id_blogger: {id_blogger: blogger.id_blogger}});
      await this.blogRepository.save(blog);
      return `Succesfully creation of blog`;
    } catch (error) {
      return error;
    }
  }

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
