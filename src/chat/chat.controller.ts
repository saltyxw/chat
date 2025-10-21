import { Controller, Post, Req, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/auth.guard'

@Controller('chats')
@UseGuards(AuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Post('private/:userId')
    async createOrGetPrivateChat(@Req() req, @Param('userId') userId: string) {
        const currentUserId = req.user.sub;
        const chat = await this.chatService.getOrCreatePrivateChat(
            currentUserId,
            parseInt(userId),
        );
        return chat;
    }
}
