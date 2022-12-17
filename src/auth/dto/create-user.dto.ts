import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    Matches,
    IsOptional
} from "class-validator";

export class CreateUserDto {
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