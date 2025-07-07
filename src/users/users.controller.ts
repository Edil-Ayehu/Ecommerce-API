import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get('find-all-users')
    findAllUsers(@Query() paginationDto: PaginationDto) {
        return this.usersService.findAllUsers(paginationDto)
    }
}
