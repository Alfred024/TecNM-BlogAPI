import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { UpdateBloggerDto } from './dto/update-blogger.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Blogger } from './entities/blogger.entity';
import { Blog } from 'src/blog/entities/blog.entity';
import { CreateBlogDto } from 'src/blog/dto/create-blog.dto';

@Injectable()
export class BloggerService {
   
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Blogger)
    private readonly bloggerRepository : Repository<Blogger>,

    @InjectRepository(Blog)
    private readonly blogRepository : Repository<Blog>,

    private readonly dataSource: DataSource,
  ){}

  findAll() {
    return `Returns all blogger`;
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

  async update(id_blogger: number, updateBloggerDto: UpdateBloggerDto) {
    const blogger = await this.bloggerRepository.preload({
      id_blogger, ...updateBloggerDto
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

  async remove(id: string) {
    const blogger = await this.findOne(id);
    await this.bloggerRepository.remove(blogger);
  }

  //Obtener los blogs del usuario 
  findBlogs(){
    // Usa el payloda del blogger para hacer obtener sus blogs
    return `User blogs`;
  }

  createBlog(createBlogDto : CreateBlogDto){
    // #1 Obtiene el id_blogger de la request
    // #2 Agrega el id al body


    return `Creation of a blog`;
  }

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
