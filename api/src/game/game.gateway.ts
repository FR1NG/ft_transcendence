import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({pingTimeout: 10000, pingInterval: 2500})
export class GameGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(private readonly gameService: GameService) {};

  private clients: { [clientId: string]: { gameId: string, role: 'Host' | 'Guest' } } = {};
  private gameLoopIntervalIds: { [gameId: string]: NodeJS.Timeout } = {};
  private readyPlayers: { [gameId: string]: ('Host' | 'Guest')[] } = {};
  private readonly logger = new Logger(GameGateway.name);

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`Client ${client.id} connected at ${Date.now()}`);
    this.handlePlayerConnection(client);
    const gameId = this.matchPlayers();
    if (gameId) {
      console.log("Game ID:", gameId);
      const currentState = this.gameService.getCurrentState(gameId);
      this.broadcastGameState(gameId);
    } else {
      client.emit('waitingForMatch');
    }
  }

  @SubscribeMessage('joinQueueAgain')
  handleRestartRequest(client: Socket) {
    const clientId = client.id;
    // If the client was in a game, we should terminate that game (optional).
    const clientData = this.clients[clientId];
    if (clientData) {
      const { gameId } = clientData;
      const currentState = this.gameService.getCurrentState(gameId);
      if (currentState) {
        currentState.gameOver = true; // End the current game.
        this.gameService.resetGameState(gameId);
        this.broadcastGameState(gameId);
      }
    }
    // Add player back into the queue for matchmaking.
    this.handlePlayerConnection(client);
  }

  @SubscribeMessage('disconnect')
  handleDisconnectEvent(client: Socket) {
    this.handleDisconnect(client);
  }
  
  handlePlayerConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
    this.gameService.joinQueue(client.id);
    client.emit('showStartButton');
  }

  matchPlayers(): string | null {
    console.log("Attempting to match players...");
    let players: [string, string] | null = null;
    while (!players) {
      players = this.gameService.getPlayersForMatch();
      if (!players) return null;
      const [player1, player2] = players;
      if (!(this.server.sockets.sockets.get(player1) && this.server.sockets.sockets.get(player2))) {
        // Remove disconnected players from the queue
        if (!this.server.sockets.sockets.get(player1)) {
            this.gameService.removeFromQueue(player1);
        }
        if (!this.server.sockets.sockets.get(player2)) {
            this.gameService.removeFromQueue(player2);
        }
        players = null;
        continue;
      }
      const gameId = this.generateUniqueGameId();
      this.gameService.initializeGameState(gameId);
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

  handleDisconnect(client: Socket) {
    const clientId = client.id;
    console.log(`Client disconnected: ${client.id}`);
    // If client was not matched or just connected and then disconnected
    if (!this.clients[clientId]) {
        console.log(`Client with ID ${clientId} was not found in the clients list. Possibly disconnected before a match.`);
        this.gameService.removeFromQueue(clientId);  // remove from queue
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
        this.gameService.removeFromQueue(clientId);  // remove from queue
        return;
    }
    // If the client was in an active game
    let winnerRole: 'Host' | 'Guest' = role === 'Host' ? 'Guest' : 'Host';
    this.server.to(gameId).emit('announceWinner', winnerRole);
    this.server.to(gameId).emit('hideStartButton');
    const currentState = this.gameService.getCurrentState(gameId);
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
}
