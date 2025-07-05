import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './wishlist.entity';
import { UsersModule } from 'src/users/users.module';
import { ProductModule } from 'src/product/product.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist]),
    UsersModule,
    ProductModule,
    AuthModule,
  ],
  controllers: [WishlistController],
  providers: [WishlistService]
})
export class WishlistModule {}
