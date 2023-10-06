import { Controller, Post, Body, UseGuards, Get, Query, Param, Delete, Patch } from '@nestjs/common';
import { CreateRoomDto, InviteUserDto, JoinRoomDto, UpdateRoomDto, MuteUserDto } from './dto/room.dto';
import { AuthGuard } from 'src/auth/jwt.guard';
import { RoomService } from './room.service'
import type { AuthenticatedUser } from 'src/types'
import { CheckRoomAbility, User } from 'src/common/decorators'
import { RoomAbilityGuardGuard } from 'src/common/guards';

@Controller('room')
export class RoomController {

  constructor(private roomService: RoomService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createRoom(@Body() room: CreateRoomDto, @User() user: AuthenticatedUser) {
    return await this.roomService.createRoom(user, room);
  }


  // getting all rooms that a user in
  @Get()
  @UseGuards(AuthGuard)
  async getUserRooms(@User() user: AuthenticatedUser) {
    return await this.roomService.getUserRooms(user);
  }

  // getting users in a room
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

  @Get(':id')
  @UseGuards(RoomAbilityGuardGuard)
  @CheckRoomAbility('read')
  @UseGuards(AuthGuard)
  async getRoom(@User() user: AuthenticatedUser, @Param('id') id: string) {
    return await this.roomService.getRoom(user, id);
  }

  @Get('search/:pattern')
  @UseGuards(AuthGuard)
  async searchRoom(@User() user: AuthenticatedUser, @Param('pattern') pattern: string) {
    return await this.roomService.searchRoom(user, pattern);
  }

  @Post('admin')
  @UseGuards(RoomAbilityGuardGuard)
  @CheckRoomAbility('manage')
  @UseGuards(AuthGuard)
  async addAdmin(@User() user: AuthenticatedUser, @Body('roomId') roomId: string, @Body('userId') userId: string) {
    return await this.roomService.addAdmin(roomId, userId);
  }
  

  @Delete('admin')
  @UseGuards(RoomAbilityGuardGuard)
  @CheckRoomAbility('manage')
  @UseGuards(AuthGuard)
  async removeAdmin(@User() user: AuthenticatedUser, @Body('roomId') roomId: string, @Body('userId') userId: string) {
    return await this.roomService.removeAdmin(roomId, userId);
  }


  // kick a user from a room

  @Post('kick')
  @UseGuards(RoomAbilityGuardGuard)
  @CheckRoomAbility('update')
  @UseGuards(AuthGuard)
  async kickUser(@User() user: AuthenticatedUser, @Body('roomId') roomId: string, @Body('userId') userId: string) {
    return await this.roomService.kickUser(roomId, userId);
  }

  // ban a user

  @Post('ban')
  @UseGuards(RoomAbilityGuardGuard)
  @CheckRoomAbility('update')
  @UseGuards(AuthGuard)
  async banUser(@User() user: AuthenticatedUser, @Body('roomId') roomId: string, @Body('userId') userId: string) {
    return await this.roomService.banUser(roomId, userId);
  }

  @Post('unban')
  @UseGuards(RoomAbilityGuardGuard)
  @CheckRoomAbility('update')
  @UseGuards(AuthGuard)
  async unbanUser(@User() user: AuthenticatedUser, @Body('roomId') roomId: string, @Body('userId') userId: string) {
    return await this.roomService.unbanUser(roomId, userId);
  }

  //leave a room
  @Post('leave')
  @UseGuards(RoomAbilityGuardGuard)
  @CheckRoomAbility('read')
  @UseGuards(AuthGuard)
  async leaveRoom(@User() user: AuthenticatedUser, @Body('roomId') roomId: string) {
    return await this.roomService.leaveRoom(user, roomId);
  }

  @Patch(':id')
  @UseGuards(RoomAbilityGuardGuard)
  @CheckRoomAbility('manage')
  @UseGuards(AuthGuard)
  async updateRoom(@Param('id') id: string, @Body() data: UpdateRoomDto) {
    return await this.roomService.updateRoom(id, data);
  }


  @Post('invite')
  @UseGuards(RoomAbilityGuardGuard)
  @CheckRoomAbility('update')
  @UseGuards(AuthGuard)
  async inviteUser(@User() user: AuthenticatedUser, @Body() data: InviteUserDto) {
    const {roomId, userId} = data;
    return await this.roomService.createInvitation(user, roomId, userId);
  }


  @Delete('invite')
  @UseGuards(RoomAbilityGuardGuard)
  @CheckRoomAbility('update')
  @UseGuards(AuthGuard)
  async deleteInvitation(@Body() data: InviteUserDto) {
    const {roomId, userId} = data;
    return await this.roomService.deleteInvitation(roomId, userId);
  }

  @Post('mute')
  @UseGuards(RoomAbilityGuardGuard)
  @CheckRoomAbility('update')
  @UseGuards(AuthGuard)
  async muteUser(@Body() data: MuteUserDto) {
    return await this.roomService.mute(data);
  }
}
