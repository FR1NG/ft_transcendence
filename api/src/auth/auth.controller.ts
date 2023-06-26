import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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

  @Get('/test')
  @UseGuards(AuthGuard)
  testAuth(){
    return "success";
  }
}
