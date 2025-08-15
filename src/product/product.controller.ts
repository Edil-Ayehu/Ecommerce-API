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

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id:number) {
        return this.productService.findOne(id)
    }

    @Delete('soft-delete/:id')
    @Roles('admin', 'superadmin')
    softDelete(@Param('id', ParseIntPipe) id:number) {
        return this.productService.softDelete(id)
    }


    @Delete('delete-product/:id')
    @Roles('admin', 'superadmin')
    deleteProduct(@Param('id', ParseIntPipe) id:number) {
        return this.productService.deleteProduct(id)
    }
}
