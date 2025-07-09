import { IsEmail, IsNotEmpty, IsString, MinLength, minLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}