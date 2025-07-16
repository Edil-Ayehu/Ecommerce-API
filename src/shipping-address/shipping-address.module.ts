import { Module } from '@nestjs/common';
import { ShippingAddressController } from './shipping-address.controller';
import { ShippingAddressService } from './shipping-address.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingAddress } from './shipping-address.entity';

@Module({
  controllers: [ShippingAddressController],
  providers: [ShippingAddressService],
  imports: [TypeOrmModule.forFeature([ShippingAddress])]
})
export class ShippingAddressModule {}
