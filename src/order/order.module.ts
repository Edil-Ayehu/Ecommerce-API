import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { UsersModule } from 'src/users/users.module';
import { ProductModule } from 'src/product/product.module';
import { AuthModule } from 'src/auth/auth.module';
import { CartModule } from 'src/cart/cart.module';
import { Product } from 'src/product/product.entity';
import { Cart } from 'src/cart/cart.entity';
import { OrderItem } from './order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order,OrderItem, Product, Cart]),
    UsersModule,
    ProductModule,
    AuthModule,
    CartModule,
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
