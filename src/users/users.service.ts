import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

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


}
