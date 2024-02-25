import { Module } from '@nestjs/common';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Career } from './entities/career.entity';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CareerController],
  providers: [CareerService],
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([Career])
  ],
  exports: [TypeOrmModule ]
})
export class CareerModule {}
