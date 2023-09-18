import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { PrismaService } from 'src/prisma.service';
import { InvitationService } from 'src/invitation/invitation.service';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [GameController],
  providers: [
    GameService,
    GameGateway,
    PrismaService,
    InvitationService,
    NotificationService,
    UserService,
    ConfigService,
    JwtService,
  ]
})
export class GameModule {}
