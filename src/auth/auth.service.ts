import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { randomBytes } from 'crypto';


@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService, private readonly emailService: EmailService) { }

    async register(data: CreateUserDto) {

        const user = await this.prismaService.user.findFirst({ where: { email: data.email } })
        if (user) throw new BadRequestException('This user is already registered')

        const hashedPassword = await bcrypt.hash(data.password, 10)
        const newUser = await this.prismaService.user.create({ data: { ...data, password: hashedPassword } })

        const payload = { sub: newUser.id, name: newUser.name, avatarLink: newUser.avatarLink, email: newUser.email }

        const refreshToken = await this.writeRefreshToken(payload);

        return {
            accessToken: await this.jwtService.signAsync(payload), refreshToken
        }
    }

    async login(data: LoginUserDto) {
        const user = await this.prismaService.user.findFirst({ where: { email: data.email } })
        if (!user) throw new BadGatewayException('This user isnot register')
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('Wrong password');

        const payload = { sub: user.id, name: user.name, avatarLink: user.avatarLink, email: user.email }
        const refreshToken = await this.writeRefreshToken(payload);

        return {
            accessToken: await this.jwtService.signAsync(payload), refreshToken
        }
    }


    async writeRefreshToken(payload) {
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        const decoded = this.jwtService.decode(refreshToken) as { exp: number };

        const expTimeRefreshToken = new Date(decoded.exp * 1000);
        const hashedToken = await bcrypt.hash(refreshToken, 10);

        await this.prismaService.user.update({
            where: { id: payload.sub },
            data: { refreshToken: hashedToken, expireRefreshToken: expTimeRefreshToken },
        });

        return refreshToken
    }

    async getUserByRefreshToken(userId: number, token: string) {
        const user = await this.prismaService.user.findUnique({ where: { id: userId } });
        if (!user || !user.refreshToken || !user.expireRefreshToken) return null;

        const match = await bcrypt.compare(token, user.refreshToken);
        if (match && user.expireRefreshToken > new Date()) return user;

        return null;
    }

    async deleteRefreshToken(userId: number) {
        await this.prismaService.user.update({
            where: { id: userId }, data: {
                refreshToken: null, expireRefreshToken: null
            }
        });
    }

    async changePassword(userId: number, currentPassword: string, newPassword: string) {
        const user = await this.prismaService.user.findUnique({ where: { id: userId } });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new BadRequestException('Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.prismaService.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return { message: 'Password successfully changed' };
    }

    async requestPasswordReset(email: string) {
        const user = await this.prismaService.user.findUnique({ where: { email } });
        if (!user) return;

        const token = randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 30 * 60 * 1000);

        await this.prismaService.user.update({
            where: { id: user.id },
            data: {
                emailVerificationToken: token,
                expireEmailVerificationToken: expires,
            },
        });

        await this.emailService.sendResetEmail(user.email, token);
    }

    async resetPassword(token: string, newPassword: string) {
        const user = await this.prismaService.user.findFirst({
            where: { emailVerificationToken: token },
        });

        if (!user || user.expireEmailVerificationToken! < new Date()) {
            throw new BadRequestException('Token invalid or expired');
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        await this.prismaService.user.update({
            where: { id: user.id },
            data: {
                password: hashed,
                emailVerificationToken: null,
                expireEmailVerificationToken: null,
            },
        });

        return { message: 'Password successfully reset' };
    }


}
