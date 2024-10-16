import {
  Controller,
  Get,
  Post,
  Req,
  Request as RequestCommon,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  async signUp(@Req() req: Request, @Res() res: Response) {
    const { email, username, password } = req.body;
    const { accessToken, refreshToken } = await this.authService.signUp({
      email,
      username,
      password,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.send({ accessToken });
  }

  @Public()
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const { username, password } = req.body;
    const { accessToken, refreshToken } = await this.authService.login(
      username,
      password,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.send({ accessToken });
  }

  @Public()
  @Post('refresh-token')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const newAccessToken = await this.authService.refreshToken(refreshToken);
    return res.send({ accessToken: newAccessToken });
  }

  @Get('profile')
  getProfile(@RequestCommon() req) {
    return req.user;
  }
}
