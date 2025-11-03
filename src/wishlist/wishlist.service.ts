import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductService } from 'src/product/product.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class WishlistService {
    constructor(
        @InjectRepository(Wishlist)
        private wishlistRepo: Repository<Wishlist>,

        private usersService: UsersService,
        private productService: ProductService,
    ) {}

  async add(userId: string, productId: string) {
    // get user
    const user = await this.usersService.findById(userId)
    
    if(!user) {
        throw new UnauthorizedException("Please login to add product to wishlist!")
    }
    // get product
    const product = await this.productService.findOne(productId)

    if(!product) {
        throw new NotFoundException("No Product Found with the given Id!")
    }

    // check if already exists
    const existing = await this.wishlistRepo.findOne({
        where: {product: {id: productId}, user: {id: userId}}
    });
 
    if(existing) {
        throw new BadRequestException("This product is already in your wishlist!")
    }

    // save the product to wishlit
    return this.wishlistRepo.save({user, product})
  }

  async remove(userId: string, productId: string) {
    const item = await this.wishlistRepo.findOne({
        where: {
            user: {id: userId},
            product: {id :productId}
        }
    })

    if(!item) {
        throw new NotFoundException("This product not found in your wishlist!")
    }

    if (item) {
        await this.wishlistRepo.remove(item)
    }

    return {
        deleted: true,
        productId,
    }
  }

  async findAllForUser(userId: string, paginationDto: PaginationDto) {
    const {page, limit} = paginationDto
    const [items, total] = await this.wishlistRepo.findAndCount({
        where: { user: {id: userId}},
        relations: ['product'],
        skip: (page - 1) * limit,
        take: limit,
    });

    return {
        items,
        total,
        page,
        limit,
    }
  }
}
