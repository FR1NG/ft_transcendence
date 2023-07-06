import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserModule } from 'src/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [UserModule, JwtModule],
  providers: [ChatGateway, JwtService, UserService, ConfigService, PrismaService]
})
export class ChatModule {}
