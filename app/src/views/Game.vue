<template>
  <div class="container">
    <div class="theme-selector" v-if="!themeSelected">
      <h2>Select a Theme:</h2>
      <button @click="setTheme('classic')" class="mode-button">Classic</button>
      <button @click="setTheme('galaxy')" class="mode-button">Galaxy</button>
      <button @click="setTheme('PacMan')" class="mode-button">PacMan</button>
    </div>
    <div v-if="themeSelected && waitingForOpponent">Waiting for another player...</div>
    <button v-if="themeSelected && showStartButton" id="startButton" @click="startGame">Start</button>
    <canvas v-if="themeSelected && showGameElements && !gameOver" class="gameCanvas" ref="gameCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    <div v-if="themeSelected && gameOver">
      <h1>{{ winner }} is the winner!</h1>
      <button @click="restartGame" id="startButton">Restart Game</button>
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
    const socket = io('http://localhost:4443', {});
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
    const themeSelected = ref(false);
    type ThemeName = 'classic' | 'galaxy' | 'PacMan';
    const themes = {
      classic: {
        backgroundColor: '#FFFFFF',
        paddleColor: '#FFFFFF',
        ballColor: '#0C134F',
        lineColor: '#FFFFFF',
        scoreColor: '#FFFFFF',
        backgroundImage: '/../public/images/plain-black-background.jpg',
        ballImage: "../../public/images/pngegg.png",
      },
      galaxy: {
        backgroundColor: '#1E1E1E',
        paddleColor: '#000000',
        ballColor: '#E94560',
        lineColor: '#FFFFFF',
        scoreColor: '#FFFFFF',
        ballImage: "../../public/images/earth.png",
        backgroundImage: '/../public/images/galaxy.jpg',
      },
      PacMan: {
        backgroundColor: '#F5DEB3',
        paddleColor: '#172652',
        ballColor: '#FF4500',
        lineColor: '#FFFFFF',
        scoreColor: '#FFFFFF',
        backgroundImage: '/../public/images/PacMan.jpg',
        ballImage: "../../public/images/Original_PacMan.png",
      }
    };
    const currentTheme = ref(themes.classic);


    const restartGame = () => {
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
      const radius = radiusRatio * canvasWidth.value;  // Assuming width is your reference dimension

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
      ctx.font = '35px Verdana'; 
      ctx.fillStyle = currentTheme.value.scoreColor;
      ctx.fillText(scoreLeft.toString(), canvasWidth / 4, 50);
      ctx.fillText(scoreRight.toString(), (3 * canvasWidth) / 4, 50);
    };

    let loadedImages: { [key: string]: HTMLImageElement } = {};
    // Render the current game state onto the canvas
    const renderGameState = (gameState: GameState) => {
      if (!gameCanvas.value || !isValidGameState(gameState)) return;
      const ctx = gameCanvas.value.getContext('2d');
        // Check if the theme has a background image
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
        // If no background image, use background color
        ctx.fillStyle = currentTheme.value.backgroundColor;
        ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);
      }
      // ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
      // ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);
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

    // Cleanup: remove listeners when the component is destroyed
    onUnmounted(cleanupGameListeners);

    socket.on('connect', () => {
      console.log('Connected to the server');
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

    const setTheme = (themeName: ThemeName) => {
      currentTheme.value = themes[themeName];
      themeSelected.value = true;
    };

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
      setTheme,
      themeSelected,
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
  // background-color: #debdff;
}
// .gameCanvas.retro {
//   background-color: #123456;
//   background-image: url("../../public/images/retro_background.jpg");
// }

// .gameCanvas.dark {
//   background-color: #654321;
//   // background-image: url("/path/to/dark-image.jpg");
// }

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

body, html {
  overflow: hidden !important; /* Hide scrollbars */
}
.mode-button {
  font-size: 24px;
  font-family: 'Public Pixel', sans-serif;
  padding: 16px 32px;
  margin: 8px;
  border: none;
  background-color: #5C469C;
  /* background-color: var(--v-primary-base); */
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(212, 173, 252, 0.2);
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

/* Apply animation on hover */
.mode-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 15px rgba(212, 173, 252, 0.4);
}

/* Apply animation on click */
.mode-button:active {
  transform: scale(0.9);
  box-shadow: 0 2px 5px rgba(212, 173, 252, 0.2);
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