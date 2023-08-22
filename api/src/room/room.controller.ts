import { Controller, Post, Body, UseGuards, Get, Query, Param } from '@nestjs/common';
import { CreateRoomDto, JoinRoomDto } from './dto/room.dto';
import { AuthGuard } from 'src/auth/jwt.guard';
import { RoomService } from './room.service'
import type { AuthenticatedUser } from 'src/types'
import { User } from 'src/common/decorators'

@Controller('room')
export class RoomController {

  constructor(private roomService: RoomService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createRoom(@Body() room: CreateRoomDto, @User() user: AuthenticatedUser) {
    return await this.roomService.createRoom(user, room);
  }


  @Get()
  @UseGuards(AuthGuard)
  async getUserRooms(@User() user: AuthenticatedUser) {
    return await this.roomService.getUserRooms(user);
  }

  @Get('users')
  @UseGuards(AuthGuard)
  async getRoomUsers(@User() user: AuthenticatedUser, @Query('id') id: string) {
    return await this.roomService.getRoomUsers(user, id);
  }

  @Post('join')
  @UseGuards(AuthGuard)
  async joinRoom(@User() user: AuthenticatedUser, @Body() body: JoinRoomDto) {
    return await this.roomService.joinRoom(user, body);
  }
  @Get(':name')
  @UseGuards(AuthGuard)
  async getRoom(@Param('name') name: string) {
    return await this.roomService.getRoom(null, name);
  }

  @Get('search/:pattern')
  @UseGuards(AuthGuard)
  async searchRoom(@User() user: AuthenticatedUser, @Param('pattern') pattern: string) {
    return await this.roomService.searchRoom(user, pattern);
  }
}
