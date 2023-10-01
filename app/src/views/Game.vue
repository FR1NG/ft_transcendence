<template>
  <game-result v-if="gameResult.length !== 0"></game-result>
  <div  v-else class="container">
    <div v-if="waitingForOpponent" class="waiting">Waiting for another player...</div>
    <button v-if="showStartButton" id="startButton" @click="startGame">Start</button>
    <p v-if=" showStartButton" class="game-guide">Use W and S to move the paddle up and down.</p>
    <canvas v-if="showGameElements && !gameOver" class="gameCanvas" ref="gameCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, watch, onUnmounted, toRefs, reactive} from 'vue';
import { GameState } from '@/types/game';
import { useGameStore } from '@/store/game';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { bootstrapGameSocket } from '@/composables/game.socket';
import { useSocketStore } from '@/store/socket';
import GameResult from './GameResult.vue'
import { onBeforeRouteLeave } from 'vue-router';
import { useAuthStore } from '@/store/auth';

export default {
  name: 'Game',
  components: {GameResult},
  setup() {
    const gameStore = useGameStore();
    const socketStore = useSocketStore();
    const { gameSocket } = storeToRefs(socketStore);
    const { gameResult } = storeToRefs(gameStore);
    const authStore = useAuthStore();
    const { me } = storeToRefs(authStore);
    // initializign game socket
    bootstrapGameSocket();

    // clealing store before route leave
    onBeforeRouteLeave(() => {
      gameStore.reset();
    })
    
    const ASPECT_RATIO = 16 / 9;
    const canvasWidthPercentage = 0.8;  // 80% of window's width
    const canvasWidth = ref(window.innerWidth * canvasWidthPercentage);
    const canvasHeight = ref((canvasWidth.value / ASPECT_RATIO)* canvasWidthPercentage);
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

    gameSocket.value?.emit('request-info');

    gameSocket.value?.on('matchFound', (data: any) => {
      console.log('Received matchFound event with data:', data);
      waitingForOpponent.value = false;
      showStartButton.value = true;
      playerId.value = data.role;
      gameId.value = data.gameId;
    });
  
    // Listen for gameStarted event from the server
    gameSocket.value?.on('gameStarted', () => {
      console.log('Received gameStarted event.');
      showGameElements.value = true;
      showStartButton.value = false;
      waitingForOpponent.value = false;
    });

    gameSocket.value?.on('announceWinner', function(winnerId) {
      gameOver.value = true;
      winner.value = winnerId;
    });

    gameSocket.value?.on('hideStartButton', () => {
      showStartButton.value = false;
    });

    gameSocket.value?.on('waitingForOtherPlayer', () => {
      waitingForOpponent.value = true;
      showStartButton.value = false;
    });

    // Define the startGame function to emit the startGame event to the server
    const startGame = () => {
      if ( playerId.value) {
        gameSocket.value?.emit('startGame');
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
      event.preventDefault();
      if (event.code === 'KeyW') {
        keyStates.w = true;
      } else if (event.code === 'KeyS') {
          keyStates.s = true;
      }
    };

    // Handle the "KeyW" and "KeyS" key-up events
    const handleKeyUpEvent = (event: KeyboardEvent) => {
      event.preventDefault();
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
          gameSocket.value?.emit('move', { player: playerId.value, direction , scaleFactor: scaleFactor.value, gameId: gameId.value });
        }
      }
      requestAnimationFrame(gameLoop);
    };

    // Adjust canvas dimensions on window resize
    const resizeHandler = () => {
      canvasWidth.value = window.innerWidth * canvasWidthPercentage;
      canvasHeight.value = (window.innerWidth / ASPECT_RATIO)* canvasWidthPercentage;
      gameSocket.value?.emit('canvasDimensions', {
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
      } else 
      {
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
      } else 
      {
        ctx.fillStyle = currentTheme.value.backgroundColor;
        ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);
      }
      let leftPlayer, rightPlayer;
      const mirrored = me.value.id === gameState.players[1].id;
      if (mirrored) {
        leftPlayer = gameState.players[1];
        rightPlayer = gameState.players[0];
      } else {
        leftPlayer = gameState.players[0];
        rightPlayer = gameState.players[1];
      }

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
      const ballXRatio = mirrored ? 1 - gameState.ball.xRatio : gameState.ball.xRatio;
      drawBall(
        ctx,
        ballXRatio,
        gameState.ball.yRatio,
        gameState.ball.radiusRatio
      );
      // If mirrored, swap the scores
      drawScore(ctx, mirrored ? rightPlayer.score : leftPlayer.score, mirrored ? leftPlayer.score : rightPlayer.score, canvasWidth.value);
    };

    // Watch for canvas dimension changes and notify the server
    watch([canvasWidth, canvasHeight], ([width, height]) => {
      gameSocket.value?.emit('canvasDimensions', { width, height });
    });

    // Debounce the resize handler for performance
    let debounceTimeout:any;
    const debouncedResizeHandler = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(resizeHandler, 100);
    };

    // Initialization: set up listeners and join the game
    const initializeGameListeners = () => {
      gameSocket.value?.on('state', renderGameState);
      window.addEventListener('resize', debouncedResizeHandler);
      window.addEventListener('keydown', handleKeyDownEvent);
      window.addEventListener('keyup', handleKeyUpEvent);
      requestAnimationFrame(gameLoop);
    }

    // Method to cleanup game listeners
    const cleanupGameListeners = () => {
      gameSocket.value?.off('showStartButton');
      gameSocket.value?.off('state', renderGameState);
      window.removeEventListener('resize', debouncedResizeHandler);
      window.removeEventListener('keydown', handleKeyDownEvent);
      window.removeEventListener('keyup', handleKeyUpEvent);
    }

    onMounted(initializeGameListeners);
    onUnmounted(cleanupGameListeners);

    let connectionAttempts = 0;
    gameSocket.value?.on('connect', () => {
      console.log('Connected to the server');
      connectionAttempts++;
      console.log(`Connection attempt number: ${connectionAttempts}`);
    });

    gameSocket.value?.on('disconnect', () => {
      console.log('disconnected from the server');
      if(showGameElements.value && !gameOver.value) {
        gameOver.value = true;
        winner.value = playerId.value === 'Host' ? 'Guest' : 'Host';
      } else {
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
      gameStore,
      gameResult,
    };
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.cdnfonts.com/css/public-pixel');
// Game Elements
.gameCanvas {
  padding: 0;
  display: block;
  color: rgb(var(--v-theme-colorTwo));
  border: 1px solid rgb(var(--v-theme-colorTwo));
  box-sizing: border-box;
  box-shadow:
    0 0 2.5px rgb(var(--v-theme-colorTwo)),
    0 0 5px rgb(var(--v-theme-colorTwo)),
    0 0 7.5px rgb(var(--v-theme-colorThree)),
    0 0 10px rgb(var(--v-theme-colorThree)),
    0 0 12.5px rgb(var(--v-theme-colorThree)),
    0 0 15px rgb(var(--v-theme-colorThree));
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

.waiting{
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

#startButton, #restartButton {
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

  box-shadow:
    0 0 5px rgb(var(--v-theme-colorTwo)),
    0 0 10px rgb(var(--v-theme-colorTwo)),
    0 0 15px rgb(var(--v-theme-colorThree)),
    0 0 20px rgb(var(--v-theme-colorThree)),
    0 0 25px rgb(var(--v-theme-colorThree)),
    0 0 30px rgb(var(--v-theme-colorThree));
}

#startButton:active {
  transform: scale(0.9);
  box-shadow: 0 2px 5px rgb(var(--v-theme-colorThree));
}

#startButton {
  display: inline-block;
  position: absolute;
  justify-content: center;
  font-size: 16px;

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
  &:active {
    box-shadow: 0 0 5px rgb(var(--v-theme-colorThree));
  }
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
  &:active {
    box-shadow: 0 0 5px rgb(var(--v-theme-colorThree));
    }
  &:disabled {
    box-shadow:
      0 0 5px rgb(var(--v-theme-colorFoure)),
      0 0 10px rgb(var(--v-theme-colorFoure));
    cursor: not-allowed;
    color: rgb(var(--v-theme-colorFoure));
  }
}
</style>
