import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from 'src/auth/jwt.guard';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {

  constructor(private notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUserNotifications(@Req() request) {
    const { sub } = request.user;
    return await this.notificationService.getUserNotifications(sub);
  }
}
