import { Body, Controller, Post, Headers, Delete, Get, Param, ParseIntPipe, Query, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ResponseDto } from 'src/common/dto/response.dto';

@Controller('cart')
export class CartController {
    constructor(
        private cartService: CartService,
    ) {}

    @Post('addToCart')
    async  add(
        @Body() addCartItemDto: AddCartItemDto,
        @ActiveUser('sub') userId
    ) {
        const result = await this.cartService.add(userId, addCartItemDto.productId, addCartItemDto.quantity)
        return new ResponseDto(result, 'Item added to cart');
    }

    @Delete('removeFromCart/:productId')
    async remove(
        @Param('productId') productId: string,
        @ActiveUser('sub') userId
    ) {
        const result = await this.cartService.remove(userId, productId)
        return new ResponseDto(result, 'Item removed from cart');
    }

    @Get('getAllCartItems')
    async findAllByUser(
        @Query() paginationDto: PaginationDto,
        @ActiveUser('sub') userId
    ) {
        const result = await this.cartService.findCartItems(userId,paginationDto)
        return new ResponseDto(result, 'Cart items fetched successfully');
    }

    @Delete('clearCart')
    async clearCartForUser(@Req() req,) {
        const userId = req.user.sub;

        const result = await this.cartService.clearCartForUser(userId)
        return new ResponseDto(result, 'Cart cleared successfully');
    }
}
