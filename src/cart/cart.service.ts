import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,

    private usersService: UsersService,
    private productService: ProductService,
  ) {}

  async add(userId: number, productId: number, quantity: number) {
    // get user
    const user = await this.usersService.findById(userId)

    if(!user) {
        throw new UnauthorizedException("Please login to add product to cart");
    }

    // get product
    const product = await this.productService.findOne(productId)

     if(!product) {
        throw new UnauthorizedException("Please login to add product to cart");
    }

    // check if already in cart
    const existing = await this.cartRepository.findOne({
        where: {
            user: {id: userId},
            product: {id: productId}
        }
    })

    if(existing) {
        existing.quantity += quantity;
        return this.cartRepository.save(existing)
    }

    // save product to cart
    return this.cartRepository.save({user, product, quantity})
  }

  async remove(userId: number, productId: number) {
    const item = await this.cartRepository.findOne( {
        where: {
            user: {id: userId},
            product: {id: productId}
        }
    })

    if(item) {
        await this.cartRepository.remove(item)
    }

    return {
        message: "Product removed from cart"
    }
  }

  findAllForUser(userId: number) {
    return this.cartRepository.find({
        where: {user: {id: userId}},
        relations: ['product']
    })
  }

  // clear all items in the user's cart
  async clearCartForUser(userId: number) {
    const items = await this.cartRepository.find({
      where: {user: {id: userId}}
    })

    if (items.length > 0) {
      await this.cartRepository.remove(items)
    }

    return {
      message: "Cart cleared successfully",
      removedItemsCount: items.length,
    }
  }
}
