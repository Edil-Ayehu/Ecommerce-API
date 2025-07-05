import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class WishlistService {
    constructor(
        @InjectRepository(Wishlist)
        private wishlistRepo: Repository<Wishlist>,

        private usersService: UsersService,
        private productService: ProductService,
    ) {}

  async add(userId: number, productId: number) {
    // get user
    const user = await this.usersService.findById(userId)
    
    if(!user) {
        throw new UnauthorizedException("Please login to add product to wishlist!")
    }
    // get product
    const product = await this.productService.findOne(productId)

    if(!product) {
        throw new UnauthorizedException("Please login to add product to wishlist!")
    }

    // save the product to wishlit
    return this.wishlistRepo.save({user, product})
  }

  async remove(userId: number, productId: number) {
    const item = await this.wishlistRepo.findOne({
        where: {
            user: {id: userId},
            product: {id :productId}
        }
    })

    if (item) {
        await this.wishlistRepo.remove(item)
    }

    return {
        message: "Product Removed from wishlist"
    }
  }

  findAllForUser(userId: number) {
    return this.wishlistRepo.find({
        where: {
            user: {id: userId},
        },
        relations: ['product'],
    })
  }
}
