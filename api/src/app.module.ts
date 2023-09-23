import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthGuard } from './auth/jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { WsAuthGuard } from './auth/ws.guard';
import { ChatModule } from './chat/chat.module';
import { FriendModule } from './friend/friend.module';
import { RoomModule } from './room/room.module';
import { NotificationModule } from './notification/notification.module';
import { CaslModule } from './casl/casl.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { InvitationController } from './invitation/invitation.controller';
import { InvitationModule } from './invitation/invitation.module';
import { GameModule } from './game/game.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    JwtModule,
    ChatModule,
    FriendModule,
    RoomModule,
    NotificationModule,
    CaslModule,
    EventEmitterModule.forRoot(),
    InvitationModule,
    GameModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard, WsAuthGuard],
})
export class AppModule {}
