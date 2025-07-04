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

    findAll(){
        return this.productRepository.find()
    }

    findOne(id: number){
        return  this.productRepository.findOne({where: {id}})
    }
}
