import { IsNotEmpty, IsNumber, IsPositive , Min} from "class-validator"

export class CreateOrderDto {
    @IsNumber()
    @Min(1)
    quantity: number = 1

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    productId: number
}