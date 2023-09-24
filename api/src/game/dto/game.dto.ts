import { GameMode } from "@prisma/client";

export interface Player {
  id: string;
  paddleYRatio: number;
  paddleWidthRatio: number;
  paddleHeightRatio: number;
  score: number;
  xRatio: number;
}

export interface Ball {
  xRatio: number;
  yRatio: number;
  radiusRatio: number;
  velocityXRatio: number;
  velocityYRatio: number;
}

export interface GameState {
  gameStarted: boolean;
  gameOver: boolean;
  winner?: string;
  players: Player[];
  ball: Ball;
  mode: GameMode;
  canvasWidth?: number;     // Current width of the canvas
  canvasHeight?: number;    // Current height of the canvas
}



export interface Game {
  gameId: string
  role: 'Host' | 'Guest'
}
