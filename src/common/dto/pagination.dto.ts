import { Type } from "class-transformer"
import { IsDateString, IsOptional, IsPositive, IsString, Min } from "class-validator"

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

    @IsOptional()
    @IsDateString()
    startDate?:Date // e.g. 2025-10-01

    @IsOptional()
    @IsDateString()
    endDate?:Date  // e.g. 2025-10-01
}