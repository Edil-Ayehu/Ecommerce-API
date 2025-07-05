import { IsNumber, IsPositive, Min } from "class-validator"

export class AddCartItemDto {
    @IsNumber()
    @IsPositive()
    @Min(1)
    quantity: number = 1

    @IsNumber()
    @IsPositive()
    productId: number
}