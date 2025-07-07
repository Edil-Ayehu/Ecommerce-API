import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>
    ) {}

    create(data: Partial<Product>){
        return this.productRepository.save(data)
    }

    async findAll(page: number, limit: number){
        const [data, total] = await this.productRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        })

        return {data,total,page,limit}
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
}
