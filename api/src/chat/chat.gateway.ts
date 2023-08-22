import { HttpException, HttpStatus, UseFilters, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { WsAuthGuard } from 'src/auth/ws.guard';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import { MessagePaylod } from './dto/chat';
import { WebSocketExceptionFilter } from 'src/exception-filters/websocket.filter';
import { RoomService } from 'src/room/room.service';
import { Server, Socket } from 'socket.io'

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
    private roomService: RoomService
  ) {}

  @WebSocketServer()
  private server: Server;

  private clients: Map<string, any> = new Map();

  async handleConnection(client: Socket, ...args: any[]) {
      const payload = await this.getUser(client);
      if(payload) {
      client['user'] = payload;
      if(payload?.sub) {
        // setting the user status to online
        this.userService.setOnline(payload.sub, true);
        // getting all rooms for the authenticated user
        const rooms = await this.roomService.getUserRooms(payload);
        // joining the socket of the user rooms
        rooms.forEach(el => {
          client.join(el.room.id);
        });
      }
      // adding the user of the connected user map
      this.clients.set(payload.sub, client);
    }
  }

  async handleDisconnect(client: Socket) {
      const payload = await this.getUser(client);
      if(payload?.sub)
        await this.userService.setOnline(payload.sub, false);
  }

  @SubscribeMessage('message')
  @UseFilters(WebSocketExceptionFilter)
  @UseGuards(WsAuthGuard)
  async handleMessage(client: any, payload: MessagePaylod): Promise<any> {
    const { user } = client;
    if(payload.type === 'dm') {
      const message: any = await this.chatService.createDm(payload, user);
      client.emit('feedback', {status: 'success', tmpId: payload.id, message, recieverId: payload.recieverId});
      const clientReciever = this.clients.get(payload.recieverId);
      if(clientReciever) {
        clientReciever.emit('message', message);
      }
    } else if (payload.type === 'room') {
      console.log(payload);
        const message: any = await this.chatService.createRoomMessage(user, payload);
        console.log(message);
        this.server.to(payload.recieverId).emit('room-message', message);
    }
  }

  @SubscribeMessage('connection')
  @UseGuards(WsAuthGuard)
  async connectionHandler(client: any, payload: any): Promise<string> {
    const { sub } = client.user;
    console.log(client.user)
    return "connected";
  }

  private async getUser(client: any) {
    const token = client.handshake?.auth?.token;
      if(!token)
        return null
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.config.get('APP_KEY')
        }
      );
      return payload;
    } catch(error) {
      return null
    }
  }
}
