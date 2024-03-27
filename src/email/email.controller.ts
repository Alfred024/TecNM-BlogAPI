import { MailerService, MailerOptions } from '@nestjs-modules/mailer';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('email')
export class EmailController {

    constructor(
        private mailService : MailerService
    ){}

    @Get('ola')
    saludo(){
        return "OLA DESDE EMAIL CONTROLLER";
    }
    
    @Get('plain-text-email')
    async plainTextEmail(@Query('toemail') toemail) {
        await this.mailService.sendMail({
            to: toemail,
            from: 'MS_FOAzp1@trial-0p7kx4xqm27g9yjr.mlsender.net',
            subject: 'Verificación BLOG TECnM',
            text: 'OLA '
        });

        return "Email succesfully sended!!"
    }
}
