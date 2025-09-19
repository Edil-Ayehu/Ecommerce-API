import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CloudinaryService } from 'src/common/services/cloudinary_service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService,CloudinaryService],
  imports: [
    TypeOrmModule.forFeature([Category])
  ],
  exports: [CategoryService, CloudinaryService]
})

export class CategoryModule {}
