import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = 'thisIsMyJWTSecretCode'; // Ideally use config service

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
    ){}

    private blacklistedTokens: string[] = []; // simple in-memory blacklist

    async register(user: {email: string, password:string}) {
        const existing = await this.usersService.findByEmail(user.email)

        if(existing) {
            throw new UnauthorizedException("Email already in use")
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = await this.usersService.create({email: user.email, password: hashedPassword})
        return {id: newUser.id, email: newUser.email}
    }

    async login(email:string, password: string) {
        const user = await this.usersService.findByEmail(email)
        if(!user) throw new UnauthorizedException('Invalid credentials')
        
        const match = await bcrypt.compare(password, user.password);
        if(!match) throw new UnauthorizedException('The password is incorrect.please try again!')
        
        const token = jwt.sign(
            {
                sub: user.id, 
                email: user.email,
                role: user.role,
            }, 
            JWT_SECRET, 
            {expiresIn: '15m'},
        );

        return {'access_token' : token}
    }

    logout(token: string) {
        this.blacklistedTokens.push(token);
        return { message: 'Logged out successfully' };
    }

    isTokenBlacklisted(token: string) {
        return this.blacklistedTokens.includes(token);
    }
}
