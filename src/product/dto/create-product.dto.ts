import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator"

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    price: number

    @IsString()
    @IsOptional()
    description?: string
}