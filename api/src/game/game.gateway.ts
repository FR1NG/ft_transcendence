import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { Logger, UseGuards } from '@nestjs/common';
import { GameMode } from './dto/game.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { WsAuthGuard } from 'src/auth/ws.guard';
import { InvitationService } from 'src/invitation/invitation.service';
import { ChatGateway } from 'src/chat/chat.gateway';

@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(
    private readonly gameService: GameService,
    private invitationService: InvitationService,
  ) {};

  private clients: { [clientId: string]: { gameId: string, role: 'Host' | 'Guest' } } = {};
  private gameLoopIntervalIds: { [gameId: string]: NodeJS.Timeout } = {};
  private readyPlayers: { [gameId: string]: ('Host' | 'Guest')[] } = {};
  private readonly logger = new Logger(GameGateway.name);
  private sockets: Map<string, Socket> = new Map();

  handleConnection(client: Socket, ...args: any[]): void {
    // adding user to the list of connected users
    this.logger.log(`Client ${client.id} connected at ${Date.now()}`);
    const mode = client.handshake.query.mode as GameMode;
    console.log('mode:', mode);
    if (!mode) {
      console.error("Mode not provided in initial connection");
      return;
    }
    console.log('tesssssssst');
    this.handlePlayerConnection(client, mode);
    const gameId = this.matchPlayers(mode);
    if (gameId) {
      console.log("Game ID:", gameId);
      const currentState = this.gameService.getCurrentState(gameId);
      this.broadcastGameState(gameId);
    } else {
      client.emit('waitingForMatch');
    }
  }

  @SubscribeMessage('setSelectedMode')
  setSelectedMode(client: Socket, mode: GameMode): void {
    this.handlePlayerConnection(client, mode);
    const gameId = this.matchPlayers(mode);
    if (gameId) {
        console.log("Game ID:", gameId);
        this.broadcastGameState(gameId);
    } else {
        client.emit('waitingForMatch');
    }
  }

  handlePlayerConnection(client: Socket, mode: GameMode): void {
    console.log(`Client connected: ${client.id}`);
    this.gameService.joinQueue(client.id, mode);
    client.emit('showStartButton');
  }

  matchPlayers(mode: GameMode): string | null {
    console.log("Attempting to match players...");
    let players: [string, string] | null = null;
    while (!players) {
      players = this.gameService.getPlayersForMatch(mode);
      if (!players) return null;
      const [player1, player2] = players;
      if (!(this.server.sockets.sockets.get(player1) && this.server.sockets.sockets.get(player2))) {
        // Remove disconnected players from the queue
        if (!this.server.sockets.sockets.get(player1)) {
            this.gameService.removeFromQueue(player1, mode);
        }
        if (!this.server.sockets.sockets.get(player2)) {
            this.gameService.removeFromQueue(player2, mode);
        }
        players = null;
        continue;
      }
      const gameId = this.generateUniqueGameId();
      this.gameService.initializeGameState(gameId, mode);
      this.clients[player1] = { gameId, role: 'Host' };
      this.clients[player2] = { gameId, role: 'Guest' };
      this.server.sockets.sockets.get(player1)?.join(gameId);
      this.server.sockets.sockets.get(player2)?.join(gameId);
      this.server.to(player1).emit('matchFound', { role: 'Host', gameId });
      this.server.to(player2).emit('matchFound', { role: 'Guest', gameId });        
      return gameId;
    }
    return null;
  }

  @SubscribeMessage('joinQueueAgain')
  handleRestartRequest(client: Socket, mode: GameMode) {
    const clientId = client.id;
    const clientData = this.clients[clientId];
    if (clientData) {
      const { gameId } = clientData;
      const currentState = this.gameService.getCurrentState(gameId);
      if (currentState) {
        currentState.gameOver = true;
        this.gameService.resetGameState(gameId, mode);
        this.broadcastGameState(gameId);
      }
    }
    this.handlePlayerConnection(client, mode);
  }

  @SubscribeMessage('disconnect')
  handleDisconnectEvent(client: Socket, mode: GameMode) {
    this.handleDisconnect(client, mode);
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

  handleDisconnect(client: Socket, mode: GameMode) {
    const clientId = client.id;
    console.log(`Client disconnected: ${client.id}`);
    // Remove player from all queues regardless of the game mode
    Object.values(GameMode).forEach(mode => {
      this.gameService.removeFromQueue(clientId, mode);
    });
  
    if (!this.clients[clientId]) {
      console.log(`Client with ID ${clientId} was not found in the clients list. Possibly disconnected before a match.`);
      return;
    }
    const { gameId, role } = this.clients[clientId];
    // Remove player from readyPlayers list (if they're in there)
    if (this.readyPlayers[gameId]) {
      const index = this.readyPlayers[gameId].indexOf(role);
      if (index > -1) {
          this.readyPlayers[gameId].splice(index, 1);
      }
    }
    // If the client was unmatched
    if (typeof role === 'undefined') {
      console.log(`Unmatched client with ID ${clientId} disconnected.`);
      this.gameService.removeFromQueue(clientId, mode);
      return;
    }
    const currentState = this.gameService.getCurrentState(gameId);
    if (currentState.gameOver) {
      clearInterval(this.gameLoopIntervalIds[gameId]);
      delete this.clients[clientId];
      return;
    }
    // If the client was in an active game
    let winnerRole: 'Host' | 'Guest' = role === 'Host' ? 'Guest' : 'Host';
    this.server.to(gameId).emit('announceWinner', winnerRole);
    this.server.to(gameId).emit('hideStartButton');
    currentState.gameOver = true;
    clearInterval(this.gameLoopIntervalIds[gameId]);
    delete this.clients[clientId];
    this.broadcastGameState(gameId);
  }

  @SubscribeMessage('startGame')
  handleGameStart(client: Socket): void {
    if (!this.clients[client.id]) {
      console.log(`Client with ID ${client.id} was not found in the clients list.`);
      return;
    }
    const { gameId, role } = this.clients[client.id];
    if (!gameId || (role !== 'Host' && role !== 'Guest')) return;
    if (!this.readyPlayers[gameId]) this.readyPlayers[gameId] = [];
    this.readyPlayers[gameId].push(role);
    if (this.readyPlayers[gameId].length === 2) {
      this.server.to(gameId).emit('gameStarted');
      const currentState = this.gameService.getCurrentState(gameId);
      currentState.gameStarted = true;
      if (currentState.gameStarted) this.startGameLoop(gameId);
      this.broadcastGameState(gameId);
    } else {
      client.emit('waitingForOtherPlayer');
    }
  }

  @SubscribeMessage('move')
  handlePlayerMove(client: Socket, payload: { player: string, direction: number }): void {
    const { gameId } = this.clients[client.id];
    if (!['Host', 'Guest'].includes(payload.player)) client.emit('error', 'Invalid player.');
    else if (![1, 2].includes(payload.direction)) client.emit('error', 'Invalid move direction.');
    else {
      this.gameService.movePlayer(payload.player, payload.direction, gameId);
      client.emit('moveReceived', `Move received for ${payload.player} with direction ${payload.direction}`);
      this.broadcastGameState(gameId);
    }
  }  

  @SubscribeMessage('canvasDimensions')
  handleCanvasDimensions(client: Socket, dimensions: { width: number, height: number }): void {
    const { gameId } = this.clients[client.id];
    if (gameId) {
      this.gameService.updateCanvasDimensions(dimensions.width, dimensions.height, gameId);
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
    const { user } = client;
    if(!this.sockets.has(user.sub))
      this.sockets.set(user.sub, client);
    const game = await this.invitationService.getGameByInvit(payload.invitationId);
    client.join(game.id);
    console.log(this.server.sockets.adapter.rooms.get(game.id))
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

}
