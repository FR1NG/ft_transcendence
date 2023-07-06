import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WsAuthGuard } from 'src/auth/ws.guard';
import { UserService } from 'src/user/user.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private userService: UserService) {}

  @WebSocketServer()
  private server;

  @UseGuards(WsAuthGuard)
  handleConnection(client: any, ...args: any[]) {
    // const { sub } = client.user;
    // console.log(sub)
    console.log('from connection handler: ');

  }


  handleDisconnect(client: any) {
    console.log('on disconnect handler');
  }

  @SubscribeMessage('message')
  // @UseGuards(WsAuthGuard)
  handleMessage(client: any, payload: any): string {
    client.emit('message', 'hello mohfuckeh client');
    console.log(payload);
    return 'Hello world!';
  }

  @SubscribeMessage('connection')
  // @UseGuards(WsAuthGuard)
  async connectionHandler(client: any, payload: any): Promise<string> {
    // const { sub } = client.user;
    // const resutl = await  this.userService.setOnline(sub, true);
    // client.emit('connected') 
    // client.emit('message', JSON.stringify(resutl));
    return "connected";
  }
}
