import { Body, Controller, Get, Post, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Post('register')
    register(@Body() registerDto: RegisterDto){
        return this.authService.register(registerDto)
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @Get('profile')
    async profile(@Headers('authorization') auth: string) {
        const token = auth?.replace("Bearer",'');
        const payload = this.authService.verifyToken(token)
        return { user: payload}
    }
}
