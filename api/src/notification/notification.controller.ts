import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from 'src/auth/jwt.guard';
import { NotificationService } from './notification.service';
import { AuthenticatedUser } from 'src/types';
import { User } from 'src/common/decorators'

@Controller('notification')
export class NotificationController {

  constructor(private notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUserNotifications(@User() user: AuthenticatedUser) {
    const { sub } = user;
    return await this.notificationService.getUserNotifications(sub);
  }

  @Post('read')
  @UseGuards(AuthGuard)
  async markRead(@User() user: AuthenticatedUser, @Body('ids') ids: Array<number>) {
    return await this.notificationService.markRead(user, ids)
  }

}
