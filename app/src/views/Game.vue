<template>
  <div class="container">
    <div v-if="waitingForOpponent" class="waiting">Waiting for another player...</div>
    <button v-if="showStartButton" id="startButton" @click="startGame">Start</button>
    <p v-if=" showStartButton" class="game-guide">Use W and S to move the paddle up and down.</p>
    <canvas v-if="showGameElements && !gameOver" class="gameCanvas" ref="gameCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    <div v-if="gameOver" class="game-over-container">
      <h1>{{ winner }} is the winner!</h1>
      <button @click="restartGame" id="restartButton">Restart Game</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, watch, onUnmounted, toRefs, reactive} from 'vue';
import { io } from 'socket.io-client';
import { GameState } from '@/types/game';
import { useGameStore } from '@/store/game';
import { computed } from 'vue';

export default {
  name: 'Game',
  setup() {
    const gameStore = useGameStore();
    const socket = io('http://localhost:4443', {query: {
    mode: gameStore.selectedMode // Assuming `selectedMode` is your mode in the store
  }});
    const ASPECT_RATIO = 16 / 9;
    const canvasWidth = ref(window.innerWidth);
    const canvasHeight = ref(window.innerWidth / ASPECT_RATIO);
    const gameCanvas = ref(null);
    const playerId = ref(null);
    const scaleFactor = ref(1);
    const lastFrameTime = ref(Date.now());
    const showStartButton = ref(false);
    const showGameElements = ref(false);
    const gameOver = ref(false);
    const winner = ref<null | "Host" | "Guest">(null);
    const waitingForOpponent = ref(true);
    const gameId = ref(null);
    const currentTheme = computed(() => gameStore.currentTheme);

    let loadedImages: { [key: string]: HTMLImageElement } = {};

    const restartGame = () => {
      gameStore.selectedMode = 'NORMAL';
      gameStore.modeSelected = false;
      socket.emit('joinQueueAgain');
      cleanupGameListeners();
      gameOver.value = false;
      winner.value = null;
      waitingForOpponent.value = true;
      showGameElements.value = false;
      playerId.value = null;
      gameId.value = null;
      initializeGameListeners();
    };

    socket.on('matchFound', (data: any) => {
      console.log('Received matchFound event with data:', data);
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

    socket.on('hideStartButton', () => {
      showStartButton.value = false;
    });

    socket.on('waitingForOtherPlayer', () => {
      waitingForOpponent.value = true;
      showStartButton.value = false;
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
      if (gameOver.value) return;
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

    // Draws a dotted line in the middle of the canvas
    const drawCenterLine = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
      const segmentLength = 10;
      const gapLength = 10;
      ctx.strokeStyle = currentTheme.value.lineColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for(let y = 0; y < canvasHeight; y += segmentLength + gapLength) {
        ctx.moveTo(canvasWidth / 2, y);
        ctx.lineTo(canvasWidth / 2, y + segmentLength);
      }
      ctx.stroke();
    };

    const drawBall = (ctx: CanvasRenderingContext2D, xRatio: number, yRatio: number, radiusRatio: number) => {
      const x = xRatio * canvasWidth.value;
      const y = yRatio * canvasHeight.value;
      const radius = radiusRatio * canvasWidth.value;
      if (currentTheme.value.ballImage) {
        if (!loadedImages[currentTheme.value.ballImage]) {
          const img = new Image();
          img.src = currentTheme.value.ballImage;
          img.onload = () => {
            loadedImages[currentTheme.value.ballImage] = img;
            ctx.drawImage(img, x - radius, y - radius, 2 * radius, 2 * radius);
          };
        } else {
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 20;
          ctx.drawImage(loadedImages[currentTheme.value.ballImage], x - radius, y - radius, 2 * radius, 2 * radius);
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }
      } else {
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = currentTheme.value.ballColor;
        ctx.fill();
        ctx.closePath();
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }
    };

    const drawPaddle = (ctx: CanvasRenderingContext2D, xRatio: number, yRatio: number, widthRatio: number, heightRatio: number) => {
      const x = xRatio * canvasWidth.value;
      const y = yRatio * canvasHeight.value;
      const width = widthRatio * canvasWidth.value;
      const height = heightRatio * canvasHeight.value;
      ctx.fillStyle = currentTheme.value.paddleColor;
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 20;
      ctx.fillRect(x, y - (height / 2), width, height);
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    };

    // Display the score on the canvas
    const drawScore = (ctx: CanvasRenderingContext2D, scoreLeft: number, scoreRight: number, canvasWidth: number) => {
      ctx.font = '35px Arial'; 
      ctx.fillStyle = currentTheme.value.scoreColor;
      ctx.fillText(scoreLeft.toString(), canvasWidth / 4, 50);
      ctx.fillText(scoreRight.toString(), (3 * canvasWidth) / 4, 50);
    };

    // Render the current game state onto the canvas
    const renderGameState = (gameState: GameState) => {
      if (!gameCanvas.value || !isValidGameState(gameState)) return;
      const ctx = gameCanvas.value.getContext('2d');
      if (currentTheme.value.backgroundImage) {
        if (!loadedImages[currentTheme.value.backgroundImage]) {
          const img = new Image();
          img.src = currentTheme.value.backgroundImage;
          img.onload = () => {
            loadedImages[currentTheme.value.backgroundImage] = img;
            console.log("Image loaded: " + img.src)
            ctx.drawImage(img, 0, 0, canvasWidth.value, canvasHeight.value);
          };
        } else {
          ctx.drawImage(loadedImages[currentTheme.value.backgroundImage], 0, 0, canvasWidth.value, canvasHeight.value);
        }
      } else {
        ctx.fillStyle = currentTheme.value.backgroundColor;
        ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);
      }
      const leftPlayer = gameState.players[0];
      const rightPlayer = gameState.players[1];

      drawCenterLine(ctx, canvasWidth.value, canvasHeight.value);
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
      drawScore(ctx, leftPlayer.score, rightPlayer.score, canvasWidth.value);
    };

    // Watch for canvas dimension changes and notify the server
    watch([canvasWidth, canvasHeight], ([width, height]) => {
      socket.emit('canvasDimensions', { width, height });
    });

    // Debounce the resize handler for performance
    let debounceTimeout:any;
    const debouncedResizeHandler = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(resizeHandler, 100);
    };

    // Initialization: set up listeners and join the game
    const initializeGameListeners = () => {
      socket.on('state', renderGameState);
      socket.emit('joinGame');
      window.addEventListener('resize', debouncedResizeHandler);
      window.addEventListener('keydown', handleKeyDownEvent);
      window.addEventListener('keyup', handleKeyUpEvent);
      requestAnimationFrame(gameLoop);
    }

    // Method to cleanup game listeners
    const cleanupGameListeners = () => {
      socket.off('showStartButton');
      socket.off('state', renderGameState);
      window.removeEventListener('resize', debouncedResizeHandler);
      window.removeEventListener('keydown', handleKeyDownEvent);
      window.removeEventListener('keyup', handleKeyUpEvent);
    }

    onMounted(initializeGameListeners);
    onUnmounted(cleanupGameListeners);

    socket.on('connect', () => {
      console.log('Connected to the server');
      console.log('where u at', gameStore);
      socket.emit('joinGame');
    });

    socket.on('disconnect', () => {
      console.log('disconnected from the server');
      // Check if the game had actually started
      if(showGameElements.value && !gameOver.value) {
        gameOver.value = true;
        winner.value = playerId.value === 'Host' ? 'Guest' : 'Host';
      } else {
        // If game hadn't started, just reset state
        showStartButton.value = true;
        showGameElements.value = false;
        gameOver.value = false;
        winner.value = null;
        waitingForOpponent.value = false;
      }
    });

    return {
      ...toRefs(keyStates),
      canvasWidth,
      canvasHeight,
      gameCanvas,
      showStartButton,
      startGame,
      showGameElements,
      gameOver,
      winner,
      waitingForOpponent,
      restartGame,
      gameStore,
      // themeSelected,
      // modeSelected,
      // setMode,
      // setTheme,
    };
  }
}
</script>

<style lang="scss">
@import url('https://fonts.cdnfonts.com/css/public-pixel');
// Game Elements
.gameCanvas {
  padding: 0;
  display: block;
  color: rgb(var(--v-theme-colorTwo));
}

.container {
  background-color: rgb(var(--v-theme-colorOne));
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;     
  height: 100vh;
  width: 100vw; 
  overflow: hidden !important;          
}

.waiting, .theme-selector, .mode-selector {
  position: absolute;
  z-index: 1;
  display: flex;           
  flex-direction: column;  
  justify-content: center;
  align-items: center;    
  width: 100%;            
  font-family: 'Public Pixel';
  font-size: 20px;
  color: rgb(var(--v-theme-colorFoure));
}


body, html {
  overflow: hidden !important;
  color: rgb(var(--v-theme-colorOne));
}

.mode-button, #startButton, #restartButton {
  margin-top: 20px;
  font-size: 24px;
  font-family: 'Public Pixel', sans-serif;
  padding: 16px 32px;
  margin: 12px;
  border: none;
  background-color: transparent; 
  color: rgb(var(--v-theme-colorTwo));
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.3s ease;

  /* Neon effect */
  box-shadow: 
    0 0 5px rgb(var(--v-theme-colorTwo)),
    0 0 10px rgb(var(--v-theme-colorTwo)),
    0 0 15px rgb(var(--v-theme-colorThree)),
    0 0 20px rgb(var(--v-theme-colorThree)),
    0 0 25px rgb(var(--v-theme-colorThree)),
    0 0 30px rgb(var(--v-theme-colorThree));
}

