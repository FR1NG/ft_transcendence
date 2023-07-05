import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway()
export class ChatGateway {

  @WebSocketServer()
  private server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    // console.log(client.id);
    // console.log(payload)
    console.log(this.server);
    return 'Hello world!';
  }

  @SubscribeMessage('connection')
  connectionHandler(client, any, payload: any): string {
    client.emit('connected', 'hello client') 
    return "connected";
  }
}
