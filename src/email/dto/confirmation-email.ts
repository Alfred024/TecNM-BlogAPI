import { IsEmail, IsString, } from "class-validator";

export class ConfirmationEmailDto{
    @IsString()
    @IsEmail()
    destinationEmail : string;

    // @IsString()
    // @IsEmail()
    // bloggerName : string;

    // @IsString()
    // token : string;
}