import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/login")
  async login(@Body() data: LoginDto) {
    const { code } = data;
    return await this.authService.login(code);
  }

  @Get('/faketoken')
  async getTestToken() {
    const user = {
      sub: "9606ac7d-7f8c-49c7-a024-bebec87f5aea",
      usename: 'otossa',
    };
    return await this.authService.getFakeToken(user);
  }
}
