import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductService } from 'src/product/product.service';
import { CheckoutDto } from './dto/checkout.dto';
import { CartService } from 'src/cart/cart.service';
import { Product } from 'src/product/product.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,

        @InjectRepository(Product)
        private productRepository: Repository<Product>,

        private usersSerivce: UsersService,
        private productService: ProductService,
        private cartService: CartService,
    ){}

    async checkout(userId:number, dto: CheckoutDto) {
        const cartItems = await this.cartService.findAllForUser(userId)

        if (cartItems.length === 0) {
            throw new BadRequestException("Your cart is empty!");
        }

        const orders: Order[] = [];

        for(const item of cartItems) {
            // optionally reduce stock
            if (item.product.stock && item.product.stock < item.quantity) {
                throw new BadRequestException(`Product ${item.product.name} does not have enough stock.`);
            }

            if (item.product.stock) {
                item.product.stock -= item.quantity;
                await this.productRepository.save(item.product)
            }

            const order = this.orderRepository.create({
                user: item.user,
                product: item.product,
                quantity: item.quantity,
            });

            orders.push(await this.orderRepository.save(order))
        }

        // clear the cart
        await this.cartService.clearCartForUser(userId)

        return {
            message: "Checkout completed successfully.",
            paymentMethod: dto.paymentMethod,
            shippingAddress: dto.shippingAddress,
            orderCount: orders.length,
            orders,
        }
    }

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

    findAll(userId: number) {
        return this.orderRepository.find({relations: ['user', 'product']})
    }
}
