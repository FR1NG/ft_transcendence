<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import CubeRank from './cubeRank.vue'
import Switcher from '../../Switcher.vue'
import CustomCard from '@/components/CustomCard.vue'
import { User } from '@/types/user';

const local = [
    {
        userAvatar: "/images/avatars/monkey.jpg",
        userName: "user1",
        points: 3000,
        userRank: 0,
    },
    {
        userAvatar: "/images/avatars/tigress.jpg",
        userName: "user2",
        points: 1000,
        userRank: 1,
    },
    {
        userAvatar: "/images/avatars/po.jpg",
        userName: "user3",
        points: 600,
        userRank: 2,
    },
];

let usrDisplayed = false;

let currentState = ref(local);
let isLocal = ref(true);

const theUsr = {
    userAvatar: "/images/avatars/shifu.jpg",
    userName: "theuser",
    points: 2500,
    userRank: 0,
    
}

const switchScope= () => {
    usrDisplayed = false;
    if (isLocal.value) {
        currentState.value = [
            {
                userAvatar: "/images/avatars/po.jpg",
                userName: "user1",
                points: 1,
                userRank: 0,
            },
            {
                userAvatar: "/images/avatars/mantis.jpg",
                userName: "user2",
                points: 1,
                userRank: 1,
            },    
            {
                userAvatar: "/images/avatars/tigress.jpg",
                userName: "user3",
                points: 1,
                userRank: 2,
            },
        ]
    }
    else
    currentState.value = local
isLocal.value = !isLocal.value
}

const userIsClassed = (points: number) => {
    if (!usrDisplayed && theUsr.points > points)
    {
        usrDisplayed = true;
        return true;
    }
    return false;
}
const userInPaudium = ref(usrDisplayed);

// ------------------------------------------------------------

</script>

<template>
    <CustomCard class="rankWrapper">
        <div class="topThree">
            <div v-for="usr in currentState" :class="`place${usr.userRank}`">
                <CubeRank v-if="userIsClassed(usr.points)" :userAvatar=theUsr.userAvatar :username=theUsr.userName :points=theUsr.points :rank=usr.userRank />
                <CubeRank v-else :userAvatar=usr.userAvatar :username=usr.userName :points=usr.points :rank=usr.userRank />
            </div>
        </div>
        <Switcher @click="switchScope()" class="switcher"/>
        <table  v-if="userInPaudium" class ="userPosition" cellspacing="0" cellpadding="0">
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
    padding-top: 6rem;
    display: flex;
    justify-content: center;
    align-items: center;
}
.topThree {
    display: grid;
    grid-template-areas: "place1 place0 place2";
    gap: 0;
    .place0{
        margin-top:-80px;
        grid-area: place0;
    }
    .place1{
        grid-area: place1;
    }
    .place2{
        grid-area: place2;
    }
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


<!-- <script setup lang=
let currentState = ref(local);"ts">
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
const userIsClassed = (points: number) => {
    if (!usrDisplayed && theUsr.points > points)
    {
        usrDisplayed = true;
        return true;
    }
    return false;
}
const userInPaudium = ref(usrDisplayed);
// ------------------------------------------------------------

</script>

<template>
    <CustomCard class="rankWrapper">
        <div class="topThree">
            <div v-for="usr in currentState" :class="`place${usr.userRank}`">
                <CubeRank v-if="userIsClassed(usr.points)" :userAvatar=user.avatar :username=user.username :points=user.points :rank=usr.rank />
                <CubeRank v-else :userAvatar=usr.avatar :username=usr.usenabe :points=usr.points :rank=usr.rank />
            </div>
        </div>
        <Switcher @click="switchScope()" class="switcher"/>
        <table  v-if="userInPaudium" class ="userPosition" cellspacing="0" cellpadding="0">
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