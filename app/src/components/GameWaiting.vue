<script setup lang="ts"></script>

<template>
    <div class="waiting">
        <div class="bouncingWrapper">
            <div class="paddleWrapper">
                <div class="paddle"><div class="top"></div><div class="bottom"></div><div class="left"></div><div class="right"></div><div class="ceil"></div></div>
            </div>
            <div class="ball"></div>
        </div>
        <h2>Waiting for another player
            <div class="dot dot-1">.</div>
            <div class="dot dot-2">.</div>
            <div class="dot dot-3">.</div>
        </h2>
    </div>
</template>

<style lang="scss" scoped>


.waiting{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vw;
  padding: 5rem 0;
  height: 100%;
  width: 100%;
  font-size: 4vw;
  color: rgb(var(--v-theme-colorFoure));
  h2 {
    position: relative;
    display: flex;
    gap: 1vw;
  @for $i from 1 through 3 {
    .dot-#{$i} {
      animation: bounce 3s linear infinite calc($i * 500) + 1ms;
    }
  }
    @keyframes bounce {
      50%, 100%{
        transform: translateY(0);
      }
      75%{
        transform: translateY(-35%);
      }
    }
  }
}
.bouncingWrapper {
    position: relative;
    height: 200px;
    width: 150px;
    display: flex;
    justify-content: center;
}
.paddleWrapper {
    position: absolute;
    bottom: -70px;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotateX(75deg);
    transform-style: preserve-3d;
}
.paddle {
    position: relative;
    perspective: 190px;
    width: 80px;
    height: 80px;
    background: rgb(var(--v-theme-colorThree));
    transform-style: preserve-3d;
    animation: rotateZ 10s infinite linear;
    div {
        position: absolute;
    }
}
@keyframes rotateZ {
    100% {
        transform: rotateZ(360deg);
    }
}

.ceil {
    perspective: 190px;
    width: 80px;
    height: 80px;
    background: rgb(var(--v-theme-colorTwo)) !important;
    animation: paddleCeil 2s infinite linear;
}
@keyframes paddleCeil {
    0%, 46%, 55%, 100% {
        transform: translateZ(20px);
    }
    50% {
        transform: translateZ(10px);
    }
}

.top {
    transform-origin: top;
    background: linear-gradient(to top, rgb(var(--v-theme-colorTwo)), rgb(var(--v-theme-colorThree)));
    width: 80px;
    transform: rotateX(90deg);
    animation: paddleHeight 2s infinite linear;
}
.bottom {
    transform-origin: bottom;
    background: linear-gradient(to bottom, rgb(var(--v-theme-colorTwo)), rgb(var(--v-theme-colorThree)));
    width: 80px;
    bottom: 0;
    transform: rotateX(-90deg);
    animation: paddleHeight 2s infinite linear;
}
.left {
    transform-origin: left;
    background: linear-gradient(to left, rgb(var(--v-theme-colorTwo)), rgb(var(--v-theme-colorThree)));
    height: 80px;
    bottom: 0;
    transform: rotateY(-90deg);
    animation: paddleWidth 2s infinite linear;
}
.right {
    transform-origin: right;
    background: linear-gradient(to right, rgb(var(--v-theme-colorTwo)), rgb(var(--v-theme-colorThree)));
    height: 80px;
    right: 0;
    transform: rotateY(90deg);
    animation: paddleWidth 2s infinite linear;
}
@keyframes paddleHeight {
    0%, 46%, 55%, 100% {
        height: 20px;
    }
    50% {
        height: 10px;
    }
}
@keyframes paddleWidth {
    0%, 46%, 55%, 100% {
        width: 20px;
    }
    50% {
        width: 10px;
    }
}.ball {
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: radial-gradient(circle at top, rgb(var(--v-theme-colorTwo)), rgb(var(--v-theme-colorThree)));
    animation: bounce 1s linear infinite alternate;
}

@keyframes bounce {
    0% {
        top: 0;
        animation-timing-function: ease-in;
    }
    100% {
        top: 60%;
    }
}


</style>