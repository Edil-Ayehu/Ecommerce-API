import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { OrderService } from './order.service';
import * as jwt from 'jsonwebtoken'

const JWT_SECRET = 'thisIsMyJWTSecretCode';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ) {}

    @Post()
    async create(@Body() body: {productId: number, quantity: number}, @Headers('authorization') auth: string) {
        const token = auth?.replace('Bearer', "");
        const payload: any = jwt.verify(token,JWT_SECRET);
        return this.orderService.create(payload.sub, body.productId, body.quantity);
    }

    @Get()
    findAll() {
        return this.orderService.findAll()
    }
}
