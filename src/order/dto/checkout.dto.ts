import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CheckoutDto {
    @IsString()
    @IsNotEmpty()
    paymentMethod: string; // e.g: 'credit_card', 'paypal'

    @IsString()
    @IsOptional()
    shippingAddress?: string;
}