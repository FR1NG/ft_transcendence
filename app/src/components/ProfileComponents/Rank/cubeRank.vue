<script setup lang="ts">
import { ref } from 'vue'
import { User } from '@/types/user'

//just for testing------- will be deleted later-----

const props = defineProps({
    userAvatar :String,
    username: String,
    points: Number,
    rank: String,
});

let nRank:number = 0;

if(props.rank){
    nRank = +props.rank
}

const positions:string[] = [
    "/images/trophies/goldTrophy.png",
    "/images/trophies/silverTrophy.png",
    "/images/trophies/bronzeTrophy.png",
]

const users = ref<User[]>([]);
const fill = () => {
    for (let a = 0; a < 3; a++)
{
    const tmpUser:User = {
        id: "" + Math.random(),
        isOnline: true,
        _count: {
            blockedBy: 3,
            friendOf: 2,
            friendWith: 1},
        username: "username" +a.toString(),
        avatar: "sdfa",
        email:"email",
    }
    users.value.push(tmpUser);
}
}
const userName = "testUsername";

fill()
// ------------------------------------------------------------

</script>

<template>
    <div class="cube">
        <img class="rankedPic" :src="userAvatar" alt="">
        <div class="face topFace"></div>
        <div class="face frontFace"></div>
        <div class="rankedData">
            <img class="trophy" :src="positions[nRank]" alt="trophy">
            <div class="username">{{ username }}</div>
            <div class="lign"></div>
            <div class="points"> {{points}} points</div>
        </div>
    </div>
</template>

<style lang="scss">

.cube {
    margin: 0;
    position: relative;
    width: 180px;
    height: 300px;
    perspective: 100em;
    display: flex;
    justify-content: center;
    

    .rankedPic {
        width: 100px;
        height: 100px;
        border-radius: 15%;
        box-shadow: 0px 0px 2px 1px black;
    }
    .topFace {
        position: absolute;
        top:20%;
        left: 4%;
        background-image:  linear-gradient(rgb(var(--v-theme-colorOne)), rgb(var(--v-theme-colorThree)));
        width: 90%;
        height: 50%;
        rotate: x 80deg;
    }
    
    .frontFace {
        position: absolute;
        top: 49.6%;
        left: 2%;
        background-image:  linear-gradient(rgb(var(--v-theme-colorThree)),rgb(var(--v-theme-colorOne)));
        width: 94%;
        height: 35%;
    }

    .rankedData {
        position:absolute;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        top: 110px;
        width: 90%;
        align-items: center;
        
        .lign {
            position: absolute;
            top:65%;
            width: 90%;
            height: 1px;
            background-color: rgb(87, 53, 75);
        }
        .trophy {
            width: 30px;
            height: 30px;
        }
        .points {
            color: rgb(var(--v-theme-colorTwo));
        }
    }
}


</style>


<!-- <script setup lang="ts">

const props = defineProps<{
    avatar: string,
    username: string,
    points: number,
    rank: number,
}>();

const positions:string[] = [
    "/images/trophies/goldTrophy.png",
    "/images/trophies/silverTrophy.png",
    "/images/trophies/bronzeTrophy.png",
]

</script>

<template>
    <div class="cube">
        <img class="rankedPic" :src="props.avatar" alt="">
        <div class="face topFace"></div>
        <div class="face frontFace"></div>
        <div class="rankedData">
            <img class="trophy" :src="positions[props.rank]" alt="trophy">
            <div class="username">{{ props.username }}</div>
            <div class="lign"></div>
            <div class="points"> {{ props.points}} points</div>
        </div>
    </div>
</template> -->