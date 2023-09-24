import { Injectable } from '@nestjs/common';
import { Player, Ball, GameState } from './dto/game.dto';
import { PrismaService } from 'src/prisma.service';
import { AuthenticatedUser } from 'src/types';
import { GameStatus, GameMode } from '@prisma/client';

const BASE_MOVE_DISTANCE = 0.02;
const GAME_MODE_CONFIGS = {
  [GameMode.EASY]: {
      MAX_Y_VELOCITY: 0.008,
      MIN_X_VELOCITY: 0.006
  },
  [GameMode.NORMAL]: {
      MAX_Y_VELOCITY: 0.014,
      MIN_X_VELOCITY: 0.012
  },
  [GameMode.HARD]: {
      MAX_Y_VELOCITY: 0.0021,
      MIN_X_VELOCITY: 0.019
  }
};
const BALL_SPEEDS = {
  [GameMode.EASY]: 0.007,
  [GameMode.NORMAL]: 0.013,
  [GameMode.HARD]: 0.020
};

@Injectable()
export class GameService {
  private gameStates: { [gameId: string]: GameState } = {};

  constructor(private prisma: PrismaService) {}

  public initializeGameState(gameId: string, mode: GameMode): void {
    if (!this.gameStates[gameId]) {
        this.resetGameState(gameId, mode);
    }
  }

  private initializePlayers(): Player[] {
    return [
      {
        id: 'Host',
        paddleYRatio: 0.5,
        paddleWidthRatio: 0.017,
        paddleHeightRatio: 0.25,
        score: 0,
        xRatio: 0
      },
      {
        id: 'Guest',
        paddleYRatio: 0.5,
        paddleWidthRatio: 0.017,
        paddleHeightRatio: 0.25,
        score: 0,
        xRatio: 0.98
      }
    ];    
  }

  public setPlayersId(gameId: string, hostId: string, guestId: string) {
    const state = this.gameStates[gameId];
    if(!state)
      return;
    state.players[0].id = hostId;
    state.players[1].id = guestId;
  }

  public resetGameState(gameId: string, mode: GameMode): void {
    const ballSpeeds = {
      [GameMode.EASY]: 0.001,
      [GameMode.NORMAL]: 0.009,
      [GameMode.HARD]: 0.030
    };
    this.gameStates[gameId] = {
      players: this.initializePlayers(),
      ball: {
        xRatio: 0.5,
        yRatio: 0.5,
        radiusRatio: 0.030,
        velocityXRatio: ballSpeeds[mode],
        velocityYRatio: 0,
      },
      mode: mode,
      gameStarted: false,
      gameOver: false,
    };
  }

  private checkCollision(ball: Ball, player: Player): boolean {
    if (!player || !ball) {return ;}  
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
    const modeConfig = GAME_MODE_CONFIGS[gameState.mode] || GAME_MODE_CONFIGS[GameMode.NORMAL];
    const ball = gameState.ball;
    const players = gameState.players;
    const newXRatio = ball.xRatio + ball.velocityXRatio;
    const newYRatio = ball.yRatio + ball.velocityYRatio;
    ball.xRatio = newXRatio;
    ball.yRatio = newYRatio;
    // Limit the vertical velocity
    ball.velocityYRatio = Math.min(modeConfig.MAX_Y_VELOCITY, Math.max(-modeConfig.MAX_Y_VELOCITY, ball.velocityYRatio));
    // Ensure minimum horizontal velocity
    if (Math.abs(ball.velocityXRatio) < modeConfig.MIN_X_VELOCITY) {
      ball.velocityXRatio = (ball.velocityXRatio < 0 ? -1 : 1) * modeConfig.MIN_X_VELOCITY;
    }
    if (ball.yRatio - ball.radiusRatio < 0 || ball.yRatio + ball.radiusRatio > 1) {
      ball.velocityYRatio = -ball.velocityYRatio;
      this.normalizeVelocity(ball, gameState.mode);
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
      this.normalizeVelocity(ball, gameState.mode);
    }
    if (this.checkCollision(ball, players[1])) {
      ball.velocityXRatio = -Math.abs(ball.velocityXRatio);
      ball.velocityYRatio += (Math.random() - 0.5) * 0.01;
      this.normalizeVelocity(ball, gameState.mode);
    }
  }

