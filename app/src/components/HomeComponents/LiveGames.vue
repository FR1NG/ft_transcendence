<script setup lang="ts">
import { ref } from 'vue';
import CustomCard from '../CustomCard.vue'
import LiveGameCard from './LiveGameCard.vue'

const roms = [
    {
        host:"user1",
        guest:" user2",
        avatarHost:"https://cdn.intra.42.fr/users/9a65446eb4e52003992947a9cb266862/ael-rhai.jpg",
        avatarGuest:"/images/avatars/eagle.jpg",
    },
    {
        host:"user3",
        guest:" user4",
        avatarHost:"/images/avatars/lion.jpg",
        avatarGuest:"/images/avatars/shark.jpg",
    },
    {
        host:"user5",
        guest:" user6",
        avatarHost:"/images/avatars/eagle.jpg",
        avatarGuest:"/images/avatars/shark.jpg",
    },
    {
        host:"user7",
        guest:" user8",
        avatarHost:"/images/avatars/shark.jpg",
        avatarGuest:"/images/avatars/lion.jpg",
    },
    {
        host:"user9",
        guest:" user10",
        avatarHost:"/images/avatars/shark.jpg",
        avatarGuest:"/images/avatars/eagle.jpg",
    },
    {
        host:"user9",
        guest:" user10",
        avatarHost:"/images/avatars/shark.jpg",
        avatarGuest:"/images/avatars/eagle.jpg",
    },
    {
        host:"user9",
        guest:" user10",
        avatarHost:"/images/avatars/shark.jpg",
        avatarGuest:"/images/avatars/eagle.jpg",
    },
    {
        host:"user9",
        guest:" user10",
        avatarHost:"/images/avatars/shark.jpg",
        avatarGuest:"/images/avatars/eagle.jpg",
    },
]

const rooms = ref(roms);
</script>

<template>
  <CustomCard class="liveGamesWrapper">
    <h3 class="matchesHeader">Live Games</h3>
    <div class="scroll">
        <LiveGameCard  v-for="room in rooms" :info="room"/>
    </div>
  </CustomCard>
</template>

<style lang="scss">


.liveGamesWrapper{
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    color: rgb(var(--v-theme-secondary));
    overflow-y: scroll;

    .scroll {
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        height: 100%;   
        gap: 1rem;
        justify-content: center;
    }
}


</style>
