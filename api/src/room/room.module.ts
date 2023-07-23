import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [RoomService, JwtService, ConfigService],
  controllers: [RoomController]
})
export class RoomModule {}
