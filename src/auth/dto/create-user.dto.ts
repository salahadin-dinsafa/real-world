import { Type } from "class-transformer";
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    Matches,
    IsOptional,
    ValidateNested,
    IsObject
} from "class-validator";




export class CreateUserElementDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak' },)
    password: string;

    @IsOptional()
    @IsString()
    bio: string;

    @IsOptional()
    @IsString()
    image: string;
}

export class CreateUserDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateUserElementDto)
    @IsObject()
    user: CreateUserElementDto;
}