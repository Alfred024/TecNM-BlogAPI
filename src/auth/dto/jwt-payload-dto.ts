import { IsNumber } from "class-validator";

export class JwtPayloadDto{
   @IsNumber()
   sub : number;
}