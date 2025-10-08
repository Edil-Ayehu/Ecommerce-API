import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express-serve-static-core';
import { CloudinaryService } from 'src/common/services/cloudinary_service';
import { SkipThrottle } from '@nestjs/throttler';

// @SkipThrottle() // we can make the rate limit to skip this controller by adding @SkipThrottle() decorator
@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

     @Post('create-category')
  @UseInterceptors(FileInterceptor('image'))

  // @SkipThrottle() // we can also add this controller to only the endpoints that we want to skip rate limit
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    // Upload to Cloudinary via service
    const imageUrl = await this.cloudinaryService.uploadImage(file, 'categories');

    const result = await this.categoryService.create({
      ...createCategoryDto,
      imageUrl, // store Cloudinary URL
    });

    return new ResponseDto(result, 'Category created successfully');
  }

    // @SkipThrottle({default: false}) // by making the default to false, we can prevent the skip in a particular endpoint when SkipThrottle() decorator placed in the controller
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
