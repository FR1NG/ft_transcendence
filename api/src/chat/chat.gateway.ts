import {  UseFilters, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { WsAuthGuard } from 'src/auth/ws.guard';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import { MessagePaylod } from './dto/chat';
import { WebSocketExceptionFilter } from 'src/exception-filters/websocket.filter';
import { RoomService } from 'src/room/room.service';
import { Server, Socket } from 'socket.io'
import { OnEvent } from '@nestjs/event-emitter';
import { AuthenticatedUser } from 'src/types';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
    private roomService: RoomService
  ) { }

  @WebSocketServer()
  private server: Server;

  private clients: Map<string, Socket> = new Map();

  async handleConnection(client: Socket, ...args: any[]) {
    const payload = await this.getUser(client);
    if (payload) {
      client['user'] = payload;
      if (payload?.sub) {
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
    if (payload?.sub) {
      await this.userService.setOnline(payload.sub, false);
      this.clients.delete(payload.sub);
    }
  }

  afterInit(server: any) {
      
  }

  @SubscribeMessage('message')
  @UseFilters(WebSocketExceptionFilter)
  @UseGuards(WsAuthGuard)
  async handleMessage(client: any, payload: MessagePaylod): Promise<any> {
    const { user } = client;
    if (payload.type === 'dm') {
      const message: any = await this.chatService.createDm(payload, user);
      const clientReciever = this.clients.get(payload.recieverId);
      if (clientReciever) {
        clientReciever.emit('message', message);
      }
      const feed = { status: 'success', tmpId: payload.id, message, recieverId: payload.recieverId };
      return feed;
    } else if (payload.type === 'room') {
      await this.checkRoomAbility(user, payload);
      const message: any = await this.chatService.createRoomMessage(user, payload);
      this.server.to(payload.recieverId).emit('room-message', message);
      const feed = { status: 'success', tmpId: payload.id, message, recieverId: payload.recieverId };
      return feed;
    }
    throw new WsException('invalid message payload');
  }

  private async checkRoomAbility(user: AuthenticatedUser, payload: MessagePaylod) {
    const isAble = await this.roomService.isUserAbleToSend(user, payload);
    if(!isAble)
      throw new WsException('you can not send message to this room');
  }

  private async getUser(client: any) {
    const token = client.handshake?.auth?.token;
    if (!token)
      return null
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.config.get('APP_KEY')
        }
      );
      return payload;
    } catch (error) {
      return null
    }
  }


  // listing to event emitter

  @OnEvent('room.join')
  hadleRoomJoin(payload) {
    const client = this.clients.get(payload.userId);
    if(client) 
      client.join(payload.roomId);
  }


  @OnEvent('room.leave')
  handleRoomLeave(payload) {
    const client = this.clients.get(payload.userId);
    if(client)
      client.leave(payload.roomId);
  }

  @OnEvent('notification.create')
  handleNotificationCreate(payload) {
    const client = this.clients.get(payload.userId);
    if(client)
      client.emit('notification', payload.data);
  }

  // TODO to be moved to game gateway
  @OnEvent('game.created')
  handleGameCreate(payload) {
    console.log('emiting event');
    const to = this.clients.get(payload.toId);
    const by = this.clients.get(payload.byId);
    if(to)
      to.emit('user-joined', payload);
    if(by)
      by.emit('user-joined', payload);
  }

  //client getters
  getClient(id: string): Socket {
    return this.clients.get(id);
  }
}