.mode-button:active, #startButton:active {
  transform: scale(0.9);
  box-shadow: 0 2px 5px rgb(var(--v-theme-colorThree));
}

/* Animation on modes buttons */
.mode-button {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
      transform: scale(1);
  }
  50% {
      transform: scale(1.1);
  }
  100% {
      transform: scale(1);
  }
}

#startButton {
  display: inline-block;
  position: absolute;
  justify-content: center;
  font-size: 16px;

  /* Hover State */
  &:hover {
    transform: scale(1.1);
    box-shadow: 
      0 0 10px rgb(var(--v-theme-colorTwo)),
      0 0 20px rgb(var(--v-theme-colorTwo)),
      0 0 30px rgb(var(--v-theme-colorThree)),
      0 0 40px rgb(var(--v-theme-colorThree)),
      0 0 50px rgb(var(--v-theme-colorThree)),
      0 0 60px rgb(var(--v-theme-colorThree));
  }

  /* Active State (when button is clicked) */
  &:active {
    box-shadow: 0 0 5px rgb(var(--v-theme-colorThree));
  }

  /* Disabled State */
  &:disabled {
    box-shadow: 
      0 0 5px rgb(var(--v-theme-colorFoure)),
      0 0 10px rgb(var(--v-theme-colorFoure));
    cursor: not-allowed;
    color: rgb(var(--v-theme-colorFoure));
  }
}

