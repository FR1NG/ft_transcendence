<template>
  <game-result v-if="gameResult.length !== 0"></game-result>
  <div  v-else class="container">
    <GameWaiting v-if="waitingForOpponent"/>
    <div v-if="gameState" class="avatar-section">
      <div class="mavatar">
        <img :src="me.avatar" alt="my avatar">
        <div class="uname">{{ me.username }}</div>
      </div>
        <div class="vs">vs</div>
      <div class="oavatar">
        <div class="uname">{{ opponent?.username }}</div>
        <img :src="opponent?.avatar" alt="opp avatar">
      </div>
    </div>
    <button v-if="showStartButton" id="startButton" @click="startGame">Start</button>
    <p v-if=" showStartButton" class="game-guide">Use W and S to move the paddle up and down (You're left).</p>
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
import GameWaiting from '@/components/GameWaiting.vue'

type Opponent = {
  id: string
  username: string
  avatar: string
}

export default {
  name: 'Game',
  components: { GameResult, GameWaiting },
  setup() {
    const gameStore = useGameStore();
    const socketStore = useSocketStore();
    const { gameSocket } = storeToRefs(socketStore);
    const { gameResult, rematch } = storeToRefs(gameStore);
    const authStore = useAuthStore();
    const { me } = storeToRefs(authStore);
    const opponent = ref<Opponent>();
    // initializign game socket
    bootstrapGameSocket();

    // clealing store before route leave
    onBeforeRouteLeave(() => {
      gameStore.reset();
      gameSocket.value?.emit('game-leave');
    })

    const gameState = ref<GameState | null>(null);
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

    // Listening for game state updates
        gameSocket.value?.on('state', (newState: GameState) => {
          gameState.value = newState;
        });

    gameSocket.value?.emit('request-info');

    gameSocket.value?.on('matchFound', (data: any) => {
      waitingForOpponent.value = false;
      showStartButton.value = true;
      playerId.value = data.role;
      gameId.value = data.gameId;
      opponent.value = data.opponent
    });

    // Listen for gameStarted event from the server
    gameSocket.value?.on('gameStarted', () => {
      showGameElements.value = true;
      showStartButton.value = false;
      waitingForOpponent.value = false;
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
      canvasHeight.value = (canvasWidth.value / ASPECT_RATIO)* canvasWidthPercentage;
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

    let loadedImages: { [key: string]: HTMLImageElement } = {};

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
          ctx.shadowBlur = 5;
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
      ctx.shadowBlur = 5;
      ctx.fillRect(x, y - (height / 2), width, height);
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    };

    // Display the score on the canvas
    const drawScore = (ctx: CanvasRenderingContext2D, scoreLeft: number, scoreRight: number, canvasWidth: number, mirrored: boolean) => {
      ctx.font = '35px Arial';
      ctx.fillStyle = currentTheme.value.scoreColor;

      if (mirrored) {
          ctx.fillText(scoreRight.toString(), canvasWidth / 4, 50);
          ctx.fillText(scoreLeft.toString(), (3 * canvasWidth) / 4, 50);
      } else {
          ctx.fillText(scoreLeft.toString(), canvasWidth / 4, 50);
          ctx.fillText(scoreRight.toString(), (3 * canvasWidth) / 4, 50);
      }
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
      const LpaddleXRatio = mirrored ? 1 - leftPlayer.xRatio - leftPlayer.paddleWidthRatio : leftPlayer.xRatio;
      drawPaddle(
        ctx,
        // leftPlayer.xRatio,
        LpaddleXRatio,
        leftPlayer.paddleYRatio,
        leftPlayer.paddleWidthRatio,
        leftPlayer.paddleHeightRatio
      );
      const RpaddleXRatio = mirrored ? 1 - rightPlayer.xRatio - rightPlayer.paddleWidthRatio : rightPlayer.xRatio;
      drawPaddle(
        ctx,
        RpaddleXRatio,
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
      drawScore(ctx, mirrored ? rightPlayer.score : leftPlayer.score, mirrored ? leftPlayer.score : rightPlayer.score, canvasWidth.value, mirrored);
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

    const preloadImages = () => {
      const theme = currentTheme.value;
      // Preload background image
      if (theme.backgroundImage && !loadedImages[theme.backgroundImage]) {
        const bgImg = new Image();
        bgImg.src = theme.backgroundImage;
        bgImg.onload = () => {
            loadedImages[theme.backgroundImage] = bgImg;
        };
      }
      if (theme.ballImage && !loadedImages[theme.ballImage]) {
        const ballImg = new Image();
        ballImg.src = theme.ballImage;
        ballImg.onload = () => {
            loadedImages[theme.ballImage] = ballImg;
        };
      }
    }

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

    onMounted(() => {
        preloadImages();
        initializeGameListeners();
    });
    onUnmounted(cleanupGameListeners);

    let connectionAttempts = 0;
    gameSocket.value?.on('connect', () => {
      connectionAttempts++;
    });

    gameSocket.value?.on('disconnect', () => {
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
      me,
      gameState,
      opponent
    };
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.cdnfonts.com/css/public-pixel');
// Game Elements
.gameCanvas {
  padding: 0;
  width: 90%;
  max-width: 1500px;
  display: block;
  color: rgb(var(--v-theme-colorTwo));
  border: 1px solid rgb(var(--v-theme-colorTwo));
  box-sizing: border-box;
}

.container {
  background-image: url("/images/background.jpg");
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 93.2vh;
  width: 100vw;
  overflow: hidden !important;
}

body, html {
  overflow: hidden !important;
  color: rgb(var(--v-theme-colorOne));
}

#startButton {
  position: relative;
  font-size: 30px;
  padding: 10px 32px;
  background: linear-gradient(to right, rgb(160, 157, 241), rgb(255, 0, 123));
  color: white;
  border-radius: 8px;
  cursor: pointer;
  border-radius: 5px;
  overflow: hidden;
}

#startButton:active {
  color: black;
  box-shadow: inset -5px -5px 2px rgba(255, 255, 255, 0.4),
              inset 5px 5px 2px rgba(0, 0, 0, 0.3);
}

#startButton::before {
  content: '';
  position: absolute;
  height: 120px;
  width: 20px;
  top: -40px;
  background-color: white;
  transform: rotate(-30deg) translateX(-70px);
  filter: blur(1px);
  transition: 0.8s;
  opacity: 0.8;
}

#startButton:hover:before {
  transform: translate(150px) rotate(-30deg);
}

.game-guide {
  font-size: 15px;
  color: white;
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


.avatar-section {
  display: flex;
  width: 90%;
  justify-content: space-between;
  align-items: center;
  color: rgb(var(--v-theme-colorTwo));
  font-size: 2vw;
  margin-bottom: 1rem;

  .vs {
    font-size: 5vw;
    width: 10%;
    display: flex;
    justify-content: center;
  }
  .mavatar {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
    width: 37%;
  }
  .oavatar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
    width: 37%;
  }
  img {
    width: 50px;  // Adjust based on your preference
    height: 50px; // Adjust based on your preference
    border-radius: 50%;
    border: 2px solid rgb(var(--v-theme-colorTwo));
  }
}


</style>
