import { Type } from "class-transformer"
import { IsOptional, IsPositive, IsString, Min } from "class-validator"

export class PaginationDto {
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    page: number = 1

    @IsOptional()
    @Type(() => Number)
    @Min(1)
    limit: number = 10

    @IsOptional()
    @IsString()
    name?:string // ✅ Allow product name filtering
}