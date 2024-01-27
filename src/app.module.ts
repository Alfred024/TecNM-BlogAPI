import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfig } from './config/env.config';
import { JoiValidationSchema } from './config/validation.schema';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig],
      validationSchema: JoiValidationSchema,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService : ConfigService) =>({
        type: 'postgres',
        host: configService.get('db_host'),
        port: configService.get('db_port'),
        username: configService.get('db_user'),
        password: configService.get('db_user_pwd'),
        //database: '5432',
        database: configService.get('db_name'),
        autoLoadEntities: true,
        synchronize: true,
      })
    }),    
  ],
})
export class AppModule {}
