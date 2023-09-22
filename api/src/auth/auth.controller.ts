import { Res, Body, Controller, Get, Post, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './jwt.guard';
import { AuthenticatedUser } from 'src/types';
import { User } from 'src/common/decorators'
import { Response } from 'express';
import { otpDto } from './dto/otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private config: ConfigService) {}

  @Post("/login")
  async login(@Body() data: LoginDto, @Res({ passthrough: true }) response: Response) {
    const { code } = data;

    // response.cookie('hello', 'world');
    return await this.authService.login(code);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async getMe(@User() user: AuthenticatedUser) {

    return await this.authService.getMe(user);
  }

  @Get('otp/qrcode')
  @UseGuards(AuthGuard)
  async getQrCode(@User() user: AuthenticatedUser) {
    return await this.authService.getQrCode(user);
  }

  @Post('otp/enable')
  @UseGuards(AuthGuard)
  async activateOtp(@User() user: AuthenticatedUser, @Body() data: otpDto ) {
    return await this.authService.activateTwoFacotr(user, data.code)
  }

  @Post('otp/disable')
  @UseGuards(AuthGuard)
  async disactivateOtp(@User() user: AuthenticatedUser, @Body() data: otpDto ) {
    return await this.authService.disactivateTwoFactor(user, data.code)
  }

  @Post('otp/virify')
  @UseGuards(AuthGuard)
  async virifyOtp(@User() user: AuthenticatedUser, @Body() data: otpDto ) {
    return await this.authService.verifyOtp(user, data.code)
  }

  // for test only need to be removed
  @Get('/faketoken')
  async getTestToken(@Query('username') username: any) {
    if(this.config.get('MODE') === 'development' && username !== 'hchakoub')
      return await this.authService.getFakeToken(username);
    throw new UnauthorizedException();
  }

}
