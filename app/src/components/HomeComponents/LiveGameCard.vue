<script setup lang="ts">
import CustomCard from '../CustomCard.vue'
    
    
    const props = defineProps<{
    info: {
        host:string,
        guest:string,
        avatarHost:string,
        avatarGuest:string,
    },
    }>()

</script>

<template>
    <div class="gameCard">
        <div class="avatars">
            <div class="host"> <img class="avatar" :src="props.info.avatarHost" alt="hosts's avatar"></div>
            <div class="guest"> <img class="avatar" :src="props.info.avatarGuest" alt="guest's avatar"></div>
        </div>
        <div class="lower">
            <div class="name"> <span>I</span> {{ props.info.host }} </div>
            <div class="ball"></div>
            <div class="name"> {{ props.info.guest }} <span>I</span> </div>
        </div>
    </div>
</template>

<style lang="scss">

.gameCard {
    position: relative;
    width: 200px;
    height: 150px;
    border: 2px solid ;
    border-radius: 20px;
    overflow: hidden;
}
.avatars {
    display: flex;
    gap: 2px;
    width: 100%;
    background-color: rgb(var(--v-theme-secondary));
    .avatar {
        width: 100px;
        height: 85px;
    }
}
.lower {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    background-color: rgb(var(--v-theme-colorThree));
    align-items: center;
    .name {
        display: flex;
        align-items: center;
        span {
            font-size: 2.5rem;
        }
    }
    .ball {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: rgb(var(--v-theme-secondary));
    }

}

</style>