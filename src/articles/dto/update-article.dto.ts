import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsNotEmpty, IsObject, ValidateNested } from "class-validator";

import { CreateArticleElementDto } from "./create-article.dto";

class UpdateArticleElementDto extends PartialType(
    OmitType(CreateArticleElementDto, ['tagList'] as const),
) { }

export class UpdateArticleDto {
    @IsNotEmpty()
    @IsObject()
    @Type(() => UpdateArticleElementDto)
    @ValidateNested()
    article: UpdateArticleElementDto
}