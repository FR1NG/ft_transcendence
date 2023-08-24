<script setup lang="ts">
import { ref } from 'vue'
import { Match, User } from '@/types/user'
import CubeRank from './cubeRank.vue'
import Switcher from '../../Switcher.vue'
import CustomCard from '@/components/CustomCard.vue'

//just for testing------- will be deleted later-----

// let userAvatar1 =ref("/images/avatars/eagle.jpg")
// let userName1 = "user1";
// let userPoints1 = "1000"
// let userRank1 = "1";

// let userAvatar2 = ref("/images/avatars/lion.jpg")
// let userName2 = "user2";
// let userPoints2 = "3000"
// let userRank2 = "0";

// let userAvatar3 = ref("/images/avatars/shark.jpg")
// let userName3 = "user3";
// let userPoints3 = "600"
// let userRank3 = "2";

// const switchScope= () => {

//     userAvatar1.value = "/images/avatars/eagle.jpg"
//     userName1 = "user";
//     userPoints1 = "1"
//     userRank1 = "1";

//     userAvatar2.value = ("/images/avatars/eagle.jpg")
//     userName2 = "user";
//     userPoints2 = "1"
//     userRank2 = "0";

//     userAvatar3.value = ("/images/avatars/eagle.jpg")
//     userName3 = "user";
//     userPoints3 = "1"
//     userRank3 = "2";
// }

const local = {
    userAvatar1: "/images/avatars/eagle.jpg",
    userName1: "user1",
    userPoints1: "1000",
    userRank1: "1",

    userAvatar2: "/images/avatars/lion.jpg",
    userName2: "user2",
    userPoints2: "3000",
    userRank2: "0",

    userAvatar3: "/images/avatars/shark.jpg",
    userName3: "user3",
    userPoints3: "600",
    userRank3: "2",
}

let currentState = ref(local);
let isLocal = ref(true);

const switchScope= () => {
    if (isLocal.value) {
        currentState.value = {
            userAvatar1: "/images/avatars/eagle.jpg",
            userName1: "user",
            userPoints1: "1",
            userRank1: "1",
        
            userAvatar2: "/images/avatars/eagle.jpg",
            userName2: "user",
            userPoints2: "1",
            userRank2: "0",
        
            userAvatar3: "/images/avatars/eagle.jpg",
            userName3: "user",
            userPoints3: "1",
            userRank3: "2",
        }
    }
    else
        currentState.value = local
    isLocal.value = !isLocal.value
}
// ------------------------------------------------------------

</script>

<template>
    <CustomCard class="rankWrapper">
        <div class="topThree">
            <CubeRank :userAvatar=currentState.userAvatar1 :username=currentState.userName1 :points=currentState.userPoints1 :rank=currentState.userRank1 class="place2"/>
            <CubeRank :userAvatar=currentState.userAvatar2 :username=currentState.userName2 :points=currentState.userPoints2 :rank=currentState.userRank2 class="place1"/>
            <CubeRank :userAvatar=currentState.userAvatar3 :username=currentState.userName3 :points=currentState.userPoints3 :rank=currentState.userRank3 class="place3"/>
            <Switcher @click="switchScope()" class="switcher"/>
        </div>
        <table class ="userPosition" cellspacing="0" cellpadding="0">
            <thead class="thead">
                <th></th>
                <th>username</th>
                <th>points</th>
                <th class="alignRight">league</th>
            </thead>
            <tbody class="tbody">
                <th class="pad">36</th>
                <th>testUsername</th>
                <th>120</th>
                <th class="alignRight">wood</th>
            </tbody>
        </table>
    </CustomCard>
</template>

<style lang="scss">

.rankWrapper {
    position: relative;
    max-height: 600px;
    min-height: 400px;
    // overflow: hidden;
    padding-top: 6rem;
}
.topThree {
    display: flex;
    justify-content: center;

}

.place1{
    margin-top:-80px;
}

.userPosition {
    position: absolute;
    bottom:3%;
    left: 4%;
    width: 90%;
    height: 5%;
    text-align: left;
    thead{
        color:rgb(128, 78, 151);
    }
    tbody {
        color: rgb(var(--v-theme-secondary));
        box-shadow: inset 0 0 20px 20px rgb(87, 53, 75),
                          5px 0 0px 5px rgb(87, 53, 75);
        border-radius: 10px;
    }
}
.pad {
    padding-left: 1rem;
}
.alignRight {
    text-align: right;
}

.switcher {
    position:absolute;
    top:65%;
}

@media (width < 970px) {
    .rankWrapper {
        min-height: 500px;
    }
}
</style>