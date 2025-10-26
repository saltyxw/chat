import { Controller, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Get, Request, Body, Post, Req } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { BadRequestException } from '@nestjs/common';

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

  @UseGuards(AuthGuard)
  @Post('change-name')
  async changeName(@Req() req, @Body() body: { newName: string }) {
    const userId = req.user.sub;
    const { newName } = body;

    if (!newName || newName.trim().length === 0) {
      throw new BadRequestException('New name is required');
    }

    return await this.usersService.changeName(userId, newName.trim());
  }
}
