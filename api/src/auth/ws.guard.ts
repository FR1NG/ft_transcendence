import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private config: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const sock = context.switchToWs();
    const client = sock.getClient();
    const token = client.handshake?.query?.token;
    console.log(token)
    if (!token) {
      throw new WsException('UnauthorizedException');
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.config.get('APP_KEY')
        }
      );
      // 💡 We're assigning the payload to the client object here
      // so that we can access it in our route handlers
      client['user'] = payload;
    } catch {
      console.log('invalid token')
      throw new WsException('UnauthorizedException');
    }
    return true;
  }
}
