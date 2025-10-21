import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Res,
  Req,
  Post,
  Request,
  UseGuards, UnauthorizedException
} from '@nestjs/common';
import { Public } from './auth.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { AuthGuard } from './auth.guard';
import type { Response, Request as ExpressRequest } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) { }

  @Public()
  @Post('register')
  async register(@Body() registerData: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.register(registerData)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token: accessToken };
  }

  @Public()
  @Post('login')
  async login(@Body() loginData: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(loginData)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token: accessToken };
  }

  @Public()
  @Post('refresh')
  async refresh(@Req() req: ExpressRequest, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException('No refresh token');

    const decoded = this.jwtService.decode(refreshToken) as { sub: number } | null;
    if (!decoded || !decoded.sub) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.authService.getUserByRefreshToken(decoded.sub, refreshToken);
    if (!user) throw new UnauthorizedException('Invalid refresh token');

    const payload = {
      sub: user.id,
      name: user.name,
      avatarLink: user.avatarLink,
      email: user.email,
    };

    const newRefreshToken = await this.authService.writeRefreshToken(payload);
    const accessToken = await this.jwtService.signAsync(payload);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    const userId = req.user.sub;

    await this.authService.deleteRefreshToken(userId)

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { message: 'Logged out successfully' };
  }


}