.game-guide {
  font-family: 'Public Pixel', sans-serif;
  font-size: 15px;
  color: rgb(var(--v-theme-colorFoure)); 
  text-align: center;
  position: absolute;
  bottom: 70px; 
  left: 50%;
  transform: translateX(-50%);
  animation: fadeIn 1s forwards;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}
.game-over-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

h1{
  font-family: 'Public Pixel', sans-serif;
  font-size: 2.5em;
  text-shadow: 2px 2px 4px rgb(var(--v-theme-colorThree));
  text-align: center;
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  letter-spacing: 1.5px;
  animation: flicker 0.5s infinite alternate;
  transition: color 0.3s ease;
}

@keyframes flicker {
  0% {
  color: rgb(var(--v-theme-colorFoure));
  }
  100% {
  color: rgb(var(--v-theme-colorTwo));
  }
}

h1:hover {
  color: rgb(var(--v-theme-colorTwo));
}

#restartButton {
  display: inline-block;
  justify-content: center;
  font-size: 16px;

  /* Hover State */
  &:hover {
    transform: scale(1.1);
    box-shadow: 
      0 0 10px rgb(var(--v-theme-colorTwo)),
      0 0 20px rgb(var(--v-theme-colorTwo)),
      0 0 30px rgb(var(--v-theme-colorThree)),
      0 0 40px rgb(var(--v-theme-colorThree)),
      0 0 50px rgb(var(--v-theme-colorThree)),
      0 0 60px rgb(var(--v-theme-colorThree));
  }

  /* Active State (when button is clicked) */
  &:active {
    box-shadow: 0 0 5px rgb(var(--v-theme-colorThree));
    }

  /* Disabled State */
  &:disabled {
    box-shadow: 
      0 0 5px rgb(var(--v-theme-colorFoure)),
      0 0 10px rgb(var(--v-theme-colorFoure));
    cursor: not-allowed;
    color: rgb(var(--v-theme-colorFoure));
  }
}

</style>