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

        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

    async login(data: LoginUserDto) {
        const user = await this.prismaService.user.findFirst({ where: { email: data.email } })
        if (!user) throw new BadGatewayException('This user isnot register')
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('Wrong password');

        const payload = { sub: user.id, name: user.name, avatarLink: user.avatarLink, email: user.email }

        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}
