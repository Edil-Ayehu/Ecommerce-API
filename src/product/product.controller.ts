import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) {}

    @Post('create-product')
    create(@Body() body: {name:string, price:number, description:string}) {
        return this.productService.create(body)
    }

    @Get()
    findAll() {
        return this.productService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id:number) {
        return this.productService.findOne(id)
    }
}
