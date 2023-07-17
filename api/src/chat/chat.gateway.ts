import { UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { WsAuthGuard } from 'src/auth/ws.guard';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import { MessagePaylod } from './dto/chat';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private chatService: ChatService, private userService: UserService, private jwtService: JwtService, private config: ConfigService) {}

  @WebSocketServer()
  private server;

  private clients: Map<string, any> = new Map();

  async handleConnection(client: any, ...args: any[]) {
    const payload = await this.getUser(client);
    client['user'] = payload;
    this.clients.set(payload.sub, client);
  }

  async handleDisconnect(client: any) {
    const payload = await this.getUser(client);
    if(payload?.sub)
      await this.userService.setOnline(payload.sub, false);
  }

  @SubscribeMessage('message')
  @UseGuards(WsAuthGuard)
  async handleMessage(client: any, payload: MessagePaylod): Promise<any> {
    const { user } = client;
    if(payload.type === 'dm') {
      const message = await this.chatService.createDm(payload, user);
      const clientReciever = this.clients.get(payload.recieverId);
      if(clientReciever) {
        clientReciever.emit('message', message);
      }
    }
  }

  @SubscribeMessage('connection')
  @UseGuards(WsAuthGuard)
  async connectionHandler(client: any, payload: any): Promise<string> {
    const { sub } = client.user;
    console.log(client.user)
    // const resutl = await  this.userService.setOnline(sub, true);
    // client.emit('connected') 
    // client.emit('message', JSON.stringify(resutl));
    return "connected";
  }

  private async getUser(client: any) {
    const token = client.handshake?.auth?.token;
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.config.get('APP_KEY')
        }
      );
      return payload;
    } catch {
      throw new WsException('UnauthorizedException');
    }
    
  }
}
