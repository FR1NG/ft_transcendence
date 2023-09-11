import { 
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly gameService: GameService) {};

  private clients: { [clientId: string]: { gameId: string, role: 'Player1' | 'Player2' } } = {}; // 1.1
  
  private gameLoopIntervalIds: { [gameId: string]: NodeJS.Timeout } = {}; // 1.2
  private readyPlayers: { [gameId: string]: ('Player1' | 'Player2')[] } = {};

  handlePlayerConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
    this.gameService.joinQueue(client.id); 
    client.emit('showStartButton');
  }

  matchPlayers(): string | null {
    console.log("Attempting to match players...");
    const players = this.gameService.getPlayersForMatch();
    if (!players) {
        return null;
    }
    const [player1, player2] = players;
    // Ensure players are still connected
    if (!(this.server.sockets.sockets.get(player1) && this.server.sockets.sockets.get(player2))) {
      console.log("One or both of the players are not connected. Retry matching...");
      return this.matchPlayers();
    }
    const gameId = this.generateUniqueGameId();
    this.gameService.initializeGameState(gameId);
    //join client instead of player.id
    this.clients[player1] = { gameId, role: 'Player1' }; 
    this.clients[player2] = { gameId, role: 'Player2' };
    this.server.sockets.sockets.get(player1)?.join(gameId);
    this.server.sockets.sockets.get(player2)?.join(gameId);
    console.log("Updated clients object:", this.clients);
    this.server.to(player1).emit('assignPlayer', { role: 'Player1', gameId });
    this.server.to(player2).emit('assignPlayer', { role: 'Player2', gameId });

    return gameId;
  }

  handleConnection(client: Socket, ...args: any[]): void {
    console.log('client has been connected')
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
  
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Check if client exists in the clients list
    if (!this.clients[client.id]) {
        console.log(`Client with ID ${client.id} was not found in the clients list.`);
        return;
    }
    const { gameId, role } = this.clients[client.id];
    // Handle the client that is in the game queue
    if (!role && this.gameService.isPlayerInQueue(client.id)) {
        this.gameService.removeFromQueue(client.id);
    }
    // Handle the client that was in an active game
    if (role) {
      let winnerId: string | null = this.gameService.handlePlayerDisconnection(role, gameId);
      // Remove the client from the clients list
      delete this.clients[client.id];
      // Update game state for other clients
      this.broadcastGameState(gameId);
      const currentState = this.gameService.getCurrentState(gameId);
      const activePlayers = Object.values(this.clients).filter(client => ['Player1', 'Player2'].includes(client.role));
      if (activePlayers.length === 0 && this.gameLoopIntervalIds && this.gameLoopIntervalIds[gameId]) {
          clearInterval(this.gameLoopIntervalIds[gameId]);
          delete this.gameLoopIntervalIds[gameId];
          currentState.gameStarted = false;
      }
      // Announce the winner if there is one
      if (winnerId) {
          this.server.emit('announceWinner', winnerId);
      }
    }
  }

  startGameLoop(gameId: string) {
    const currentState = this.gameService.getCurrentState(gameId);
    if (currentState.gameStarted) {
      this.gameLoopIntervalIds[gameId] = setInterval(() => {
        this.gameService.updateBallPosition(gameId);
        this.broadcastGameState(gameId);
        // Check for a winner and stop the game if found
        const players = this.gameService.getCurrentState(gameId).players; // assuming players have scores
        const winner = players.find(player => player.score >= 10);
        if (winner) {
          clearInterval(this.gameLoopIntervalIds[gameId]);
          currentState.gameOver = true;
          currentState.winner = winner.id;
          this.server.emit('announceWinner', winner.id); // announce the winner
          this.broadcastGameState(gameId);
        }
      }, 16);
    }
  }  

  @SubscribeMessage('startGame')
  handleGameStart(client: Socket): void {
    if (!this.clients[client.id]) {
      console.log(`Client with ID ${client.id} was not found in the clients list.`);
      return;
    }
    const { gameId, role } = this.clients[client.id];
    if (!gameId || (role !== 'Player1' && role !== 'Player2')) return;
    if (!this.readyPlayers[gameId]) {
        this.readyPlayers[gameId] = [];
    }
    this.readyPlayers[gameId].push(role);
    if (this.readyPlayers[gameId].length === 2) {
        this.server.to(gameId).emit('gameStarted');
        const currentState = this.gameService.getCurrentState(gameId);
        currentState.gameStarted = true;
        if (currentState.gameStarted) {
          this.startGameLoop(gameId);
        }
        this.broadcastGameState(gameId);
    } else {
        client.emit('waitingForOtherPlayer');
    }
  }

  @SubscribeMessage('move')
  handlePlayerMove(client: Socket, payload: { player: string, direction: number }): void {
    const { gameId } = this.clients[client.id];
    if (!['Player1', 'Player2'].includes(payload.player)) {
        client.emit('error', 'Invalid player.');
    } else if (![1, 2].includes(payload.direction)) {
        client.emit('error', 'Invalid move direction.');
    } else {
        this.gameService.movePlayer(payload.player, payload.direction, gameId); // Pass gameId here
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
    console.log('Initialized!');
  }

  @SubscribeMessage('error')
  handleError(client: Socket, error: any) {
      console.error("Server-side error:", error);
  }
}
