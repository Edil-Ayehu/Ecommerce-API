import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get('find-all-users')
    findAllUsers(@Query() paginationDto: PaginationDto) {
        return this.usersService.findAllUsers(paginationDto)
    }

    @Patch('update-profile')
    UpdateProfile(@Body() updateProfileDto: UpdateProfileDto, @ActiveUser('sub') userId) {
        return this.usersService.updateProfile(userId, updateProfileDto)
    }
}
