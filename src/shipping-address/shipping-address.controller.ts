import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ShippingAddressService } from './shipping-address.service';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';

@Controller('shipping-address')
export class ShippingAddressController {
    constructor(
        private readonly shippingAddressService: ShippingAddressService,
    ) {}

    @Post('create')
    create(
        @ActiveUser('sub') userId: number,
        @Body() dto:CreateShippingAddressDto,
    ) {
        return this.shippingAddressService.create({id: userId} as any, dto)
    }

    @Get()
    findAll(
        @ActiveUser('sub') userId: number,
    ) {
        return this.shippingAddressService.findUserAddresses(userId)
    }

    @Get(":id")
    findById(@Param('id', ParseIntPipe) id:number) {
        return this.shippingAddressService.findUserAddressById(id)
    }

    @Delete('deleteAddress/:id')
    remove(
        @ActiveUser('sub') userId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.shippingAddressService.delete(userId, id)
    }
}
