import { Controller, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Get, Request, Body, Post } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user
  }

  @UseGuards(AuthGuard)
  @Post('/search')
  searchProfile(@Body('name') name: string) {
    return this.usersService.getData(name)
  }
}
