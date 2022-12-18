import { Type } from "class-transformer";
import { IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";

export class CreateArticleElementDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    body: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsString({ each: true })
    tagList?: string[];
}

export class CreateArticleDto {

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => CreateArticleElementDto)
    article: CreateArticleElementDto

}