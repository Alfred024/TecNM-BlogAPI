import { IsString } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";

export class CreateCareerDto {
    @IsString()
    name : string;

    @IsString()
    key : string;
}
