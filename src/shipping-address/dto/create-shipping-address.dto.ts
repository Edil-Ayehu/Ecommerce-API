import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateShippingAddressDto {
    @IsString()
    @IsNotEmpty()
    fullName:string

    @IsString()
    @IsNotEmpty()
    streetAddress:string

    @IsString()
    @IsNotEmpty()
    city:string

    @IsString()
    @IsNotEmpty()
    state:string

    @IsString()
    @IsNotEmpty()
    postalCode:string

    @IsString()
    @IsOptional()
    phone?:string
}