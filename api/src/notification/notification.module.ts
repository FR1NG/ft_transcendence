import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [NotificationService, JwtService, ConfigService, PrismaService],
  controllers: [NotificationController]
})
export class NotificationModule {}
