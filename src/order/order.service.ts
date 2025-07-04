import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        private usersSerivce: UsersService,
        private productService: ProductService,
    ){}

    async create(userId:number, productId:number, quantity: number) {
        const user = await this.usersSerivce.findById(userId)
        if (!user) {
            throw new NotFoundException('User not found with the given Id')
        }
        const product = await this.productService.findOne(productId)
        if (!product) {
            throw new NotFoundException('User not found with the given Id')
        }
        return this.orderRepository.save({ user, product, quantity})
    }

    findAll() {
        return this.orderRepository.find({relations: ['user', 'product']})
    }
}
