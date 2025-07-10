import { Body, Controller, Post, Headers, Delete, Get, Req } from '@nestjs/common';
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
        @Req() req,
    ) {
        const userId = req.user.sub;
        return this.wishlistService.add(userId, addWishlistDto.productId)
    }

    @Delete('removeFromWishlist')
    remove(
        @Body() addWishlistDto: AddWishlistDto,
        @Req() req,
    ) {
        const userId = req.user.sub;
        return this.wishlistService.remove(userId, addWishlistDto.productId)
    }

    @Get('getAllWishlistItems')
    findAllByUser(@Req() req) {
        const userId = req.user.sub;
        return this.wishlistService.findAllForUser(userId)
    }
}
