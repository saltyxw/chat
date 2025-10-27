import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { v2 as cloudinaryType } from 'cloudinary';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000' },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;



  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @Inject('CLOUDINARY') private readonly cloudinary: typeof cloudinaryType,
  ) {
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token as string | undefined;

    if (!token) {
      console.log("No token, disconnecting");
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token);
      client.data.user = payload;
      console.log(`Client connected: ${client.id}, user: ${payload.name}`);

      await this.redis.hset('chat_online_users', payload.sub, JSON.stringify({
        id: payload.sub,
        name: payload.name,
        socketId: client.id,
      }));

      client.emit('connected');
      this.emitOnlineUsers();
    } catch (err) {
      console.error("JWT verification failed:", err);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const user = client.data.user;
    if (user) {
      await this.redis.hdel('chat_online_users', user.sub);
      console.log(`Client disconnected: ${client.id}, user: ${user.name}`);
      this.emitOnlineUsers();
    } else {
      console.log(`Client disconnected: ${client.id}`);
    }
  }

  private async emitOnlineUsers() {
    const onlineUsers = await this.redis.hvals('chat_online_users');
    const users = onlineUsers.map(u => JSON.parse(u));
    this.server.emit('onlineUsers', users);
  }

  @SubscribeMessage('getOnlineUsers')
  async handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
    const onlineUsers = await this.redis.hvals('chat_online_users');
    const users = onlineUsers.map(u => JSON.parse(u));
    client.emit('onlineUsers', users);
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string },
  ) {
    const userId = client.data.user.sub;

    const isMember = await this.chatService.isUserInChat(userId, data.chatId);
    if (!isMember) {
      client.emit('error', 'You are not a member of this chat');
      return;
    }

    await client.join(data.chatId);
    client.emit('joinedChat', data.chatId);

    const messages = await this.chatService.getMessagesByChat(data.chatId);
    client.emit('chatHistory', messages);
  }

  @SubscribeMessage('loadMoreMessages')
  async handleLoadMoreMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: string; cursor?: number },
  ) {
    const userId = client.data.user.sub;

    const isMember = await this.chatService.isUserInChat(userId, payload.chatId);
    if (!isMember) {
      client.emit('error', 'You are not a member of this chat');
      return;
    }

    const messages = await this.chatService.getMessagesByChat(payload.chatId, payload.cursor);
    client.emit('moreMessages', messages);
  }

  @SubscribeMessage('chatMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: string; text?: string; media?: { data: string; type: 'image' | 'video' } },
  ) {
    const senderId: number = client.data.user.sub;

    try {
      let imageUrl: string | undefined;
      let videoUrl: string | undefined;

      if (payload.media) {
        const buffer = Buffer.from(payload.media.data.split(',')[1], 'base64');
        const uploadResult = await new Promise<{ url: string; resourceType: string }>((resolve, reject) => {
          const upload = this.cloudinary.uploader.upload_stream(
            { folder: 'chat', resource_type: 'auto' },
            (error, result) => {
              if (error || !result) return reject(new Error(error?.message || 'Upload error'));
              resolve({ url: result.secure_url, resourceType: result.resource_type });
            }
          );
          upload.end(buffer);
        });

        if (uploadResult.resourceType === 'image') imageUrl = uploadResult.url;
        if (uploadResult.resourceType === 'video') videoUrl = uploadResult.url;
      }

      const message = await this.chatService.addMessageToChat(
        payload.chatId,
        senderId,
        payload.text,
        imageUrl,
        videoUrl,
      );

      this.server.to(payload.chatId).emit('chatMessage', message);
    } catch (err) {
      console.error('Failed to send message:', err);
      client.emit('error', 'Failed to send message');
    }
  }

  @SubscribeMessage('editMessage')
  async handleEditMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { messageId: number; newText: string },
  ) {
    const userId = client.data.user.sub;

    try {
      const updated = await this.chatService.editMessage(payload.messageId, userId, payload.newText);
      this.server.emit('messageEdited', updated);
    } catch (err) {
      client.emit('error', err.message);
    }
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { messageId: number },
  ) {
    const userId = client.data.user.sub;

    try {
      const deleted = await this.chatService.deleteMessage(payload.messageId, userId);
      this.server.emit('messageDeleted', deleted);
    } catch (err) {
      client.emit('error', err.message);
    }
  }







}
