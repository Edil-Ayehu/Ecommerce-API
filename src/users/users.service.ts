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
    return this.usersRepository.save({
      ...registerDto,
      role: registerDto.role ?? UserRole.USER // ✅ Default to USER 
    });
  }

  async findAllUsers(paginationDto: PaginationDto) {
    const [users, total] = await this.usersRepository.findAndCount({
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
    })

    return {
      users,
      total, 
      page: paginationDto.page,
      limit: paginationDto.limit,
    }
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email , deletedAt: undefined},
    });
  }

  async findById(id: string) {
    return await this.usersRepository.findOne({
      where: { id },
    });

  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.usersRepository.findOne({where: {id: userId}})
    if(!user) throw new NotFoundException("User Not Found");

    const updatedUser = Object.assign(user,updateProfileDto);

    return this.usersRepository.save(updatedUser);
  }

  async updatePassword(userId:string, newPassword:string) {
    const user = await this.findById(userId);

    if(!user) throw new NotFoundException("User not found")!

    user.password = newPassword;

    return await this.usersRepository.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.findById(id);

    if(!user) throw new NotFoundException("User not found with the given Id!");

    await this.usersRepository.softDelete(id);

    return {
      id,
      deleted: true,
    }
  }
}
