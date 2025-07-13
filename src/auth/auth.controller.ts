import { Body, Controller, Get, Post, Headers, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Public()
    @Post('register')
    register(@Body() registerDto: RegisterDto){
        return this.authService.register(registerDto)
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @Get('profile')
    async profile(@Req() req,) {
        const userId = req.user.sub;
        return { user: userId}
    }
}
