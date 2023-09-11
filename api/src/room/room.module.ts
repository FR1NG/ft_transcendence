import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  providers: [RoomService, JwtService, ConfigService, PrismaService, CaslAbilityFactory, NotificationService],
  controllers: [RoomController]
})
export class RoomModule {}
