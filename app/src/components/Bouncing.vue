<script setup lang="ts"></script>

<template>
    <div class="wrapper">
        <div class="paddleWrapper">
            <div class="paddle"><div class="top"></div><div class="bottom"></div><div class="left"></div><div class="right"></div><div class="ceil"></div></div>
        </div>
        <div class="ball"></div>
    </div>
</template>

<style lang="scss" scoped>
*, *::beforee, *::after {
    padding: 0;
    margin: 0 auto;
    box-sizing: border-box;
}
.wrapper {
    position: relative;
    // background-color: blue;
    height: 40vw;
    width: 40vw;
    margin: 16rem;
    perspective: 800ox;
    background-color: green;
}
.paddleWrapper {
    position: absolute;
    bottom: -70px;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotateX(70deg);
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
    animation: paddleCeil 5s infinite linear;
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
    animation: paddleHeight 5s infinite linear;
}
.bottom {
    transform-origin: bottom;
    background: linear-gradient(to bottom, rgb(var(--v-theme-colorTwo)), rgb(var(--v-theme-colorThree)));
    width: 80px;
    bottom: 0;
    transform: rotateX(-90deg);
    animation: paddleHeight 5s infinite linear;
}
.left {
    transform-origin: left;
    background: linear-gradient(to left, rgb(var(--v-theme-colorTwo)), rgb(var(--v-theme-colorThree)));
    height: 80px;
    bottom: 0;
    transform: rotateY(-90deg);
    animation: paddleWidth 5s infinite linear;
}
.right {
    transform-origin: right;
    background: linear-gradient(to right, rgb(var(--v-theme-colorTwo)), rgb(var(--v-theme-colorThree)));
    height: 80px;
    right: 0;
    transform: rotateY(90deg);
    animation: paddleWidth 5s infinite linear;
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
}

</style>