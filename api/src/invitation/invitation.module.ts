import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  providers: [
    InvitationService,
    ConfigService,
    JwtService,
    PrismaService,
    NotificationService
  ],
  controllers: [InvitationController]

})
export class InvitationModule {}
