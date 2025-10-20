import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards
} from '@nestjs/common'; import { Public } from './auth.decorator';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) { }

  @Public()
  @Post('register')
  async register(@Body() registerData: CreateUserDto) {
    return await this.authService.register(registerData)
  }

  @Public()
  @Post('login')
  async login(@Body() loginData: LoginUserDto) {
    return await this.authService.login(loginData)
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
