import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ShippingAddress } from './shipping-address.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ShippingAddressService {
    constructor(
        @InjectRepository(ShippingAddress)
        private readonly shippingAddressRepository: Repository<ShippingAddress>
    ) {}

    async create(){}

    async update() {}

    async findUserAddresses(){}

    async delete(){}

    async findUserAddressById(){}
}
