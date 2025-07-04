import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>
    ) {}

    async create(user: Partial<Users>) {
        return this.usersRepository.save(user);
    }

    async findByEmail(email: string) {
        return this.usersRepository.findOne({
            where: {email}
        })
    }

    async findById(id: number) {
         return this.usersRepository.findOne({
            where: {id}
        })
    }
}
