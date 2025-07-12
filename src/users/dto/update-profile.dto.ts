import { IsOptional, IsString } from "class-validator";

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    fullName?:string;

    @IsString()
    @IsOptional()
    phone?:string;

    @IsString()
    @IsOptional()
    address?:string;

    @IsString()
    @IsOptional()
    avatar?:string;
}