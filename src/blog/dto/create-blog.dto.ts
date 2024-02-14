import { IsString } from "class-validator";

export class CreateBlogDto {

    @IsString()
    content : string;
    @IsString()
    title : string;
    @IsString()
    slug : string;
    @IsString()
    description : string;
}
