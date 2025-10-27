import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { v2 as cloudinaryType } from 'cloudinary';

@Injectable()
export class UsersService {

    constructor(private readonly prismaService: PrismaService, @Inject('CLOUDINARY') private readonly cloudinary: typeof cloudinaryType,) { }

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

    async changeAvatarImage(userId: number, file: Express.Multer.File) {
        const user = await this.prismaService.user.findUnique({ where: { id: userId } });
        if (!user) throw new BadRequestException('User not found');

        const uploadResult = await new Promise<{ url: string }>((resolve, reject) => {
            const upload = this.cloudinary.uploader.upload_stream(
                { folder: 'avatars', resource_type: 'image' },
                (error, result) => {
                    if (error || !result) return reject(error);
                    resolve({ url: result.secure_url });
                },
            );
            upload.end(file.buffer);
        });

        await this.prismaService.user.update({
            where: { id: userId },
            data: { avatarLink: uploadResult.url },
        });

        return { avatarLink: uploadResult.url, message: 'Avatar successfully changed' };
    }


}
