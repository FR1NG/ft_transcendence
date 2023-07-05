import { UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WsAuthGuard } from 'src/auth/ws.guard';
import { UserService } from 'src/user/user.service';

@WebSocketGateway()
export class ChatGateway {
  constructor(private userService: UserService) {}

  @WebSocketServer()
  private server;

  @SubscribeMessage('message')
  @UseGuards(WsAuthGuard)
  handleMessage(client: any, payload: any): string {
    client.emit('message', 'hello mohfuckeh client');
    console.log(payload);
    return 'Hello world!';
  }

  @SubscribeMessage('connection')
  @UseGuards(WsAuthGuard)
  async connectionHandler(client, any, payload: any): Promise<string> {
    const { sub } = client.user;
    const resutl = await  this.userService.setOnline(sub, true);
    client.emit('connected') 
    client.emit('message', JSON.stringify(resutl));
    return "connected";
  }
}
