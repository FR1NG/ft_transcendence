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

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, JwtModule, ChatModule, FriendModule],
  controllers: [AppController],
  providers: [AppService, AuthGuard, WsAuthGuard],
})
export class AppModule {}
