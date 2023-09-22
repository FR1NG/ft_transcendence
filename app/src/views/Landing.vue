<script setup lang="ts">
    import Ball from '@/components/LandingComponents/Ball.vue';
    import GameName from '@/components/LandingComponents/GameName.vue';

</script>

<template>
<div class="wrapper">
    <Ball/>
    <GameName/>
</div>
</template>

<style>
.wrapper{
    position: relative;
    background-color: rgb(var(--v-theme-colorOne));
    height: 100%;
}
</style>