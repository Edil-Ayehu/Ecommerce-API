import { Body, Controller, Get, Post, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Post('register')
    register(@Body() body: {email: string, password:string}){
        return this.authService.register(body)
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() body: {email: string, password:string}) {
        return this.authService.login(body.email, body.password);
    }

    @Get('profile')
    async profile(@Headers('authorization') auth: string) {
        const token = auth?.replace("Bearer",'');
        const payload = this.authService.verifyToken(token)
        return { user: payload}
    }
}
