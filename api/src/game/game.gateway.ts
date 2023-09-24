import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  WsException,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { Logger, UseGuards } from '@nestjs/common';
import { WsAuthGuard } from 'src/auth/ws.guard';
import { InvitationService } from 'src/invitation/invitation.service';
import { WsUser } from 'src/common/decorators/ws-user.decorator';
import { AuthenticatedUser } from 'src/types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GameMode, Games } from '@prisma/client';

@WebSocketGateway({namespace: '/game'})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly gameService: GameService,
    private invitationService: InvitationService,
    private jwtService: JwtService,
    private config: ConfigService
  ) {};

  // private clients: { [clientId: string]: { gameId: string, role: 'Host' | 'Guest' } } = {};
  private gameLoopIntervalIds: { [gameId: string]: NodeJS.Timeout } = {};
  private readyPlayers: { [gameId: string]: ('Host' | 'Guest')[] } = {};
  private readonly logger = new Logger(GameGateway.name);
  private clients: Map<string, {socket: Socket, game?: Games}> = new Map();
  private ids: Map<string, string> = new Map();

  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    const user = await this.getUser(client);
    if(!user)
      throw new WsException('unauthorized user');
    this.clients.set(user.sub, {socket: client});
    this.ids.set(client.id, user.sub);
  }

  @SubscribeMessage('joinQueue')
  @UseGuards(WsAuthGuard)
  joinQueue(client: any, mode: GameMode = 'NORMAL') {
    const user = client.user
    this.logger.verbose(`${user.username} joined ${mode} queue`);
    this.gameService.joinQueue(user.sub, mode);
    this.processPlayer(client, mode)
  }
  
  async processPlayer(client: Socket, mode: GameMode): Promise<void> {
    this.handlePlayerConnection(client, mode);
    const game = await this.matchPlayers(mode);
    if (game) {
      this.logger.verbose(`playes matched ${game.hostId} and ${game.guestId}`);
        this.gameService.initializeGameState(game.id, mode);
        this.broadcastGameState(game.id);
    } else {
        client.emit('waitingForMatch');
    }
  }  

  @SubscribeMessage('setSelectedMode')
  async setSelectedMode(client: Socket, mode: GameMode): Promise<void> {
    this.handlePlayerConnection(client, mode);
    const game = await this.matchPlayers(mode);
    if (game) {
        console.log("Game ID:", game.id);
        this.broadcastGameState(game.id);
    } else {
        client.emit('waitingForMatch');
    }
  }

  handlePlayerConnection(client: Socket, mode: GameMode): void {
    // console.log(`Client connected: ${client.id}`);
    // if (!this.gameService.isPlayerInQueue(client.id)) {
    //   this.gameService.joinQueue(client.id, mode);
    // }
  }
  
  async matchPlayers(mode: GameMode): Promise<Games> {
    console.log("Attempting to match players...");
    const players = this.gameService.getPlayersForMatch(mode);
    if (!players) return null;
    const [player1, player2] = players;
    const client1 = this.clients.get(player1);
    const client2 = this.clients.get(player2);
    if(!client1)
      this.gameService.removeFromQueue(player1, mode);
    if(!client2)
      this.gameService.removeFromQueue(player2, mode);
    if(!client1 || !client2)
      return null;
    const game = await this.gameService.createGame(player1, player2, mode);
    client1.game = game;
    client2.game = game;
    client1.socket.join(game.id);
    client2.socket.join(game.id);
    client1.socket.emit('matchFound', { role: 'Host', gameId:game.id });
    client2.socket.emit('matchFound', { role: 'Guest', gameId:game.id });
    return game;
}

  @SubscribeMessage('joinQueueAgain')
  handleRestartRequest(client: Socket, data: any): void {
    // const mode: GameMode = data;
    // const clientId = client.id;
    // console.log(`Received joinQueueAgain from ${client.id}`);
    // const clientData = this.clients[clientId];
    // if (clientData) {
    //   const { gameId } = clientData;
    //   const currentState = this.gameService.getCurrentState(gameId);
    //   if (currentState) {
    //     currentState.gameOver = true;
    //     this.gameService.resetGameState(gameId, mode);
    //     this.broadcastGameState(gameId);
    //   }
    // }
    // this.processPlayer(client, mode);
  }

  startGameLoop(gameId: string) {
    const currentState = this.gameService.getCurrentState(gameId);
    if (!currentState.gameStarted || this.gameLoopIntervalIds[gameId]) return;
      this.gameLoopIntervalIds[gameId] = setInterval(() => {
        this.gameService.updateBallPosition(gameId);
        this.broadcastGameState(gameId);
        const players = this.gameService.getCurrentState(gameId).players;
        const winner = players.find(player => player.score >= 10);
        if (winner) {
          clearInterval(this.gameLoopIntervalIds[gameId]);
          currentState.gameOver = true;
          currentState.winner = winner.id;
          this.server.to(gameId).emit('announceWinner', winner.id);
          this.broadcastGameState(gameId);
        }
      }, 16);
  }

  private removeUserFromQueues(userId: string) {
    for (const mode of Object.values(GameMode)) {
        this.gameService.removeFromQueue(userId, mode);
    }
  }

  async handleDisconnect(client: Socket) {

    const user = await this.getUser(client)
    if(!user)
      throw new WsException('unauthorized');
    const userId = user.sub;
    // console.log(`Client disconnected: ${user.sub}`);
    
    // Remove player from all queues 
    this.removeUserFromQueues(userId);
    // const clientData = this.clients[userId];
    // if (!clientData) {
    //     console.log(`Client with ID ${userId} was not in an active game.`);
    //     return;
    // }
    // const { gameId, role } = clientData;
    // const gameReadyPlayers = this.readyPlayers[gameId];
    // if (gameReadyPlayers) {
      // const index = gameReadyPlayers.indexOf(role);
      // if (index > -1) {
          // gameReadyPlayers.splice(index, 1);
      // }
    // }
    // let oppositeRole: 'Host' | 'Guest' = role === 'Host' ? 'Guest' : 'Host';
    // this.server.to(gameId).emit('opponentDisconnected', oppositeRole);
    // const currentState = this.gameService.getCurrentState(gameId);
    // if (!currentState.gameOver) {
    //   currentState.gameOver = true;
    const game = await this.gameService.getMyGame(user, 'STARTED');
    if(!game)
      return;
    this.gameService.resetGameState(game.id, game.mode);
    clearInterval(this.gameLoopIntervalIds[game.id]);
    // }
    // delete this.clients[clientId];
    // delete this.readyPlayers[gameId];
    this.broadcastGameState(game.id);
  }

  // to be optimized
  joinRoon(game: Games) {
    this.clients.get(game.guestId).socket.join(game.id);
    this.clients.get(game.hostId).socket.join(game.id);
  }

  @SubscribeMessage('startGame')
  @UseGuards(WsAuthGuard)
  async handleGameStart(client: any): Promise<void> {
    // console.log(client)
    const user = client.user;
    const socket = this.clients.get(user.sub)
    if (!socket) {
      console.log(`Client with ID ${client.id} was not found in the clients list.`);
      return;
    }
    const game = await this.gameService.getMyGame(user, 'CREATED');
    if(!game) throw new WsException('game not found');
    if (!this.readyPlayers[game.id]) this.readyPlayers[game.id] = [];
    this.readyPlayers[game.id].push(user.sub);
    if (this.readyPlayers[game.id].length === 2) {
      this.logger.verbose('players are ready');
      this.joinRoon(game);
      this.server.to(game.id).emit('gameStarted');
      this.gameService.initializeGameState(game.id, game.mode);
      this.gameService.setPlayersId(game.id, game.hostId, game.guestId);
      const currentState = this.gameService.getCurrentState(game.id);
      currentState.gameStarted = true;
      this.startGameLoop(game.id);
      this.broadcastGameState(game.id);
    } else {
      client.emit('waitingForOtherPlayer');
    }
  }

  @SubscribeMessage('move')
  handlePlayerMove(client: Socket, payload: { player: string, direction: number }): void {
    // if (!['Host', 'Guest'].includes(payload.player)) client.emit('error', 'Invalid player.');
    if (![1, 2].includes(payload.direction)) client.emit('error', 'Invalid move direction.');
    else {
      const userId = this.ids.get(client.id);
      const game = this.clients.get(userId).game;
      this.gameService.movePlayer(userId, payload.direction, game.id);
      client.emit('moveReceived', `Move received for ${payload.player} with direction ${payload.direction}`);
      this.broadcastGameState(game.id);
    }
  }  

  @SubscribeMessage('canvasDimensions')
  handleCanvasDimensions(client: Socket, dimensions: { width: number, height: number }): void {
    const game = this.clients.get(this.ids.get(client.id))?.game;
    if (game) {
      this.gameService.updateCanvasDimensions(dimensions.width, dimensions.height, game?.id);
    } else {
      console.warn("Game ID not found for client:", client.id);
    }
  }  

  @SubscribeMessage('updateGameState')
  broadcastGameState(gameId: string): void {
    const currentState = this.gameService.getCurrentState(gameId);
    this.server.to(gameId).emit('state', currentState);
  }

  generateUniqueGameId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
  
  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('error')
  handleError(client: Socket, error: any) {
    console.error("Server-side error:", error);
  }

  // requesting game infos
  @SubscribeMessage('request-info')
  @UseGuards(WsAuthGuard)
  async requestInfo(client: any, payload: any) {
    // const { user } = client;
    // if(!this.sockets.has(user.sub))
    //   this.sockets.set(user.sub, client);
    // const game = await this.invitationService.getGameByInvit(payload.invitationId);
    // client.join(game.id);
    // console.log(this.server.sockets.adapter.rooms.get(game.id).length)
    // const host = this.sockets.get(game.hostId);
    // const guest = this.sockets.get(game.guestId);
    // if(host)
    //   host.emit('user-joined', game)
    // if(guest)
    //   host.emit('user-joined', game)
  }
  // listning for events
  // @OnEvent('game.created')
  // handleGameCreate(payload) {
  // }

  // getting user from the handshake
  private async getUser(client: Socket): Promise<AuthenticatedUser> {
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
}
