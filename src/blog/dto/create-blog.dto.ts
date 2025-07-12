import { ArrayNotEmpty, ArrayUnique, IsArray, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator"

export class CreateBlogDto {
    @IsString()
    @IsNotEmpty()
    title:string

    @IsString()
    @IsNotEmpty()
    content:string

    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsOptional()
    @IsString({each: true})
    tags?: string[]

    @IsInt()
    @Min(1)
    @IsOptional()
    minRead?: number;

    @IsString()
    @IsOptional()
    imageUrl?: string
}