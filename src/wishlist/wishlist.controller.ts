import { Body, Controller, Post, Headers, Delete, Get } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthService } from 'src/auth/auth.service';
import { AddWishlistDto } from './dto/add-wishilst.dto';

@Controller('wishlist')
export class WishlistController {
    constructor(
        private authService: AuthService,
        private wishlistService: WishlistService,
    ) {}

    @Post('addToWishlist')
    add(
        @Body() addWishlistDto: AddWishlistDto, 
        @Headers('authorization') auth: string,
    ) {
        const token = auth?.split(" ")[1]
        const payload = this.authService.verifyToken(token)
        return this.wishlistService.add(+payload.sub!, addWishlistDto.productId)
    }

    @Delete('removeFromWishlist')
    remove(
        @Body() addWishlistDto: AddWishlistDto,
        @Headers('authorization') auth: string,
    ) {
        const token = auth?.split(" ")[1]
        const payload = this.authService.verifyToken(token)
        return this.wishlistService.remove(+payload.sub!, addWishlistDto.productId)
    }

    @Get('getAllWishlistItems')
    findAllByUser(
        @Headers('authorization') auth: string,
    ) {
        const token = auth?.split(" ")[1]
        const payload = this.authService.verifyToken(token)
        return this.wishlistService.findAllForUser(+payload.sub!)
    }
}
