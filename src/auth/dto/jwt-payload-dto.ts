import { IsEmail, IsNumber, IsString } from "class-validator";

export class JwtPayloadDto{
   @IsNumber()
   sub : number;
}