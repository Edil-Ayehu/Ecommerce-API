import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,

        private readonly categoryService: CategoryService,
    ) {}

    async create(createProductDto: Partial<Product> & { thumbnailImage: string; images?: string[] }) {
  const product = this.productRepository.create(createProductDto);
  return await this.productRepository.save(product);
}


    async findAll(paginationDto:PaginationDto){
        const {page, limit,name} = paginationDto

        const where = name 
        ? { name: ILike(`%${name}%`) } // partial match on category name
        : {};
        
        const [data, total] = await this.productRepository.findAndCount({
            where,
            skip: (page - 1) * limit,
            take: limit,
        })

        return {
            data,
            total,
            page,
            limit,
        }
    }

    findOne(id: string){
        return  this.productRepository.findOne({where: {id}})
    }

    async softDelete(id:string) {
        const product = await this.productRepository.findOne({
            where: {id}
        });

        if(!product) throw new NotFoundException("Product not found")

        await this.productRepository.softDelete(id)
        return {
            id,
            deleted: true,
        }
    }

    async deleteProduct(id: string) {
        const product = await this.productRepository.findOne({
            where: {id}
        });

        if(!product) throw new NotFoundException("Product not found with the given product Id " + id)

        await this.productRepository.delete(id)
        return {
            id,
            deleted: true,
        }
    }

    // product.service.ts
async getProductStats() {
  const totalProducts = await this.productRepository.count();

  const avgRating = await this.productRepository
    .createQueryBuilder('product')
    .select('AVG(product.averageRating)', 'avg')
    .getRawOne();

  const bestSelling = await this.productRepository.find({
    order: { salesCount: 'DESC' },
    take: 5,
    select: ['id', 'name', 'salesCount', 'price', 'thumbnailImage'],
  });

  const lowStock = await this.productRepository.find({
    where: { stock: 0 },
    select: ['id', 'name', 'stock'],
  });

  const recentlyAdded = await this.productRepository.find({
    order: { createdAt: 'DESC' },
    take: 5,
    select: ['id', 'name', 'price', 'createdAt'],
  });

  return {
    totalProducts,
    averageRating: Number(avgRating.avg) || 0,
    bestSelling,
    lowStock,
    recentlyAdded,
  };
}

}
