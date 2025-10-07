import { IsNumber, IsPositive, IsString, Min } from "class-validator"

export class AddCartItemDto {
    @IsNumber()
    @IsPositive()
    @Min(1)
    quantity: number = 1

    @IsString()
    productId: string
}