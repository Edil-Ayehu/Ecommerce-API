import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express-serve-static-core';
import cloudinary from 'src/config/cloudinary.config';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) {}

  @Post('create-category')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'categories' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(file.buffer);
    });

    const { secure_url } = uploadResult as any;

    const result = await this.categoryService.create({
      ...createCategoryDto,
      imageUrl: secure_url, // store only cloudinary URL
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
