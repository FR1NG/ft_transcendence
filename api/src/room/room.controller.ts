import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateRoomDto } from './dto/room.dto';
import { AuthGuard } from 'src/auth/jwt.guard';

@Controller('room')
export class RoomController {

  @Post()
  @UseGuards(AuthGuard)
  async createRoom(@Body() room: CreateRoomDto) {
    return room;
  }
}
