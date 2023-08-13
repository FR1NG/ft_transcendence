import { Body, Controller, Get, Post, UseGuards, Req, Query } from '@nestjs/common';
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
  async getTestToken(@Query('username') username) {
    return await this.authService.getFakeToken(username);
  }
}
