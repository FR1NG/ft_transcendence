import { Injectable } from '@nestjs/common';
import { Player, Ball, GameState } from './dto/game.dto';
const BASE_MOVE_DISTANCE = 0.02;
@Injectable()
export class GameService {
  private gameStates: { [gameId: string]: GameState } = {};
  private playerQueue: string[] = [];

  constructor() {}

  public initializeGameState(gameId: string): void {
    if (!this.gameStates[gameId]) {
        this.resetGameState(gameId);
    }
  }

  private initializePlayers(): Player[] {
    return [
      {
        id: 'Host',
        paddleYRatio: 0.5,
        paddleWidthRatio: 0.020,
        paddleHeightRatio: 0.25,
        score: 0,
        xRatio: 0
      },
      {
        id: 'Guest',
        paddleYRatio: 0.5,
        paddleWidthRatio: 0.020,
        paddleHeightRatio: 0.25,
        score: 0,
        xRatio: 0.98
      }
    ];    
  }

  public resetGameState(gameId: string): void {
    this.gameStates[gameId] = {
      players: this.initializePlayers(),
      ball: {
        xRatio: 0.5,
        yRatio: 0.5,
        radiusRatio: 0.020,
        velocityXRatio: 0.009,
        velocityYRatio: 0,
      },
      gameStarted: false,
      gameOver: false,
    };
  }

  private checkCollision(ball: Ball, player: Player): boolean {
    if (!player || !ball) {
      return ;
    }  
    const ballTop = ball.yRatio - ball.radiusRatio;
    const ballBottom = ball.yRatio + ball.radiusRatio;
    const ballLeft = ball.xRatio - ball.radiusRatio;
    const ballRight = ball.xRatio + ball.radiusRatio;
    const playerTop = player.paddleYRatio - player.paddleHeightRatio / 2;
    const playerBottom = player.paddleYRatio + player.paddleHeightRatio / 2;
    const playerLeft = player.xRatio;
    const playerRight = player.xRatio + player.paddleWidthRatio;
    return !(ballLeft > playerRight || ballRight < playerLeft || ballTop > playerBottom || ballBottom < playerTop);
  }

  public updateBallPosition(gameId: string): void {
    const gameState = this.gameStates[gameId];
    if (!gameState || gameState.gameOver) return;
    const ball = gameState.ball;
    const players = gameState.players;
    const newXRatio = ball.xRatio + ball.velocityXRatio;
    const newYRatio = ball.yRatio + ball.velocityYRatio;
    ball.xRatio = newXRatio;
    ball.yRatio = newYRatio;
    // Limit the vertical velocity
    const MAX_Y_VELOCITY = 0.005;
    ball.velocityYRatio = Math.min(MAX_Y_VELOCITY, Math.max(-MAX_Y_VELOCITY, ball.velocityYRatio));
    // Ensure minimum horizontal velocity
    const MIN_X_VELOCITY = 0.004;
    if (Math.abs(ball.velocityXRatio) < MIN_X_VELOCITY) {
      ball.velocityXRatio = (ball.velocityXRatio < 0 ? -1 : 1) * MIN_X_VELOCITY;
    }
    if (ball.yRatio - ball.radiusRatio < 0 || ball.yRatio + ball.radiusRatio > 1) {
      ball.velocityYRatio = -ball.velocityYRatio;
      this.normalizeVelocity(ball);
    }
    if (ball.xRatio - ball.radiusRatio > 1) {
      players[0].score++;
      this.checkForWinner(gameId, players);
      this.resetBall(gameId);
    }
    if (ball.xRatio + ball.radiusRatio < 0) {
      players[1].score++;
      this.checkForWinner(gameId, players);
      this.resetBall(gameId);
    }
    if (this.checkCollision(ball, players[0])) {
      ball.velocityXRatio = Math.abs(ball.velocityXRatio);
      ball.velocityYRatio += (Math.random() - 0.5) * 0.01;
      this.normalizeVelocity(ball);
    }
    if (this.checkCollision(ball, players[1])) {
      ball.velocityXRatio = -Math.abs(ball.velocityXRatio);
      ball.velocityYRatio += (Math.random() - 0.5) * 0.01;
      this.normalizeVelocity(ball);
    }
  }

  public normalizeVelocity(ball: Ball): void {
    const magnitude = Math.sqrt(Math.pow(ball.velocityXRatio, 2) + Math.pow(ball.velocityYRatio, 2));
    const desiredMagnitude = 0.009;
    ball.velocityXRatio = (ball.velocityXRatio / magnitude) * desiredMagnitude;
    ball.velocityYRatio = (ball.velocityYRatio / magnitude) * desiredMagnitude;
  }

  private checkForWinner(gameId: string, players: Player[]): void {
    const winningPlayer = players.find(player => player.score >= 10);
    if (winningPlayer) {
      this.declareWinner(gameId, winningPlayer.id);
    }
  }

  private isNumberValid(value: any): boolean {
    return typeof value === 'number' && !isNaN(value) && value !== undefined;
  }

  updateCanvasDimensions(width: number, height: number, gameId: string): void {
    const gameState = this.gameStates[gameId];
    if (!gameState) return;
    if (this.isNumberValid(width) && this.isNumberValid(height)) {
      gameState.canvasWidth = width;
      gameState.canvasHeight = height;
      const rightPlayer = gameState.players.find(p => p.id === 'Guest');
      if (rightPlayer) {
        rightPlayer.xRatio = 1 - rightPlayer.paddleWidthRatio;
      }
    } else {
      console.warn("Invalid canvas dimensions provided:", width, height);
    }
  }

