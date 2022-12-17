import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsNotEmpty, IsObject, ValidateNested } from "class-validator";

import { CreateUserElementDto } from "./create-user.dto";

class UpdateUserElementDto extends PartialType(CreateUserElementDto) { }

export class UpdateUserDto {
    @IsNotEmpty()
    @IsObject()
    @Type(() => UpdateUserElementDto)
    @ValidateNested()
    user: UpdateUserElementDto
}