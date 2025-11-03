import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RegisterDto } from './dto/register.dto';

const JWT_SECRET = 'thisIsMyJWTSecretCode'; // Ideally use config service

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
    ){}

    private blacklistedTokens: Set<string> = new Set(); // simple in-memory blacklist

    async register(user: RegisterDto) {
        const existing = await this.usersService.findByEmail(user.email)

        if(existing) {
            throw new UnauthorizedException("Email already in use")
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = await this.usersService.create({
            email: user.email, 
            password: hashedPassword, 
            role: user.role,
        });
        
        return {
            id: newUser.id, 
            email: newUser.email,
            role: newUser.role,
        }
    }

    async login(email:string, pass: string) {
        const user = await this.usersService.findByEmail(email)
        if(!user) throw new UnauthorizedException('Invalid credentials')
        
        const match = await bcrypt.compare(pass, user.password);
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

         // Filter out sensitive fields
         const {password, ...safeUser} = user;

        return {
            safeUser,
            'access_token' : token,
        }
    }

    logout(token: string) {
if (this.blacklistedTokens.has(token)) {
    return { message: 'You are already logged out.' };
  }

        this.blacklistedTokens.add(token);
        return { message: 'Logged out successfully' };
    }

    isTokenBlacklisted(token: string) {
        return this.blacklistedTokens.has(token);
    }

    async changePassword (userId: number, oldPassword:string, newPassword:string) {
        const user = await this.usersService.findById(userId);

        if(!user) throw new NotFoundException("User not found!");

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if(!isMatch) throw new BadRequestException("Old password is incorrect!");

        // ✅ Check if new password is same as old password
        if(oldPassword === newPassword) throw new BadRequestException("New password cannot be the same as the old password!")
        // const isSamePassword = await bcrypt.compare(newPassword, user.password);
        // if (isSamePassword) {
        //     throw new BadRequestException("New password cannot be the same as the old password!");
        // }


        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.usersService.updatePassword(userId, hashedPassword);

        return {
            message: "Password changed successfully!",
        }
    }
}
