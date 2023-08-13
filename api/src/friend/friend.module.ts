import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  controllers: [FriendController],
  providers: [FriendService, JwtService, ConfigService, PrismaService, NotificationService]
})
export class FriendModule {}
