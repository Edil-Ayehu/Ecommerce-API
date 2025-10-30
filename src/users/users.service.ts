import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

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
    return await this.usersRepository.findOne({
      where: { id },
    });

  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.usersRepository.findOne({where: {id: userId}})
    if(!user) throw new NotFoundException("User Not Found");

    const updatedUser = Object.assign(user,updateProfileDto);

    return this.usersRepository.save(updatedUser);
  }

  async updatePassword(userId:number, newPassword:string) {
    const user = await this.findById(userId);

    if(!user) throw new NotFoundException("User not found")!

    user.password = newPassword;

    return await this.usersRepository.save(user);
  }
}
