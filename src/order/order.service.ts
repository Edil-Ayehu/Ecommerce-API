import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductService } from 'src/product/product.service';
import { CheckoutDto } from './dto/checkout.dto';
import { CartService } from 'src/cart/cart.service';
import { Product } from 'src/product/product.entity';
import { Cart } from 'src/cart/cart.entity';
import { OrderItem } from './order-item.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { take } from 'rxjs';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,

        @InjectRepository(Product)
        private productRepository: Repository<Product>,

        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        private cartService: CartService,
    ){}

    async checkout(userId:string, checkoutDto: CheckoutDto) {
        const cartItems = await this.cartRepository.find({
            where: {user: {id: userId}},
            relations: ['product','user']
        })

        if (cartItems.length === 0) {
            throw new BadRequestException("Your cart is empty. Add items to cart.");
        }

        // Create order entity
        const order = new Order();
        order.user =cartItems[0].user;
        order.paymentMethod = checkoutDto.paymentMethod;
        order.shippingAddress = checkoutDto.shippingAddress;
        order.orderNumber = await this.generateOrderNumber();
        order.items = [];

        for(const item of cartItems) {
            // optionally reduce stock
            if (item.product.stock! < item.quantity) {
                throw new BadRequestException(`Product ${item.product.name} does not have enough stock.`);
            }

            if (item.product.stock) {
                item.product.stock -= item.quantity;
                await this.productRepository.save(item.product)
            }

            const orderItem = new OrderItem();
            orderItem.product = item.product;
            orderItem.quantity = item.quantity;

            order.items.push(orderItem);
        }

        // save the full order with items
        const savedOrder = await this.orderRepository.save(order);

        // clear the cart
        await this.cartService.clearCartForUser(userId)

        return {
            message: "Checkout completed successfully.",
            orderNumber: savedOrder.orderNumber,
            paymentMethod: checkoutDto.paymentMethod,
            shippingAddress: checkoutDto.shippingAddress,
            orderCount: savedOrder.items.length,
            order: savedOrder,
        }
    }

    // this is for admin
    async findAllOrders(paginationDto: PaginationDto) {
        const [data, total] = await this.orderRepository.findAndCount({
            skip: (paginationDto.page - 1) * paginationDto.limit,
            take: paginationDto.limit,
            relations: ['user','items']
        });

        return {
            data,
            page: paginationDto.page,
            limit: paginationDto.limit,
            total,
        }
    }


    async findMyOrders(userId: string, paginationDto: PaginationDto) {
        const [data, total] = await this.orderRepository.findAndCount({
            where: {user: {id: userId}},
            relations: ['user', 'items'],
            skip: (paginationDto.page - 1) * paginationDto.limit,
            take: paginationDto.limit,
        })

        return {
            data,
            page: paginationDto.page,
            limit: paginationDto.limit,
            total,
        }
    }

    async generateOrderNumber(): Promise<string> {
        const lastOrder = await this.orderRepository.find({
            order: {id : 'DESC'},
            take: 1,
        })
        const lastId = lastOrder[0]?.id ?? 0;
        const nextId = lastId + 1;

        return `ORD-${nextId.toString().padStart(8,'0')}`;
    }
}
