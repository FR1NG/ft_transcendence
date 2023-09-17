import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [
    InvitationService,
    ConfigService,
    JwtService,
    PrismaService,
    NotificationService,
    UserService
  ],
  controllers: [InvitationController]

})
export class InvitationModule {}
