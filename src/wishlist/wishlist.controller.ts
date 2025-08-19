import { Body, Controller, Post, Headers, Delete, Get, Req, Query } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthService } from 'src/auth/auth.service';
import { AddWishlistDto } from './dto/add-wishilst.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ResponseDto } from 'src/common/dto/response.dto';

@Controller('wishlist')
export class WishlistController {
    constructor(
        private wishlistService: WishlistService,
    ) {}

    @Post('addToWishlist')
    async add(
        @Body() addWishlistDto: AddWishlistDto, 
        @ActiveUser('sub') userId,
    ) {
        const result = await this.wishlistService.add(userId, addWishlistDto.productId)
        return new ResponseDto(result, "Product succesfully added to your wishlist!")
    }

    @Delete('removeFromWishlist')
    async remove(
        @Body() addWishlistDto: AddWishlistDto,
        @ActiveUser('sub') userId,
    ) {
        const result = await this.wishlistService.remove(userId, addWishlistDto.productId)
        return new ResponseDto(result, "Product successfully removed from wishlist!")
    }

    @Get('getAllWishlistItems')
    async findAllByUser(
        @ActiveUser('sub') userId,
        @Query() paginationDto:PaginationDto,
    ) {
        const result = await this.wishlistService.findAllForUser(userId,paginationDto);
        return new ResponseDto(result, "Wishlist items fetched successfully!");
    }
}
