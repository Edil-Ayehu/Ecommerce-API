import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage} from 'multer';
import { Express } from 'express-serve-static-core';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) {}

  @Post('create-category')
  @Roles('admin', 'superadmin')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/categories',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, file.fieldname + '-' + uniqueSuffix + ext);
        },
      }),
    }),
  )
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const result = await this.categoryService.create({
      ...createCategoryDto,
      imageUrl: file.filename, // or full path if you want
    });

    return new ResponseDto(result, 'Category created successfully');
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
