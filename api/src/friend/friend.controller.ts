import { Controller, Post, Get, Body, UseGuards, Req, Delete } from '@nestjs/common';
import { FriendService } from './friend.service';
import { AuthGuard } from 'src/auth/jwt.guard';

@Controller('friend')
export class FriendController {
  constructor(private friendService: FriendService) {}

  @Post()
  @UseGuards(AuthGuard)
  async sendFrienRequest(@Body('id') requestedId: string, @Req() request: any) {
    const authUserId = request.user.sub;
    return await this.friendService.sendFrienRequest(authUserId, requestedId);
  }

  @Post('confirm')
  @UseGuards(AuthGuard)
  async confirmFriendRequest(@Req() request: any, @Body('id') requestId: number) {
    const { user } = request;
    return await this.friendService.confirmFriendRequest(user, requestId);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async cancelRequest(@Body('id') requestId: number , @Req() request: any) {
    const {user} = request;
    return await this.friendService.cancelRequest(user, requestId);

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

}
