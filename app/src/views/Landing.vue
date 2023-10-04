<script setup lang="ts">
    import GameName from '@/components/LandingComponents/GameName.vue';
    import Ball from '@/components/LandingComponents/Ball.vue';

</script>

<template>
<div class="wrapper">
    <div class="pongWrapper">
        <div class="pong">pong</div>
    </div>
            
    <Ball/>
</div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500&display=swap');

.wrapper {
    position: relative;
    background-color: rgb(var(--v-theme-colorOne));
    display: flex;
    justify-content: center;
    height: 100%;
    padding: 3rem;
}
.pong {
    position: relative;
    font-family: 'Space Grotesk', sans-serif;
    color: rgb(var(--v-theme-colorTwo));
    font-size: 14vw;
    letter-spacing: 1vw;
    opacity: 0;
    animation: appear 3s linear forwards 10s;
}
.pong::before {
    content: '';
    position: absolute;
    background: rgb(var(--v-theme-colorTwo));
    top: 80%;
    width: 100%;
    height: 100%;
    transform: perspective(800px) rotateX(70deg) scale(0.4, 0.35);
    filter: blur(1.5em);
    animation: appear 3s linear forwards 10s;
    opacity: 0;
}

@keyframes appear {
    50% {
        text-shadow: 0 0 20px rgb(var(--v-theme-colorTwo));
    }
    100% {
        opacity: 1;
        text-shadow: 0 0 3px rgb(var(--v-theme-colorTwo));
    }
}
</style>