import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CartModule } from './cart/cart.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { BlogModule } from './blog/blog.module';
import { CategoryModule } from './category/category.module';
import { ShippingAddressModule } from './shipping-address/shipping-address.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { ThrottlerModule } from '@nestjs/throttler';
import { CustomThrottlerGuard } from './common/guards/custom-throttler.guard';
import envValidation from './config/env.validation';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';

const ENV = process.env.NODE_ENV

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV.trim()}`,
      validationSchema: envValidation,
      load: [appConfig, databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
    useFactory: (configService:ConfigService) => ({
      type: 'postgres',
      host: configService.get('database.host'),
      port: configService.get<number>('database.port'),
      username: configService.get('database.username'),
      database: configService.get('database.name'),
      password: configService.get('database.password'),
      autoLoadEntities: configService.get('database.autoLoadEntities'),
      synchronize: configService.get('database.syncronize'), // disable in production
    })
  }), 
  UsersModule, 
  AuthModule, 
  ProductModule, 
  OrderModule, 
  WishlistModule, 
  CartModule, 
  BlogModule, 
  CategoryModule, 
  ShippingAddressModule,
  ThrottlerModule.forRoot({
    throttlers: [
      {
        ttl: 10000,
        limit: 3,
      },
    ],
  }),
],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    //  consumer.apply(LoggerMiddleware).forRoutes(UsersController,AuthController, ProductController,CategoryController);  // we can list the controllers to apply middleware in this way or we can apply the middleware to all controllers in a way found below.
     consumer.apply(LoggerMiddleware).forRoutes('*'); // 👈 applies globally
  }
}
