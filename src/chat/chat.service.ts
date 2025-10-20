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
        const message: ChatMessage = {
            user,
            text,
            timestamp: new Date(),
        };
        this.messages.push(message);
        return message;
    }

    getMessages(): ChatMessage[] {
        return this.messages;
    }
}
