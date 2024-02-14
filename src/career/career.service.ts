import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { Repository } from 'typeorm';
import { Career } from './entities/career.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CareerService {
  constructor(
    @InjectRepository(Career)
    private readonly careerRepository : Repository<Career> 
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

  findAll() {
    return `This action returns all career`;
  }

  findOne(id: number) {
    return `This action returns a #${id} career`;
  }

  update(id: number, updateCareerDto: UpdateCareerDto) {
    return `This action updates a #${id} career`;
  }

  remove(id: number) {
    return `This action removes a #${id} career`;
  }

  private handleErrors( error: any ): never {
    if ( error.code === '23505' ) 
      throw new BadRequestException( error.detail );

    console.log(error)

    throw new InternalServerErrorException('Please check server logs');

  }
}
