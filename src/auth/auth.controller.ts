import { Body, Controller, Get, Post, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthGuard } from './guards/auth.guard';
import { ResponseDto } from 'src/common/dto/response.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Public()
    @Post('register')
    async  register(@Body() registerDto: RegisterDto){
        const result = await this.authService.register(registerDto)
        return new ResponseDto(result, "User registered successfully!")
    }

    @Public()
    @Post('login')
    @Throttle({default: {limit: 2, ttl: 10000}}) // used to override the global rate limit to a specific class or function
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        const result = await this.authService.login(loginDto.email, loginDto.password);
        return new ResponseDto(result, "Logged In successfully!")
    }

    @Get('profile')
    async profile(@Req() req,) {
        const userId = req.user.sub;
        return { user: userId}
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Req() req) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    return this.authService.logout(token);
}
}
