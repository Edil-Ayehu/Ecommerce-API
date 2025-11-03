import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ResponseDto } from 'src/common/dto/response.dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get('find-all-users')
    @Roles('admin', 'superadmin')
    async  findAllUsers(@Query() paginationDto: PaginationDto) {
        const result = await this.usersService.findAllUsers(paginationDto)
        return new ResponseDto(result, "Users fetched successfully!");
    }

    @Patch('update-profile')
    async UpdateProfile(@Body() updateProfileDto: UpdateProfileDto, @ActiveUser('sub') userId) {
        const result = await this.usersService.updateProfile(userId, updateProfileDto)
        return new ResponseDto(result, "Profile updated successfully!");
    }

    @Delete(':id')
    async deleteUser(@Param('id') id:string) {
        const result = await this.usersService.deleteUser(id);
        return new ResponseDto(result, 'User deleted successfully!');
    }

    // @Get('stats')
    // @Roles('admin', 'superadmin')
    // async getUserStats() {
    //  const result = await this.usersService.getUserStats();
    // return new ResponseDto(result, "User stats fetched successfully!");
    // }
}
