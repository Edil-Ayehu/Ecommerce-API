import { Body, Controller, Post, Headers, Delete, Get, Req, Query } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthService } from 'src/auth/auth.service';
import { AddWishlistDto } from './dto/add-wishilst.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('wishlist')
export class WishlistController {
    constructor(
        private wishlistService: WishlistService,
    ) {}

    @Post('addToWishlist')
    add(
        @Body() addWishlistDto: AddWishlistDto, 
        @ActiveUser('sub') userId,
    ) {
        return this.wishlistService.add(userId, addWishlistDto.productId)
    }

    @Delete('removeFromWishlist')
    async remove(
        @Body() addWishlistDto: AddWishlistDto,
        @ActiveUser('sub') userId,
    ) {
        return await this.wishlistService.remove(userId, addWishlistDto.productId)
    }

    @Get('getAllWishlistItems')
    findAllByUser(
        @ActiveUser('sub') userId,
        @Query() paginationDto:PaginationDto,
    ) {
        return this.wishlistService.findAllForUser(userId,paginationDto);
    }
}
