<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import { ref, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { reactive, watch } from 'vue'
import WinRate from './WinRate.vue'
import LevelBar from './LevelBar.vue'
import CustomCard from '@/components/CustomCard.vue'


const userStore = useUserStore();
const { user, getRequstStatus, isBlocked } = storeToRefs(userStore);

const route = useRoute()

const username = route.params.username;
if (username) {
  userStore.getUser(username as string)
}

// temp variable to test----------------- going to be deleted later---------//
const wins = 40;
const losses = 10;
const rate = (wins * 100) / (wins + losses)
//-------------------------------------------------------------------------//

// const rate = (user.winnedGames * 100) / (user.hostedGames + user.guestedGames)
let winLevel = ref(rate);
let winLevel1 = ref(0);
const winLevel2 = 220 - (220 * winLevel.value / 100);
let count = 0;
const interv = setInterval(() => {
    if (winLevel1.value >= winLevel.value){
        clearInterval(interv);
    }else{
        winLevel1.value++;
    }
}, 10)


</script>

<template>
    <div class="winWrapper">
        <div class="winRate">
            <div class="outer">
                <div class="inner">
                    <div class="levelNum"> win rate {{ winLevel1 }} %</div>
                </div>
            </div>
            <svg>
                <defs>
                    <linearGradient id="gradient">
                        <stop offset="0%" stop-color="#FF00BD"/>
                        <stop offset="100%" stop-color="#9198e5"/>
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="35" stroke-linecap="round"></circle>
            </svg>
        </div>
        <div class="totals">
          <div class="mdi mdi-thumb-up-outline" style="color:#FF00BD;">. {{ wins}} wins</div>
          <div class="mdi mdi-thumb-down-outline" style="color:#9198e5">. {{ losses}} losses</div>
        </div>
    </div>
</template>

<style lang="scss">

@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300&display=swap');

.winWrapper {
    display: flex;
    align-items: center;
    align-content: center;
}

.winRate {
    position: relative;
    // display: flex;
    // flex-direction: column;
    padding: 10px;
    .outer {
     height: 80px;
     width: 80px;
     border-radius: 50%;
     padding: 10px; 
     box-shadow: 2px 2px 4px 5px rgba(0, 0, 0, 0.7), 
                 -2px -2px 4px 1px rgb(181 160 160 / 70%);
        .inner {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 60px;
            width: 60px;
            border-radius: 50%; 
            box-shadow: inset 2px 2px 4px 5px rgba(0, 0, 0, 0.7), 
                        inset -2px -2px 4px 1px rgb(181 160 160 / 70%);
        }
    }
    .levelNum {
        font-size: 0.8rem;
        width: 70px;
        text-align: center;
    }
    svg {
        position: absolute;
        top:0;
        left: 0;
    }
    circle {
        fill: none;
        stroke: url(#gradient);
        stroke-width: 10px;
        stroke-dasharray: 220;
        stroke-dashoffset: 220;
        animation: levelAnim 1s linear forwards;
    }

    @keyframes levelAnim {
        100% {
            stroke-dashoffset: v-bind(winLevel2);
            animation-timing-function: ease-in-out;
        }
    }
}

</style>




<!-- <script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  wins: number
  gamesNum: number
}>();

const rate = (props.wins * 100) / (props.gamesNum)

// const rate = (user.winnedGames * 100) / (user.hostedGames + user.guestedGames)
let winLevel = ref(rate);
let winLevel1 = ref(0);
const winLevel2 = 220 - (220 * winLevel.value / 100);
let count = 0;
const interv = setInterval(() => {
    if (winLevel1.value >= winLevel.value){
        clearInterval(interv);
    }else{
        winLevel1.value++;
    }
}, 10)


</script>

<template>
    <div class="winWrapper">
        <div class="winRate">
            <div class="outer">
                <div class="inner">
                    <div class="levelNum"> win rate {{ winLevel1 }} %</div>
                </div>
            </div>
            <svg>
                <defs>
                    <linearGradient id="gradient">
                        <stop offset="0%" stop-color="#FF00BD"/>
                        <stop offset="100%" stop-color="#9198e5"/>
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="35" stroke-linecap="round"></circle>
            </svg>
        </div>
        <div class="totals">
          <div class="mdi mdi-thumb-up-outline" style="color:#FF00BD;">. {{ props.wins}} wins</div>
          <div class="mdi mdi-thumb-down-outline" style="color:#9198e5">. {{ props.gamesNum - props.wins}} losses</div>
        </div>
    </div>
</template> -->
