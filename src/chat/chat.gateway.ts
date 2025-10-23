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

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000' },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;



  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis
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
    @MessageBody() payload: { chatId: string; text: string },
  ) {
    const senderId: number = client.data.user.sub;

    try {
      const message = await this.chatService.addMessageToChat(
        payload.chatId,
        senderId,
        payload.text,
      );

      this.server.to(payload.chatId).emit('chatMessage', message);
    } catch (err) {
      console.error(err);
      client.emit('error', 'Failed to send message');
    }
  }
}
