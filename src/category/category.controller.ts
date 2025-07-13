import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) {}

    @Post('create-category')
    @Roles('admin','superadmin')
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto)
    }

    @Get('find-all-categories')
    findAll() {
        return this.categoryService.findAll()
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id:number) {
        return this.categoryService.findOne(id)
    }

    @Patch('update-category/:id')
    @Roles('admin','superadmin')
    update(@Param('id',ParseIntPipe) id:number, @Body() updateCategoryDto: UpdateCategoryDto){
        return this.categoryService.update(id,updateCategoryDto)
    }

    @Delete('delete-category/:id')
    @Roles('admin','superadmin')
    remove(@Param('id', ParseIntPipe) id:number) {
        return this.categoryService.remove(id)
    }
}
