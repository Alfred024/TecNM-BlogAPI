import { IsEmail, IsString, } from "class-validator";

export class ConfirmationEmailDto{
    @IsString()
    @IsEmail()
    destinationEmail : string;

    @IsString()
    token : string;
}