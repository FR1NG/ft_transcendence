<template>
  <div class="container">
    <div v-if="waitingForOpponent">Waiting for another player...</div>
    <button v-if="showStartButton" id="startButton" @click="startGame">Start</button>
    <canvas v-if="showGameElements && !gameOver" class="gameCanvas" ref="gameCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    <div v-if="gameOver">
      <h1>{{ winner }} is the winner!</h1>
      <button @click="restartGame">Restart Game</button>
    </div>
  </div>
</template>

<script lang="ts">

import { ref, onMounted, watch, onUnmounted, toRefs, reactive} from 'vue';
import { io } from 'socket.io-client';
import { GameState } from '@/types/game';

export default {
  name: 'PongGame',
  setup() {
    const socket = io('http://localhost:4443', {
      // transports: ['websocket'],
      // upgrade: false,
      // reconnection: true,
      // reconnectionAttempts: 5,
      // reconnectionDelay: 1000,

    });

    const ASPECT_RATIO = 16 / 9;
    const canvasWidth = ref(window.innerWidth);
    const canvasHeight = ref(window.innerWidth / ASPECT_RATIO);
    const gameCanvas = ref(null);
    const playerId = ref(null);
    const scaleFactor = ref(1); // Initialize scale factor
    const lastFrameTime = ref(Date.now());
    const showStartButton = ref(false);
    const showGameElements = ref(false);
    const gameOver = ref(false);  // Flag to check if the game is over
    const winner = ref(null);     // To hold the winner's ID
    const waitingForOpponent = ref(true);
    const gameId = ref(null);
    
  const restartGame = () => {
    socket.emit('restartGame');
  };

  socket.on('restartGame', () => {
    console.log('Received gameReset event.');
    showGameElements.value = true;
    gameOver.value = false;
    winner.value = null;
    // You may also want to reset other game state variables here if needed
  });

    socket.on('matchFound', (data: any) => {
      console.log('Match found. Waiting for both players to start the game.');
      waitingForOpponent.value = false;
      showStartButton.value = true;
      playerId.value = data.role;
      gameId.value = data.gameId;
    });

    // Listen for gameStarted event from the server
    socket.on('gameStarted', () => {
      console.log('Received gameStarted event.');
      showGameElements.value = true;
      showStartButton.value = false;
      waitingForOpponent.value = false;
    });

    socket.on('announceWinner', function(winnerId) {
      gameOver.value = true;
      winner.value = winnerId;
      alert(`${winnerId} is the winner!`);
    });

    socket.on('waitingForOtherPlayer', () => {
      waitingForOpponent.value = true;
      showStartButton.value = false;  // Hide the start button while waiting
    });

    // Define the startGame function to emit the startGame event to the server
    const startGame = () => {
      if ( playerId.value) {
        socket.emit('startGame');
      }
    };

    const keyStates = reactive({
      w: false,
      s: false
    });

    watch([canvasWidth], ([width]) => {
      scaleFactor.value = width / 800;
    });

    // Listen for player assignments from the server
    const handleKeyDownEvent = (event: KeyboardEvent) => {
      if (event.code === 'KeyW') {
        keyStates.w = true;
      } else if (event.code === 'KeyS') {
          keyStates.s = true;
      }
    };

    // Handle the "KeyW" and "KeyS" key-up events
    const handleKeyUpEvent = (event: KeyboardEvent) => {
      if (event.code === 'KeyW') {
        keyStates.w = false;
      } else if (event.code === 'KeyS') {
        keyStates.s = false;
      }
    };
    
    const gameLoop = () => {
      if (gameOver.value) return;  // This will prevent the loop from continuing if the game is over
      const currentTime = Date.now();
      const deltaTime = currentTime - lastFrameTime.value;
      if (deltaTime >= (1000 / 60)) {
        lastFrameTime.value = currentTime;
        const direction = keyStates.w ? 1 : keyStates.s ? 2 : 0;
        if (playerId.value && direction !== 0) {
          socket.emit('move', { player: playerId.value, direction , scaleFactor: scaleFactor.value, gameId: gameId.value });
        }
      }
      requestAnimationFrame(gameLoop);
    };

    // Adjust canvas dimensions on window resize
    const resizeHandler = () => {
      canvasWidth.value = window.innerWidth;
      canvasHeight.value = window.innerWidth / ASPECT_RATIO;
      socket.emit('canvasDimensions', {
        width: canvasWidth.value,
        height: canvasHeight.value,
      });
    };

    // Draw a ball on the canvas
    const drawBall = (ctx: CanvasRenderingContext2D, xRatio: number, yRatio: number, radiusRatio: number) => {
      const x = xRatio * canvasWidth.value;
      const y = yRatio * canvasHeight.value;
      const radius = radiusRatio * canvasWidth.value;  // Assuming width and height maintain an aspect ratio
      ctx.fillStyle = '#0C134F';
      ctx.shadowColor = '#ff91f2';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
      // Reset shadow properties after drawing to avoid unintended side-effects on other elements
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    };

    const drawPaddle = (ctx: CanvasRenderingContext2D, xRatio: number, yRatio: number, widthRatio: number, heightRatio: number) => {
      const x = xRatio * canvasWidth.value;
      const y = yRatio * canvasHeight.value;
      const width = widthRatio * canvasWidth.value;
      const height = heightRatio * canvasHeight.value;
      ctx.fillStyle = '#0C134F';
      ctx.shadowColor = '#ff91f2';
      ctx.shadowBlur = 20;
      ctx.fillRect(x, y - (height / 2), width, height);
      // Reset shadow properties after drawing to avoid unintended side-effects on other elements
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    };

    // Display the score on the canvas
    const drawScore = (ctx: CanvasRenderingContext2D, scoreLeft: number, scoreRight: number, canvasWidth: number) => {
      ctx.font = '40px Arial';
      ctx.fillStyle = '#5C469C';
      ctx.fillText(scoreLeft.toString(), canvasWidth / 4, 50);
      ctx.fillText(scoreRight.toString(), (3 * canvasWidth) / 4, 50);
    };

    // Validate the structure and values of the game state
    const isValidGameState = (gameState: GameState) => {
      return gameState &&
            gameState.ball &&
            !isNaN(gameState.ball.xRatio) &&
            !isNaN(gameState.ball.yRatio) &&
            gameState.players &&
            gameState.players.length >= 2 &&
            !isNaN(gameState.players[0].paddleYRatio) &&
            !isNaN(gameState.players[1].paddleYRatio);
    };

    // Render the current game state onto the canvas
    const renderGameState = (gameState: GameState) => {
      if (!gameCanvas.value || !isValidGameState(gameState)) return;
      const ctx = gameCanvas.value.getContext('2d');
      ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
      const leftPlayer = gameState.players[0];
      const rightPlayer = gameState.players[1];

      drawPaddle(
        ctx, 
        leftPlayer.xRatio, 
        leftPlayer.paddleYRatio, 
        leftPlayer.paddleWidthRatio, 
        leftPlayer.paddleHeightRatio
      );
      drawPaddle(
        ctx,
        rightPlayer.xRatio,
        rightPlayer.paddleYRatio,
        rightPlayer.paddleWidthRatio,
        rightPlayer.paddleHeightRatio
      );
      drawBall(
        ctx, 
        gameState.ball.xRatio, 
        gameState.ball.yRatio, 
        gameState.ball.radiusRatio
      );
      // Assume the drawScore function remains the same for now
      drawScore(ctx, leftPlayer.score, rightPlayer.score, canvasWidth.value);
    };

    // Watch for canvas dimension changes and notify the server
    watch([canvasWidth, canvasHeight], ([width, height]) => {
      socket.emit('canvasDimensions', { width, height });
    });

    // Debounce the resize handler for performance
    let debounceTimeout;
    const debouncedResizeHandler = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(resizeHandler, 100);
    };

    // Initialization: set up listeners and join the game
    onMounted(() => {
      socket.on('state', renderGameState);
      socket.emit('joinGame');
      window.addEventListener('resize', debouncedResizeHandler);
      window.addEventListener('keydown', handleKeyDownEvent);
      window.addEventListener('keyup', handleKeyUpEvent);
      // Start the game loop
      requestAnimationFrame(gameLoop);
    });

    // Cleanup: remove listeners when the component is destroyed
    onUnmounted(() => {
      socket.off('showStartButton');
      socket.off('state', renderGameState);
      window.removeEventListener('resize', debouncedResizeHandler);
      window.removeEventListener('keydown', handleKeyDownEvent);
      window.removeEventListener('keyup', handleKeyUpEvent);
    });

    // Log when successfully connected to the server
    socket.on('connect', () => {
      console.log('Connected to the server');
      socket.emit('joinGame');
    });

    socket.on('disconnect', () => {
      console.log('disconnected from the server');
      // Resetting game state
      showStartButton.value = true;
      showGameElements.value = false;
      gameOver.value = false;
      winner.value = null;
      waitingForOpponent.value = false;
    });

    return {
      ...toRefs(keyStates),
      canvasWidth,
      canvasHeight,
      gameCanvas,
      showStartButton,
      startGame,
      restartGame,
      showGameElements,
      gameOver,
      winner,
      waitingForOpponent
    };
  }
}
</script>

<style lang="scss">
@import url('https://fonts.cdnfonts.com/css/public-pixel');
// Game Elements
.gameCanvas {
  padding: 0;
  // margin-right: 20px;
  display: block;
  background-color: #debdff;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

body, html {
  overflow: hidden !important; /* Hide scrollbars */
}

// Base Button Style
#startButton {
  display: inline-block;
  position: absolute;
  justify-content: center;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #5C469C;
  color: white;
  font-size: 16px;
  font-family: 'Public Pixel', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s ease;

  // Hover State
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 15px rgba(212, 173, 252, 0.4);
  }

  // Active State (when button is clicked)
  &:active {
    background-color: darken(#5C469C, 20%);
  }

  // Disabled State
  &:disabled {
    background-color: #D4ADFC;
    cursor: not-allowed;
  }
}

h1 {
    font-family: 'Public Pixel', sans-serif; 
    font-size: 2.5em;
    color: #0C134F;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    text-align: center;
    margin-top: 50px;
    border-bottom: 2px solid #5C469C; 
    padding-bottom: 10px;
    letter-spacing: 1.5px;
    transition: color 0.3s ease;
}

h1:hover {
    color: #1D267D;
}

</style>