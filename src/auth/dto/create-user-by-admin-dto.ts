import { IsEmail, IsString, Matches, MaxLength, MinLength, } from 'class-validator';


export class CreateUserByAdminDto {

    @IsString()
    @IsEmail()
    email: string;
}