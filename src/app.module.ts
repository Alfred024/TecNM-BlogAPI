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



@Module({
  imports: [

    MailerModule.forRoot({
      transport:{
        //service: 'gmail',
        host: 'smtp.mailersend.net',
        //host: 'trial-0p7kx4xqm27g9yjr.mlsender.net',
        port: 587,
        secure: false,
        auth:{
          user: 'MS_wycBDv@trial-0p7kx4xqm27g9yjr.mlsender.net',
          pass: 'pgCy8kTxOfhClU5l',
          //user: 'apikey',
          //pass: 'mlsn.8111fc8bc67c011e8f38b6dee48924023fcb0eae75ded285858dc5c9d695d87c',
        },
        tls: {
          rejectUnauthorized: false
        }
      }
    }),

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

// // Config 2
// ConfigModule.forRoot({
//   load: [EnvConfig],
//   validationSchema: JoiValidationSchema,
// }),

// TypeOrmModule.forRootAsync({
//   imports: [ConfigModule],
//   inject: [ConfigService],
//   useFactory: (configService : ConfigService) =>({
//     type: 'postgres',
//     host: configService.get('db_host'),
//     port: configService.get('db_port'),
//     username: configService.get('db_user'),
//     password: configService.get('db_user_pwd'),
//     database: configService.get('db_name'),
//     autoLoadEntities: true,
//     synchronize: true,
//   })
// }),