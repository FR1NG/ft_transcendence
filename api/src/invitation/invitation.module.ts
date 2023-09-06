import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [
    InvitationService,
    ConfigService,
    JwtService,
    PrismaService,
  ],
  controllers: [InvitationController]

})
export class InvitationModule {}
