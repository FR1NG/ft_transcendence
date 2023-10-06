<script setup lang="ts">
import NeonButton from './NeonButton.vue'


</script>



<template>
    <div class="playGame">
        <div class="play">
            <NeonButton/>
            <img class="pongGif" src="/images/ppong.gif" alt="pong gif">
            <p class="quote">Ready to test your reflexes and paddle your way to victory?</p>
        </div>
    </div >
</template>

<style lang="scss">
.quote {
  color: rgb(var(--v-theme-colorFoure));
}
    .playGame {
        position: relative;
        display: flex;
        height: 100%;
        background-color: rgb(var(--v-theme-colorOne));
        gap: 5rem;
        p {
            margin: 2rem;
            font-size: 1.2rem;
        }
        .play {
            width: fit-content;
            height: 100%;
            width: 100%;
            display: flex;
            flex-wrap: wrap-reverse;
            align-content: flex-end;
            justify-content: center;
            align-items: center;
        }
        .pongGif {
            min-width: 20rem;
            width: 50%;
            right: 0;
            z-index: 1;
            border-radius: 20px;
        }
    }
    .leaderboard {
        color: rgb(var(--v-theme-colorTwo));
        height: 100%;
        background-color: red;
    }

</style>
