<script setup lang="ts">
import NeonButton from './NeonButton.vue'


</script>



<template>
    <div class="playGame">
        <p>Ready to test your reflexes and paddle your way to victory?</p>
        <img class="pongGif" src="/images/ppong.gif" alt="pong gif">
        <NeonButton/>
    </div >
</template>

<style lang="scss">

    .playGame {
        color: rgb(var(--v-theme-secondary));
        display: flex;
        flex-direction: column;
        align-items: center;
        p {
            margin: 2rem;
            font-size: 1.2rem;
        }
        .pongGif {
            background-color: red;
            width: 100%;
            max-height: 30rem;
            right: 0;
            border-radius: 20px;
            //   margin: 3rem 0 0 5rem;
        }
    }
</style>
