import { Controller, UseGuards, Get, Req, Query, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/jwt.guard';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Get('user-conversation/:userId')
  async getUsersConversation(@Req() request, @Param('userId') userId) {
    const { user } = request;

    return await this.chatService.getUsersConversation(user, userId);
  }
}
