import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(registerDto: RegisterDto) {
    return this.usersRepository.save(registerDto);
  }

  async findAllUsers(paginationDto: PaginationDto) {
    const [data, total] = await this.usersRepository.findAndCount({
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
    })

    return {
      data,
      total, 
      page: paginationDto.page,
      limit: paginationDto.limit,
    }
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async findById(id: number) {
    return this.usersRepository.findOne({
      where: { id },
    });

  }
}