  public normalizeVelocity(ball: Ball, mode: GameMode): void {
    const desiredMagnitude = BALL_SPEEDS[mode];
    const magnitude = Math.sqrt(Math.pow(ball.velocityXRatio, 2) + Math.pow(ball.velocityYRatio, 2));
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
        const newY = Number((player.paddleYRatio + MOVE_DISTANCES[direction]).toFixed(4));
        if (newY - player.paddleHeightRatio / 2 < 0) {
          player.paddleYRatio = player.paddleHeightRatio / 2;
        } else if (newY + player.paddleHeightRatio / 2 > 1.01) {
          player.paddleYRatio = 1 - player.paddleHeightRatio / 2;
        } else {
          player.paddleYRatio = newY;
        }
        // console.log(`Updated Y position for ${playerId}: ${player.paddleYRatio}`);
        console.log(this.gameStates[gameId].players.find(el => el.id === playerId).paddleYRatio)
        console.log(player.paddleYRatio);
      }
    }

  private resetBall(gameId: string): void {
    const gameState = this.gameStates[gameId];
    const ball = gameState.ball;
    ball.xRatio = 0.5;
    ball.yRatio = 0.5;
    ball.velocityXRatio = (Math.random() < 0.5 ? -1 : 1) * BALL_SPEEDS[gameState.mode];
    ball.velocityYRatio = 0; // The ball starts with no vertical movement
  }

  getCurrentState(gameId: string): GameState {
    return this.gameStates[gameId];
  }

  private declareWinner(gameId: string, playerId: string): void {
    const state = this.gameStates[gameId];
    this.prisma.games.update({
      where: {
        id: gameId
      },
      data: {
        status: 'FINISHED',
        loserScore: Math.min(state.players[0].score, state.players[1].score),
        winnerScore: Math.max(state.players[0].score, state.players[1].score),
      }
    }).then(() => {
        console.log('game status changed');
      })
    console.log(`Player ${playerId} is the winner!`);
    this.gameStates[gameId].gameOver = true;
    // Stop the ball and paddles from moving
    this.gameStates[gameId].ball.velocityXRatio = 0;
    this.gameStates[gameId].ball.velocityYRatio = 0;
    this.gameStates[gameId].players.forEach(player => {
      player.paddleYRatio = 0.5;
    });
  }

  //add a player to the queue:
  private playerQueues: Record<GameMode, string[]> = {
    [GameMode.EASY]: [],
    [GameMode.NORMAL]: [],
    [GameMode.HARD]: []
  };

  joinQueue(playerId: string, mode: GameMode): void {
    if (!this.isPlayerInQueue(playerId)) {
      mode = mode || GameMode.NORMAL;
      if (this.isValidMode(mode)) {
        console.log(`joined queue in: ${mode}`);
        this.playerQueues[mode].push(playerId);
      } else {
        console.error(`Invalid mode: ${mode}.`);
      }
    } else {
      console.error(`Player already in queue.`);
    }
  }

  isValidMode(mode: GameMode): boolean {
      return this.playerQueues.hasOwnProperty(mode);
  }

  // check the number of players in the queue:
  getQueueLength(mode: GameMode): number {
    return this.playerQueues[mode].length;
  }  
  
  //get players from the queue for a match:
  getPlayersForMatch(mode: GameMode): any {
    if (this.playerQueues[mode].length >= 2) {
      const player1 = this.playerQueues[mode].shift();
      const player2 = this.playerQueues[mode].shift();
      return [player1!, player2!];
    }
    return null;
  }  

  //remove player from the queue (in case they disconnect before the match starts) 
  removeFromQueue(playerId: string, mode: GameMode): void {
    if (!this.playerQueues[mode]) {
        console.error('Invalid mode provided:', mode);
        return;
    }
    const index = this.playerQueues[mode].indexOf(playerId);
    if (index !== -1) {
        this.playerQueues[mode].splice(index, 1);
    }
  }

  // Check if a player is in the queue:
  isPlayerInQueue(playerId: string): boolean {
    return Object.values(this.playerQueues).some(queue => queue.includes(playerId));
  }

  // db logic
  async createGame(hostId: string, guestId: string, mode: GameMode) {
    const game = this.prisma.games.create({
      data: {
        hostId: hostId,
        guestId: guestId,
        mode,
      }
    });
    return game;
  }

  // getting created game for two users
  async getGame(hostId: string, guestId: string, status: GameStatus) {
    const game = await this.prisma.games.findFirst({
      where: {
        hostId,
        guestId,
        status
      }
    });
    return game;
  }

  async getMyGame(user: AuthenticatedUser, type: GameStatus) {
    const game = await this.prisma.games.findFirst({
      where: {
        OR: [
          {guestId: user.sub},
          {hostId: user.sub}
        ],
        status: type
      },
      include: {
        host: true,
        guest: true
      }
    });
    return game;
  }
}
