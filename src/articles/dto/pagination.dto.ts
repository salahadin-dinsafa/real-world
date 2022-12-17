import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @IsString()
    tag?: string;

    @IsOptional()
    @IsString()
    author?: string;

    @IsOptional()
    @IsString()
    favorited?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    offset?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    limit?: number;
}