import { IsNumber, IsPositive } from "class-validator";

export class AddWishlistDto {
    @IsNumber()
    @IsPositive()
    productId: number
}