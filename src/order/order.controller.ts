import { Body, Controller, Get, Post, Query} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthService } from 'src/auth/auth.service';
import { CheckoutDto } from './dto/checkout.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';

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
        @ActiveUser('sub') userId,
    ) {
        return this.orderService.findMyOrders(userId, paginationDto);
    }


    @Post('checkout')
    checkout(
        @Body() checkoutDto:CheckoutDto ,
        @ActiveUser('sub') userId,
    ) {
        return this.orderService.checkout(userId,checkoutDto)
    }

    @Get('get-all-orders')
    findAllOrders(
        @Query() paginationDto: PaginationDto,
        @ActiveUser('sub') userId
    ) {
        return this.orderService.findAllOrders(paginationDto);
    }
}
