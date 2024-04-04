import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfig } from './config/env.config';
import { JoiValidationSchema } from './config/validation.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BloggerModule } from './blogger/blogger.module';
import { CareerModule } from './career/career.module';
import { BlogModule } from './blog/blog.module';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { EmailModule } from './email/email.module';
import { join } from 'path';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';



@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig],
      validationSchema: JoiValidationSchema,
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService : ConfigService) =>({
        transport:{
          host: configService.get('smtp_host'),
          port: configService.get('smtp_port'),
          secure: false,
          auth:{
            user: configService.get('smtp_email'),
            pass: configService.get('smtp_pwd'),
          },
          tls: {
            rejectUnauthorized: false
          },
        },
        template:{
          dir: join(__dirname, 'email'),
          adapter: new HandlebarsAdapter()
        },
        
      }),
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
        database: configService.get('db_name'),
        autoLoadEntities: true,
        synchronize: true,
      })
    }),

    // API modules
    AuthModule, BloggerModule, CareerModule, BlogModule, EmailModule,    
  ],
})
export class AppModule {}