import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfirmationEmailDto } from './dto/confirmation-email';

@Injectable()
export class EmailService {
    constructor(
        private config: ConfigService,

        private mailService : MailerService
    ){}
    

    async sendConfirmationEmail(confirmationEmailDto : ConfirmationEmailDto){
        const { destinationEmail } = confirmationEmailDto;

        await this.mailService.sendMail({
            to: destinationEmail,
            from: 'MS_FOAzp1@trial-0p7kx4xqm27g9yjr.mlsender.net',
            //from: 'alfredo.jimeneztellez9@gmail.com',
            subject: 'Verificación BLOG TECnM',
            template: 'email-template',
            context:{
                email_template: confirmationEmailDto,
            }
        });
    }
}
