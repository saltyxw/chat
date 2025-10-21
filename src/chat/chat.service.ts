import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

export interface ChatMessage {
    user: string;
    text: string;
    timestamp: Date;
}

@Injectable()
export class ChatService {
    private messages: ChatMessage[] = [];

    constructor(private prisma: PrismaService) { }

    addMessage(user: string, text: string): ChatMessage {
        const message: ChatMessage = { user, text, timestamp: new Date() };
        this.messages.push(message);
        return message;
    }

    async isUserInChat(userId: number, chatKey: string): Promise<boolean> {
        // Знаходимо чат за його string chatId
        const chat = await this.prisma.chat.findUnique({
            where: { chatId: chatKey },
            select: { id: true },
        });

        if (!chat) return false;

        const userChat = await this.prisma.userChat.findUnique({
            where: {
                userId_chatId: {
                    userId,
                    chatId: chat.id, // використовуємо числовий id
                },
            },
        });

        return !!userChat;
    }

    async getMessagesByChat(chatKey: string) {
        // Шукаємо чат по string chatId
        const chat = await this.prisma.chat.findUnique({
            where: { chatId: chatKey },
            select: { id: true },
        });

        if (!chat) return [];

        const messages = await this.prisma.message.findMany({
            where: { chatId: chat.id },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: { select: { id: true, name: true, avatarLink: true } },
            },
        });

        return messages;
    }

    async getOrCreatePrivateChat(userId1: number, userId2: number) {
        const chatKey = [userId1, userId2].sort((a, b) => a - b).join('-');

        let chat = await this.prisma.chat.findUnique({
            where: { chatId: chatKey },
        });

        if (!chat) {
            chat = await this.prisma.chat.create({
                data: {
                    chatId: chatKey,
                    isGroup: false,
                    users: {
                        create: [
                            { userId: userId1, role: 'MEMBER' },
                            { userId: userId2, role: 'MEMBER' },
                        ],
                    },
                },
            });
        }

        return chat;
    }

    async addMessageToChat(chatKey: string, senderId: number, text: string) {
        const chat = await this.prisma.chat.findUnique({
            where: { chatId: chatKey },
            select: { id: true },
        });

        if (!chat) throw new Error('Chat not found');

        const message = await this.prisma.message.create({
            data: {
                text,
                chatId: chat.id,
                senderId,
            },
            include: {
                sender: { select: { id: true, name: true, avatarLink: true } },
            },
        });

        return message;
    }


    getMessages(): ChatMessage[] {
        return this.messages;
    }
}
