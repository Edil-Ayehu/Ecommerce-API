import { Injectable, NotFoundException } from '@nestjs/common';
import { Between, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
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
        const {page, limit,name, startDate, endDate} = paginationDto

        const where: any = {};

          // Name filter
         if (name) {
             where.name = ILike(`%${name}%`);  // Partial match on product name (ILike is case-insensitive)
          }

          // Date filter (assuming your entity has a field like 'createdAt')
        if (startDate && endDate) {
          where.createdAt = Between(new Date(startDate), new Date(endDate));
        } else if (startDate) {
          where.createdAt = MoreThanOrEqual(new Date(startDate));
        } else if (endDate) {
          where.createdAt = LessThanOrEqual(new Date(endDate));
        }
        
        const [products, total] = await this.productRepository.findAndCount({
            where,
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' }, // optional
        })

        return {
            products,
            total,
            page,
            limit,
        }
    }

    async fetchFeaturedProducts (paginationDto: PaginationDto) {
      const { page, limit, name, startDate, endDate} = paginationDto;

      const [featuredProducts, total] = await this.productRepository.findAndCount({
          where: {isFeatured: true},
          skip: (page - 1) * limit,
          take: limit,
          order: { createdAt: 'DESC'},
      });

      return {
        featuredProducts,
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
