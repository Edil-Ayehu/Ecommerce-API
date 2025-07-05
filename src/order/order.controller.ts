import { Body, Controller, Get, Post, Headers, UnauthorizedException } from '@nestjs/common';
import { OrderService } from './order.service';
import * as jwt from 'jsonwebtoken'
import { AuthService } from 'src/auth/auth.service';

const JWT_SECRET = 'thisIsMyJWTSecretCode';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly authService: AuthService
    ) {}

    @Post('create-order')
    async create(@Body() body: {productId: number, quantity: number}, @Headers('authorization') auth: string) {
        const token = auth?.replace('Bearer', "");

        const validToken = this.authService.verityToken(token)
        if(!validToken) {
            throw new UnauthorizedException("Invalid Token");
        }
        const payload: any = jwt.verify(token,JWT_SECRET);
        return this.orderService.create(payload.sub, body.productId, body.quantity);
    }

    @Get()
    findAll() {
        return this.orderService.findAll()
    }
}
