<script setup lang="ts">
import { storeToRefs } from 'pinia'
import CubeRank from './cubeRank.vue'
import CustomCard from '@/components/CustomCard.vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

</script>

<template>
    <CustomCard class="rankWrapper">
        <div class="topThree">
            <div v-for="(usr, index) in user.leaderboard" :class="`place${index}`">
                <CubeRank :userAvatar="usr.avatar" :username="usr.username" :points="usr.points" :rank="index" />
            </div>
        </div>
        <table class ="userPosition" cellspacing="0" cellpadding="0">
            <thead class="thead">
                <th></th>
                <th>username</th>
                <th>points</th>
                <th class="alignRight">league</th>
            </thead>
            <tbody class="tbody">
        <th class="pad"> {{ user.rank }}</th>
        <th>{{ user.username }}</th>
        <th>{{ user.points }}</th>
        <th class="alignRight">{{ user.leag?.name}}</th>
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
