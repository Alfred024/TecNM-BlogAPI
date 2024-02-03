import { IsEmail, IsNumber, IsPositive, IsString, Matches, Max, MaxLength, MinLength } from 'class-validator';

const total_careers = 11;
export class CreateBloggerDto {

    // Take it from the JWT
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    name : string;

    @IsString()
    first_username : string;
    //first_lastname : string;
    @IsString()
    second_username: string;
    //second_lastname : string;

    @IsNumber()
    @IsPositive()
    @Max(total_careers)
    id_career : number;
}
