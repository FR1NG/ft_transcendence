import { Controller, UseGuards, Get, Req, Query, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/jwt.guard';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Get('conversation/:id')
  async getUsersConversation(@Req() request, @Param('id') id, @Query('type') type: string) {
    const { user } = request;

    if(type === 'dm')
      return await this.chatService.getUsersConversation(user, id);
    else if (type === 'room')
      return await this.chatService.getRoomConversation(user, id);
  }
}
