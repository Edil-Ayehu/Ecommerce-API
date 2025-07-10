import { Body, Controller, Post, Headers, Delete, Get, Param, ParseIntPipe, Query, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthService } from 'src/auth/auth.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('cart')
export class CartController {
    constructor(
        private cartService: CartService,
        private authService: AuthService,
    ) {}

    @Post('addToCart')
    add(
        @Body() addCartItemDto: AddCartItemDto,
        @Req() req,
    ) {
        const userId = req.user.sub;

        return this.cartService.add(userId, addCartItemDto.productId, addCartItemDto.quantity)
    }

    @Delete('removeFromCart/:productId')
    remove(
        @Param('productId', ParseIntPipe) productId: number,
        @Req() req,
    ) {
        const userId = req.user.sub;

        return this.cartService.remove(userId, productId)
    }

    @Get('getAllCartItems')
    findAllByUser(
        @Query() paginationDto: PaginationDto,
        @Req() req,
    ) {
        const userId = req.user.sub;

        return this.cartService.findCartItems(userId,paginationDto)
    }

    @Delete()
    clearCartForUser(@Req() req,) {
        const userId = req.user.sub;

        return this.cartService.clearCartForUser(userId)
    }
}
