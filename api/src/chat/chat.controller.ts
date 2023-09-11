import { Controller, UseGuards, Get, Post, Query, Param, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/jwt.guard';
import { AuthenticatedUser } from 'src/types';
import { User } from 'src/common/decorators'

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Get('conversation/:id')
  async getUsersConversation(@User() user: AuthenticatedUser, @Param('id') id, @Query('type') type: string) {
    if(type === 'dm')
      return await this.chatService.getUsersConversation(user, id);
    else if (type === 'room')
      return await this.chatService.getRoomConversation(user, id);
  }



  @UseGuards(AuthGuard)
  @Get('users')
  async getUsers(@User() user: AuthenticatedUser) {
    return this.chatService.getUsers(user);
  }

  @UseGuards(AuthGuard)
  @Post('read')
  async markRead(@User() user: AuthenticatedUser, @Body('id') id: string) {
    return await this.chatService.markRead(user, id);
  }

}
