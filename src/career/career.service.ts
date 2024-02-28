import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { DataSource, Repository } from 'typeorm';
import { Career } from './entities/career.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CareerService {
  constructor(
    @InjectRepository(Career)
    private readonly careerRepository : Repository<Career> ,

    private readonly dataSource : DataSource,
  ){}

  async create(createCareerDto: CreateCareerDto) {
    try {
      const { name, key } = createCareerDto;
  
      const career = await this.careerRepository.create({
        name: name,
        key: key,
      });
  
      await this.careerRepository.save(career);
      return career;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async findAll() {
    return await this.careerRepository.find();
  }

  async findOne(term: string) {
    let career : Career;

    if(Number.isNaN(+term)){
      const queryBuilder = this.careerRepository.createQueryBuilder('career');
      career = await queryBuilder.where('name =:name', 
      {name: term}).getOne();
    }else{
      career = await this.careerRepository.findOneBy({id_career: +term})
    }

    if (!career) throw new NotFoundException(`Career with term: ${term} not found`);

    return career;
  }

  async update(id_career: number, updateCareerDto: UpdateCareerDto) {
    const career = await this.careerRepository.preload({
      id_career, ...updateCareerDto
    });
    if (!career) throw new NotFoundException(`Blgger with id: ${id_career} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save( career );
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return career;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async remove(id: string) {
    const career = await this.findOne(id);
    try {
      await this.careerRepository.delete(career);
      return `Deletion succesfull`;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  private handleErrors( error: any ): never {
    if ( error.code === '23505' ) 
      throw new BadRequestException( error.detail );

    console.log(error)

    throw new InternalServerErrorException('Please check server logs');

  }
}
