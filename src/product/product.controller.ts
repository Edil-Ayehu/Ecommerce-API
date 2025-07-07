import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) {}

    @Post('create-product')
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto)
    }

    @Get('get-all-products')
    findAll(@Query() paginationDto: PaginationDto) {
        return this.productService.findAll(paginationDto);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id:number) {
        return this.productService.findOne(id)
    }

    @Delete('soft-delete/:id')
    softDelete(@Param('id', ParseIntPipe) id:number) {
        return this.productService.softDelete(id)
    }
}
