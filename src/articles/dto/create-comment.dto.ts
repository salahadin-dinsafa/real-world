import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsObject, ValidateNested } from "class-validator";

export class CreateCommentElementDto {
    @IsNotEmpty()
    @IsString()
    body: string;
}

export class CreateCommentDto {
    @IsNotEmpty()
    @IsObject()
    @Type(() => CreateCommentElementDto)
    @ValidateNested()
    comment: CreateCommentElementDto
}