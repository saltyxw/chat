import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) { }

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



}
