import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserModule } from 'src/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { RoomService } from 'src/room/room.service';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  imports: [UserModule, JwtModule],
  providers: [
    ChatGateway,
    JwtService,
    UserService,
    ConfigService,
    PrismaService,
    ChatService,
    RoomService,
    CaslAbilityFactory,
    NotificationService
  ],
  controllers: [ChatController]
})
export class ChatModule {}
