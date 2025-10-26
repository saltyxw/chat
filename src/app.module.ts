import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [ChatModule, AuthModule, UsersModule, PrismaModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
