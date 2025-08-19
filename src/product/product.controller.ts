import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ResponseDto } from 'src/common/dto/response.dto';

@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) {}

    @Post('create-product')
    @Roles('admin', 'superadmin')
    async create(@Body() createProductDto: CreateProductDto) {
        const result = await this.productService.create(createProductDto)
        return new ResponseDto(result, "Product created successfully!")
    }

    @Get('get-all-products')
    async findAll(@Query() paginationDto: PaginationDto) {
        const result = await this.productService.findAll(paginationDto);
        return new ResponseDto(result, "Products fetched successfully!")
    }

    @Get('detail/:id')
    async findOne(@Param('id', ParseIntPipe) id:number) {
        const result = await this.productService.findOne(id)
        return new ResponseDto(result, "Product detail fetched successfully!")
    }

    @Delete('soft-delete/:id')
    @Roles('admin', 'superadmin')
    async softDelete(@Param('id', ParseIntPipe) id:number) {
        const result = await this.productService.softDelete(id)
        return new ResponseDto(result, 'Product deleted successfully!');
    }


    @Delete('delete-product/:id')
    @Roles('admin', 'superadmin')
    async deleteProduct(@Param('id', ParseIntPipe) id:number) {
        const result = await this.productService.deleteProduct(id)
        return new ResponseDto(result, "Product permanently deleted successfully!");
    }

    // product.controller.ts
    @Get('stats')
    @Roles('admin', 'superadmin')
    async getStats() {
     const result = await this.productService.getProductStats();
     return new ResponseDto(result, "Product stats fetched successfully!");
    }

}
