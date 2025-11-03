import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ShippingAddressService } from './shipping-address.service';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ResponseDto } from 'src/common/dto/response.dto';

@Controller('shipping-address')
export class ShippingAddressController {
    constructor(
        private readonly shippingAddressService: ShippingAddressService,
    ) {}

    @Post('create')
    async create(
        @ActiveUser('sub') userId: number,
        @Body() dto:CreateShippingAddressDto,
    ) {
        const result = await this.shippingAddressService.create({id: userId} as any, dto)
        return new ResponseDto(result, 'Address created successfully');
    }

    @Get()
    async findAll(
        @ActiveUser('sub') userId: string,
        @Query() paginationDto: PaginationDto
    ) {
        const result = await this.shippingAddressService.findUserAddresses(userId, paginationDto)
        return new ResponseDto(result, "Addresses fetched successfully");
    }

    @Get(":id")
    async findById(@Param('id', ParseIntPipe) id:number) {
        const result = await this.shippingAddressService.findUserAddressById(id)
        return new ResponseDto(result, 'Address fetched successfully');
    }

    @Delete('deleteAddress/:id')
    async remove(
        @ActiveUser('sub') userId: string,
        @Param('id', ParseIntPipe) id: number,
    ) {
        const result =await this.shippingAddressService.delete(userId, id)
        return new ResponseDto(result, 'Address deleted successfully');
    }

    @Patch("update/:id")
    async update(
        @Param('id', ParseIntPipe) id:number,
         @Body() updateShippingAddressDto:UpdateShippingAddressDto
    ) {
       const result = await this.shippingAddressService.update(id,updateShippingAddressDto);
       return new ResponseDto(result, 'Address updated successfully');
    }
}
