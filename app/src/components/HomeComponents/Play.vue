<script setup lang="ts">
import NeonButton from './NeonButton.vue'
import LiveGames from './LiveGames.vue'
import RoomsList from './RoomsList.vue'


</script>



<template>
    <div class="playGame">
        <p>Ready to test your reflexes and paddle your way to victory?</p>
        <img class="pongGif" src="/images/ppong.gif" alt="pong gif">
        <div class="bottomHalf">
            <LiveGames/>
            <NeonButton/>
            <RoomsList/>
        </div>
    </div >
</template>

<style lang="scss">

    .playGame {
        position: relative;
        color: rgb(var(--v-theme-secondary));
        display: grid;
        height: 100%;
        justify-items: center;
        p {
            margin: 2rem;
            font-size: 1.2rem;
        }
        .pongGif {
            background-color: red;
            max-width: 100%;
            max-height: 20rem;
            right: 0;
            border-radius: 20px;
        }
        .bottomHalf {
            width: 100%;
            height: 100%;
            display: flex;
            gap: 3rem;
            padding: 1rem;
            padding-top:2rem;
            overflow: hidden;
        }
    }
</style>
