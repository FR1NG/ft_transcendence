<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import CubeRank from './cubeRank.vue'
import Switcher from '../../Switcher.vue'
import CustomCard from '@/components/CustomCard.vue'
import { User } from '@/types/user';

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
        color:rgb(var(--v-theme-colorTwo));
        th {
            padding-bottom: 0.2rem;
        }
    }
    tbody {
        color: white;
        box-shadow: inset 0 0 20px 20px rgb(var(--v-theme-colorThree)),
                          5px 0 0px 5px rgb(var(--v-theme-colorThree));
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


<!-- <script setup lang="ts">
import { ref } from 'vue'
import CubeRank from './cubeRank.vue'
import Switcher from '../../Switcher.vue'
import CustomCard from '@/components/CustomCard.vue'
import { User } from '@/types/user';

const props = defineProps<{
  user: User
}>();

let currentState = ref(props.user.localRank);
let isLocal = ref(true);

const switchScope= () => {
    if (isLocal.value) {
        currentState.value = props.user.globalRank;
    }
    else
        currentState.value = props.user.localRank
    isLocal.value = !isLocal.value
}
// ------------------------------------------------------------

</script>

<template>
    <CustomCard class="rankWrapper">
        <div class="topThree">
            <CubeRank :avatar=currentState[0].avatar :username=currentState[0].username :points=currentState[0].points :rank=currentState[0].rank class="place1"/>
            <CubeRank :avatar=currentState[1].avatar :username=currentState[1].username :points=currentState[1].points :rank=currentState[1].rank class="place2"/>
            <CubeRank :avatar=currentState[2].avatar :username=currentState[2].username :points=currentState[2].points :rank=currentState[2].rank class="place3"/>
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
</template> -->