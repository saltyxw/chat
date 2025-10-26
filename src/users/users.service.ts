import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UsersService {

    constructor(private readonly prismaService: PrismaService) { }

    async findUserByName(name: string) {
        const users = await this.prismaService.user.findMany({
            where: { name: { contains: name, mode: 'insensitive' } },
        });
        return users
    }

    async getData(name: string) {
        return this.prismaService.user.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive'
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });
    }

    async changeName(userId: number, newName: string) {
        const user = await this.prismaService.user.findUnique({ where: { id: userId } });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        await this.prismaService.user.update({
            where: { id: userId },
            data: { name: newName },
        });

        return { message: 'Name successfully changed', newName };
    }

}
