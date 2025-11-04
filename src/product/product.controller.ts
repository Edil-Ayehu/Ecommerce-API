import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ResponseDto } from 'src/common/dto/response.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/common/services/cloudinary_service';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/category.entity';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
         private readonly cloudinaryService: CloudinaryService,

         @InjectRepository(Category)
         private readonly categoryRepository: Repository<Category>

    ) {}

  @Post('create-product')
  @Roles('admin', 'superadmin')
@UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {

     // Separate files by fieldname
    const thumbnail = files.find(f => f.fieldname === 'thumbnailImage');
    const additionalImages = files.filter(f => f.fieldname === 'images');


    if (!thumbnail) {
      throw new BadRequestException('Thumbnail image is required');
    }

    // Upload thumbnail
    const thumbnailUrl = await this.cloudinaryService.uploadImage(
      thumbnail,
      'products/thumbnails',
    );

       // Upload additional images
    const additionalImageUrls = await Promise.all(
      additionalImages.map(file =>
        this.cloudinaryService.uploadImage(file, 'products/images'),
      ),
    );

    const category = await this.categoryRepository.findOne({
       where: { id: createProductDto.categoryId },
     });

    if (!category) {
       throw new BadRequestException('Invalid categoryId');
     }

      const product = await this.productService.create({
          ...createProductDto,
          thumbnailImage: thumbnailUrl,
          images: additionalImageUrls,
          category, // now TypeScript is happy
       });

    return new ResponseDto(product, 'Product created successfully!');
  }

    @Get('get-all-products')
    async findAll(@Query() paginationDto: PaginationDto) {
        const result = await this.productService.findAll(paginationDto);
        return new ResponseDto(result, "Products fetched successfully!")
    }

    @Get('fetch-featured-products')
    async fetchFeaturedProducts(
      @Query() paginationDto: PaginationDto,
    ) {
      const result = await this.productService.fetchFeaturedProducts(paginationDto);
      return new ResponseDto(result, 'Featured products fetched successfully!');
    }

    @Get('detail/:id')
    async findOne(@Param('id', new ParseUUIDPipe({version: '4'})) id:string) {
        const result = await this.productService.findOne(id)
        return new ResponseDto(result, "Product detail fetched successfully!")
    }

    @Delete('soft-delete/:id')
    @Roles('admin', 'superadmin')
    async softDelete(@Param('id', ParseIntPipe) id:string) {
        const result = await this.productService.softDelete(id)
        return new ResponseDto(result, 'Product deleted successfully!');
    }


    @Delete('delete-product/:id')
    @Roles('admin', 'superadmin')
    async deleteProduct(@Param('id', ParseIntPipe) id:string) {
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
