import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('APP_KEY'),
        signOptions: {
          expiresIn: 360000,
        },
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [ConfigService, AuthService, UserService, PrismaService ]
})
export class AuthModule { }
