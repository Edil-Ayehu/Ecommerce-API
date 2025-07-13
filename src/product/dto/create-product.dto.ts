import { Type } from "class-transformer"
import { IsArray, IsBoolean, IsDecimal, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from "class-validator"

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    price: number

    @IsDecimal()
    @IsPositive()
    @IsOptional()
    discountPercentage?: number

    @IsString()
    @IsNotEmpty()
    thumbnailImage: string

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    images?:string[] 

    @IsString()
    @IsOptional()
    description?: string

    @IsOptional()
    @IsInt()
    @Min(1)
    stock?: number = 1;

    @IsInt()
    @IsPositive()
    categoryId: number

    @IsNumber({allowNaN: false, allowInfinity: false})
    @Type(() => Number)
    @Min(0)
    @Max(5)
    @IsOptional()
    averageRating?: number = 0.0

    @IsOptional()
    @Min(0)
    @IsInt()
    numRatings?: number = 0;

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean

    @IsInt()
    @Min(0)
    @IsOptional()
    salesCount?: number = 0
}