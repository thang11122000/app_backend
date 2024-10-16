import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  generateAccessToken(user: any) {
    const payload = { username: user.username };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN'),
      expiresIn: '1h',
    });
  }

  generateRefreshToken(user: any) {
    const payload = { username: user.username };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      expiresIn: '7d',
    });
  }

  async updateRefreshToken(username: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    return this.userService.updateUserRefreshToken(
      username,
      hashedRefreshToken,
    );
  }

  async removeRefreshToken(username: string) {
    this.userService.updateUserRefreshToken(username, null);
  }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const user = await this.userService.create(createUserDto);
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  async login(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await this.updateRefreshToken(username, refreshToken);
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      });
      const user = await this.userService.findOne(payload.username);
      if (!user) throw new UnauthorizedException('Invalid refresh token');

      const accessToken = this.generateAccessToken(user);

      return { accessToken };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log('AuthService ~ refreshToken ~ error:', error);
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }
}
