<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import CubeRank from './cubeRank.vue'
import Switcher from '../../Switcher.vue'
import CustomCard from '@/components/CustomCard.vue'
import { User } from '@/types/user';
import { log } from 'console'

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
const global = [
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
];
const theUsr1 = {
    userAvatar: "/images/avatars/shifu.jpg",
    userName: "theuser",
    points: 250,
    userRank: 1,
}
const theUsr2 = Object.assign({}, theUsr1);

const isLocal = ref(true);
const currentState = ref(local.slice());

const findIndex = (scope: {userAvatar: string, userName: string, points: number, userRank: number}[], theUsr: {userAvatar: string, userName: string, points: number, userRank: number}) => {
    let index = 0;
    for (let i = 0; i < scope.length; i++)
    {
        if (theUsr.points > scope[i].points)
        {
            theUsr.userRank = i;
            for (let j = i; j < 3; j++)
                scope[j].userRank++;
            return i;
        }
    }
    return 3;
};



const switchScope= () => {
    if (isLocal.value)
        currentState.value = global;
    else
        currentState.value = local
    isLocal.value = !isLocal.value
}

onMounted(() => {
    local.splice(findIndex(local, theUsr1), 0, theUsr1);
    global.splice(findIndex(global, theUsr2), 0, theUsr2);
    currentState.value = local;
});


// ------------------------------------------------------------

</script>

<template>
    <CustomCard class="rankWrapper">
        <div class="topThree">
            <div v-for="(usr, index) in currentState" :class="`place${usr.userRank}`">
                <CubeRank v-if="index != 3" :userAvatar=usr.userAvatar :username=usr.userName :points=usr.points :rank=usr.userRank />
            </div>
        </div>
        <Switcher @click="switchScope()" class="switcher"/>
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
    padding-top: 6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
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
    top: 0;
    left: 0;
}

@media (width < 970px) {
    .rankWrapper {
        min-height: 500px;
    }
}
@media (width < 600px) {
    .cube {
        width: 100px;
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

const user1 = {
    userAvatar: user.avatar,
    userName: user.username,
    points: user.points,
    userRank: user.rank,
}
const theUsr2 = Object.assign({}, user1);

const isLocal = ref(true);
const currentState = ref();

const findIndex = (scope: {userAvatar: string, userName: string, points: number, userRank: number}[], theUsr: {userAvatar: string, userName: string, points: number, userRank: number}) => {
    let index = 0;
    for (let i = 0; i < scope.length; i++)
    {
        if (theUsr.points > scope[i].points)
        {
            theUsr.userRank = i;
            for (let j = i; j < 3; j++)
                scope[j].userRank++;
            return i;
        }
    }
    return 3;
};



const switchScope= () => {
    if (isLocal.value)
        currentState.value = global;
    else
        currentState.value = local
    isLocal.value = !isLocal.value
}

onMounted(() => {
    local.splice(findIndex(local, theUsr1), 0, theUsr1);
    global.splice(findIndex(global, theUsr2), 0, theUsr2);
    currentState.value = local;
});

</script>

<template>
    <CustomCard class="rankWrapper">
        <div class="topThree">
            <div v-for="(usr, index) in currentState" :class="`place${usr.userRank}`">
                <CubeRank v-if="index != 3" :userAvatar=usr.userAvatar :username=usr.userName :points=usr.points :rank=usr.userRank />
            </div>
        </div>
        <Switcher @click="switchScope()" class="switcher"/>
        <table class ="userPosition" cellspacing="0" cellpadding="0">
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