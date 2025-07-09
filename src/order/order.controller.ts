import { Body, Controller, Get, Post, Headers, UnauthorizedException, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

const JWT_SECRET = 'thisIsMyJWTSecretCode';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly authService: AuthService
    ) {}


    @Get('get-my-orders')
    findMyOrders(
        @Body() paginationDto:PaginationDto,
        @Headers('authorization') auth: string) {
        const token = auth?.split(' ')[1];

        const payload = this.authService.verifyToken(token)
        return this.orderService.findMyOrders(+payload.sub!, paginationDto);
    }


    @Post('checkout')
    checkout(
        @Body() checkoutDto:CheckoutDto ,
        @Headers('authorization') auth: string,
    ) {
        const token = auth?.split(' ')[1];
        const payload = this.authService.verifyToken(token)

        return this.orderService.checkout(+payload.sub!,checkoutDto)
    }

    @Get('get-all-orders')
    findAllOrders(@Query() paginationDto: PaginationDto) {
        return this.orderService.findAllOrders(paginationDto);
    }
}
