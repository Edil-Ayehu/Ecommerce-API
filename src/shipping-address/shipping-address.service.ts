import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ShippingAddress } from './shipping-address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { User } from 'src/users/user.entity';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ShippingAddressService {
    constructor(
        @InjectRepository(ShippingAddress)
        private readonly shippingAddressRepository: Repository<ShippingAddress>
    ) {}

    async create(user:User, createShippingAddressDto: CreateShippingAddressDto){
        const address = this.shippingAddressRepository.create({
            ...createShippingAddressDto,
            user,
        });

        return this.shippingAddressRepository.save(address);
    }

    async update(id:number,updateShippingAddressDto:UpdateShippingAddressDto) {
        const address = await this.findUserAddressById(id)
        const updatedAddress = Object.assign(address, updateShippingAddressDto);
        return this.shippingAddressRepository.save(updatedAddress);
    }

    async findUserAddresses(userId:string, paginationDto: PaginationDto){
        const {page, limit} = paginationDto;

        const [docs, total] = await this.shippingAddressRepository.findAndCount({
            where: {user: {id: userId}},
            order: {createdAt: 'DESC'},
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            docs,
            total,
            page,
            limit,
        }
    }

    async delete(userId: string, addressId:number){
        const address = await this.shippingAddressRepository.findOne({
            where: {
                id: addressId,
                user: {id: userId},
            }
        });

        if(!address) throw new NotFoundException('Address not found');

        await this.shippingAddressRepository.remove(address);

        return {
            addressId,
            deleted: true,
        };
    }

    async findUserAddressById(id:number){
        const address = await this.shippingAddressRepository.findOne({
            where: {id}
        });

        if(!address) throw new NotFoundException(`Address with ID ${id} not found`);

        return address;
    }
}