  movePlayer(playerId: string, direction: number, gameId: string): void {
    const gameState = this.gameStates[gameId];
    if (!gameState || gameState.gameOver) return;
    const MOVE_DISTANCES = {
      1: -BASE_MOVE_DISTANCE,
      2: BASE_MOVE_DISTANCE,
    };
    const player = gameState.players.find(p => p.id === playerId);
    if (player) {
      const newY = player.paddleYRatio + MOVE_DISTANCES[direction];
      // The conditions are based on the ratios, so 0 and 1 are the top and bottom of the canvas, respectively.
      if (newY - player.paddleHeightRatio / 2 < 0) {
        player.paddleYRatio = player.paddleHeightRatio / 2;
      } else if (newY + player.paddleHeightRatio / 2 > 1) {
        player.paddleYRatio = 1 - player.paddleHeightRatio / 2;
      } else {
        player.paddleYRatio = newY;
      }
    }
  }  

  private resetBall(gameId: string): void {
    const gameState = this.gameStates[gameId];
    const ball = gameState.ball;
    ball.xRatio = 0.5;
    ball.yRatio = 0.5;
    ball.velocityXRatio = (Math.random() < 0.05 ? -1 : 1) * 0.009;
    ball.velocityYRatio = 0;
  }

  getCurrentState(gameId: string): GameState {
    return this.gameStates[gameId];
  }

  removePlayer(gameId: string, playerId: string): string | null {
    const gameState = this.gameStates[gameId];
    if (!gameState) return null;
    const removedPlayer = gameState.players.find(player => player.id === playerId);
    gameState.players = gameState.players.filter(player => player.id !== playerId);
    if (removedPlayer && gameState.gameStarted) {
        gameState.gameStarted = false;
        gameState.gameOver = true;
        // Get the ID of the remaining player.
        const remainingPlayer = gameState.players[0];
        return remainingPlayer ? remainingPlayer.id : null;
    }
    return null;
}

private declareWinner(gameId: string, playerId: string): void {
  console.log(`Player ${playerId} is the winner!`);
  this.gameStates[gameId].gameOver = true;
  // Stop the ball and paddles from moving
  this.gameStates[gameId].ball.velocityXRatio = 0;
  this.gameStates[gameId].ball.velocityYRatio = 0;
  this.gameStates[gameId].players.forEach(player => {
    player.paddleYRatio = 0.5; // Reset paddle position to the middle
  });
}

  addPlayer(gameId: string, clientId: string): void {
    // If the game doesn't exist, initialize it
    if (!this.gameStates[gameId]) {
      this.resetGameState(gameId);
    }
    const gameState = this.gameStates[gameId];
    // Check how many players are currently active
    const playerCount = gameState.players.length;
    let playerId = '';
    if (playerCount === 0) {
        playerId = 'Host';
    } else if (playerCount === 1) {
        playerId = 'Guest';
    } else {
      // More than two players are not allowed, so put the player in the queue
      this.playerQueue.push(clientId);
      return;
    }
    const newPlayer: Player = {
      id: playerId,
      paddleYRatio: 0.5,  // Initialized in the middle
      paddleWidthRatio: 0.025,
      paddleHeightRatio: 0.28,
      score: 0,
      xRatio: playerId === 'Host' ? 0 : 0.98  // Respectively at the left and right edges
    };
    gameState.players.push(newPlayer);
  }

  removeGame(gameId: string): void {
    delete this.gameStates[gameId];
  }

  //add a player to the queue:
  joinQueue(playerId: any): void { 
    if (!this.isPlayerInQueue(playerId)) {
       this.playerQueue.push(playerId);
    }
  }

  // check the number of players in the queue:
  getQueueLength(): number {
    return this.playerQueue.length;
  }
  
  //get players from the queue for a match:
  getPlayersForMatch(): any {
    if (this.playerQueue.length >= 2) {
      const player1 = this.playerQueue.shift();
      const player2 = this.playerQueue.shift();
      return [player1!, player2!];
    }
    return null;
  }

  //remove player from the queue (in case they disconnect before the match starts) 
  removeFromQueue(playerId: string): void {
    const index = this.playerQueue.indexOf(playerId);
    if (index !== -1) {
      this.playerQueue.splice(index, 1);
    }
  }  

  // Check if a player is in the queue:
  isPlayerInQueue(playerId: string): boolean {
    return this.playerQueue.includes(playerId);
  }

  // Handle when a player disconnects from an active game:
  handlePlayerDisconnection(assignedPlayerId: string, gameId: string): string | null {
    const currentState = this.getCurrentState(gameId);
    // If the game is not started, simply return null.
    if (!currentState.gameStarted) return null;
    // Determine the other player.
    const otherPlayer = currentState.players.find(player => player.id !== assignedPlayerId);
    // If there is another player, they win. Otherwise, there's no winner.
    if (otherPlayer) {
      // Update the game's state to end the game and set the winner.
      currentState.gameOver = true;
      currentState.winner = otherPlayer.id;
      return otherPlayer.id;
    }
    return null; // No winner determined.
  }
}
