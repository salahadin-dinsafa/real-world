import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsObject, ValidateNested } from "class-validator";
class LoginEelementDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}

export class LoginDto {
    @IsNotEmpty()
    @Type(() => LoginEelementDto)
    @IsObject()
    @ValidateNested()
    user: LoginEelementDto;
}