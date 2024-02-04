import { IsEmail, IsString } from "class-validator";

export class JwtPayloadDto{

   @IsString()
   @IsEmail()
   email : string; 
}