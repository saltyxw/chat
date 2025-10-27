import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [AuthModule, CloudinaryModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
