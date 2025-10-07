import { IsNumber, IsPositive, IsString } from "class-validator";

export class AddWishlistDto {
    @IsString()
    productId: string
}