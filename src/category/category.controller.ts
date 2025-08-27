import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ResponseDto } from 'src/common/dto/response.dto';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) {}

    @Post('create-category')
    @Roles('admin','superadmin')
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        const result = await this.categoryService.create(createCategoryDto)
        return new ResponseDto(result,'Category created successfully')
    }

    @Get('find-all-categories')
    async findAll(@Query() paginationDto:PaginationDto) {
        const result = await this.categoryService.findAll(paginationDto)
        return new ResponseDto(result,'Categories fetched successfully')
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id:number) {
        const result = await this.categoryService.findOne(id)
        return new ResponseDto(result,'Category fetched successfully');
    }

    @Patch('update-category/:id')
    @Roles('admin','superadmin')
    async update(@Param('id',ParseIntPipe) id:number, @Body() updateCategoryDto: UpdateCategoryDto){
        const result = await this.categoryService.update(id,updateCategoryDto)
        return new ResponseDto(result,'Category updated successfully')
    }

    @Delete('delete-category/:id')
    @Roles('admin','superadmin')
    async remove(@Param('id', ParseIntPipe) id:number) {
        const result = await this.categoryService.remove(id)
        return new ResponseDto(result,'Category deleted successfully');
    }
}
