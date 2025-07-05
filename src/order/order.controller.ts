import { Body, Controller, Get, Post, Headers, UnauthorizedException } from '@nestjs/common';
import { OrderService } from './order.service';
import * as jwt from 'jsonwebtoken'
import { AuthService } from 'src/auth/auth.service';
import { CreateOrderDto } from './dto/create-order.dto';

const JWT_SECRET = 'thisIsMyJWTSecretCode';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly authService: AuthService
    ) {}

    @Post('create-order')
    async create(
        @Body() createOrderDto: CreateOrderDto, 
        @Headers('authorization') auth: string,
    ) {
        const token = auth?.split(' ')[1];
        const payload = this.authService.verifyToken(token)
        return this.orderService.create(+payload.sub!, createOrderDto.productId, createOrderDto.quantity);
    }

    @Get('get-all-orders')
    findAll(@Headers('authorization') auth: string) {
        const token = auth?.split(' ')[1];

        const payload = this.authService.verifyToken(token)
        return this.orderService.findAll()
    }
}
