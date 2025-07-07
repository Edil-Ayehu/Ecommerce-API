import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>
    ) {}

    create(data: Partial<Product>){
        return this.productRepository.save(data)
    }

    async findAll(paginationDto:PaginationDto){
        const [data, total] = await this.productRepository.findAndCount({
            skip: (paginationDto.page - 1) * paginationDto.limit,
            take: paginationDto.limit,
        })

        return {
            data,
            total,
            page : paginationDto.page,
            limit: paginationDto.limit,
        }
    }

    findOne(id: number){
        return  this.productRepository.findOne({where: {id}})
    }

    async softDelete(id:number) {
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

    async deleteProduct(id: number) {
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
}
