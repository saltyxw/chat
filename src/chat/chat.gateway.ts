import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import type { ChatMessage } from './chat.service';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000' },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) { }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('chatHistory', this.chatService.getMessages());
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chatMessage')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: { user: string; text: string }): ChatMessage {
    const message = this.chatService.addMessage(payload.user, payload.text);

    this.server.emit('chatMessage', message);

    return message;
  }
}
