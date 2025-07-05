import { Body, Controller, Post, Headers, Delete, Get } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthService } from 'src/auth/auth.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';

@Controller('cart')
export class CartController {
    constructor(
        private cartService: CartService,
        private authService: AuthService,
    ) {}

    @Post('addToCart')
    add(
        @Body() addCartItemDto: AddCartItemDto,
        @Headers('authorization') auth:string,
    ) {
        const token = auth?.split(' ')[1]
        const payload = this.authService.verifyToken(token)

        return this.cartService.add(+payload.sub!, addCartItemDto.productId, addCartItemDto.quantity)
    }

    @Delete('removeFromCart')
    remove(@Body() productId: number, @Headers('authorization') auth:string,) {
        const token = auth?.split(' ')[1]
        const payload = this.authService.verifyToken(token)

        return this.cartService.remove(+payload.sub!, productId)
    }

    @Get('getAllCartItems')
    findAllByUser(@Headers('authorization') auth:string) {
        const token = auth?.split(' ')[1]
        const payload = this.authService.verifyToken(token)

        return this.cartService.findAllForUser(+payload.sub!)
    }
}
