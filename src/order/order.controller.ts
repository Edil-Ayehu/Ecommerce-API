import { Body, Controller, Get, Post, Headers, UnauthorizedException, Query, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthService } from 'src/auth/auth.service';
import { CheckoutDto } from './dto/checkout.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

const JWT_SECRET = 'thisIsMyJWTSecretCode';

@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly authService: AuthService
    ) {}

    @UseGuards(AuthGuard)
    @Get('get-my-orders')
    findMyOrders(
        @Body() paginationDto:PaginationDto,
        @Req() req,
    ) {
        const userId = req.user.sub
        return this.orderService.findMyOrders(userId, paginationDto);
    }


    @Post('checkout')
    checkout(
        @Body() checkoutDto:CheckoutDto ,
        @Req() req,
    ) {
        const userId = req.user.sub;
        return this.orderService.checkout(userId,checkoutDto)
    }

    @Get('get-all-orders')
    findAllOrders(
        @Query() paginationDto: PaginationDto,
        @Req() req,
    ) {
        return this.orderService.findAllOrders(paginationDto);
    }
}
