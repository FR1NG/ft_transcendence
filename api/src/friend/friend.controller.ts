import { Controller, Post, Get, Body, UseGuards, Req, Delete } from '@nestjs/common';
import { FriendService } from './friend.service';
import { AuthGuard } from 'src/auth/jwt.guard';
import { NotificationService } from 'src/notification/notification.service';
import { AuthenticatedUser } from 'src/types';
import { User } from 'src/common/decorators'

@Controller('friend')
export class FriendController {
  constructor(private friendService: FriendService, private notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getFriends(@User() user: AuthenticatedUser) {
    return await this.friendService.getFriends(user);
  }

  @Post()
  @UseGuards(AuthGuard)
  async sendFrienRequest(@Body('id') requestedId: string, @Req() request: any) {
    const authUserId = request.user.sub;
    const result = await this.friendService.sendFrienRequest(authUserId, requestedId);
    this.notificationService.createNotification(requestedId, `${request.user.username} sent you a friend request`, `/users/${request.user.username}`);
    return result
  }

  @Post('confirm')
  @UseGuards(AuthGuard)
  async confirmFriendRequest(@Req() request: any, @Body('id') requestId: number) {
    const { user } = request;
    return await this.friendService.confirmFriendRequest(user, requestId);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async unfriend(@User() user: AuthenticatedUser, @Body('userId') userId: string) {
    return await this.friendService.unfriend(user, userId);
  }

  @Get('requests-sent')
  @UseGuards(AuthGuard)
  async getSentRequests(@Req() request: any) {
    const { sub }  = request.user;
    return await this.friendService.getSentRequests(sub);
  }
  
  @Get('online')
  @UseGuards(AuthGuard)
  async getOnlineFriends(@Req() request) {
    const { user } = request;
    return await this.friendService.getOnlineFriends(user);
  }

  @Get('blocked')
  @UseGuards(AuthGuard)
  async getBlocked(@User() user: AuthenticatedUser){
    return await this.friendService.getBlocked(user);
  }

}
