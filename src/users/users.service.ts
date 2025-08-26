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

// async getUserStats() {
//   // Total users
//   const totalUsers = await this.usersRepository.count();

//   // Users with at least one order
//   const usersWithOrders = await this.usersRepository
//     .createQueryBuilder('user')
//     .leftJoin('user.orders', 'order')
//     .where('order.id IS NOT NULL')
//     .getCount();

//   // Admins & Superadmins count
//   const adminCount = await this.usersRepository.count({
//     where: {role: UserRole.ADMIN}
//   });

//   const superAdminCount = await this.usersRepository.count({
//     where: { role: UserRole.SUPERADMIN},
//   });

//   // Recently registered users (last 5)
//   const recentUsers = await this.usersRepository.find({
//     order: { createdAt: 'DESC' }, // if you add `createdAt`, use that instead
//     take: 5,
//     select: ['id', 'email', 'fullName', 'role'],
//   });

//   // Top customers by order count
//   // const topCustomers = await this.usersRepository
//   //   .createQueryBuilder('user')
//   //   .leftJoinAndSelect('user.orders', 'order')
//   //   .select('user.id', 'id')
//   //   .addSelect('user.email', 'email')
//   //   .addSelect('COUNT(order.id)', 'orderCount')
//   //   .groupBy('user.id')
//   //   .orderBy('orderCount', 'DESC')
//   //   .limit(5)
//   //   .getRawMany();

//     // users.service.ts
// const topCustomers = await this.usersRepository
//   .createQueryBuilder('user')
//   .leftJoin('user.orders', 'order')
//   .select('user.id', 'id')
//   .addSelect('user.email', 'email')
//   .addSelect('COUNT(order.id)', 'orderCount') // computed field
//   .groupBy('user.id')
//   .addGroupBy('user.email')
//   .orderBy('orderCount', 'DESC')
//   .limit(5)
//   .getRawMany(); // raw result, not mapped entity


//   return {
//     totalUsers,
//     usersWithOrders,
//     adminCount,
//     superAdminCount,
//     recentUsers,
//     topCustomers,
//   };
// }

}
