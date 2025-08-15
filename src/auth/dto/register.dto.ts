import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator"

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, {
            message: 'Password must contain at least one number, one uppercase letter and one special character',
        })
    password: string
}