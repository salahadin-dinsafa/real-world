import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateArticleDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    body?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString({ each: true })
    tagList?: string[];
}