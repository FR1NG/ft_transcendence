<script setup lang="ts">
</script>

<template>


<button class="neonButton"> Play now </button>

</template>

<style lang="scss">

    .neonButton {
        position: relative;
        cursor: pointer;
        color: rgb(var(--v-theme-secondary));
        min-width: 150px;
        height: 70px;
        font-size: 1.5rem;
        border: 2px solid rgb(var(--v-theme-secondary));
        border-radius: 5px;
        animation: lighten 2s linear infinite alternate;
    }
    .neonButton::before {
        position: absolute;
        overflow:visible;
        content: "";
        background-color: rgb(var(--v-theme-secondary));
        width: 100%;
        height: 100%;
        top: 100%;
        left: 0;
        animation: reflexion 2s linear infinite alternate 0.2s;
        transform: perspective(100px) rotateX(30deg) scale(1, 0.35);
        filter: blur(30px);
        opacity: 0;
    }

    @keyframes lighten {
        100% {
            color: transparent;
            background-color: rgb(var(--v-theme-secondary));
            text-shadow: 0 0 1.5px white, 0 0 10px rgb(var(--v-theme-secondary));
            box-shadow: 0 0 8px 3px rgb(var(--v-theme-secondary));
            opacity: 1;
        }
    }
    @keyframes reflexion {
        100% {
            opacity: 1;
        }
    }
    .neonButton:hover {
        text-shadow: 0 0 1.5px white, 0 0 10px rgb(var(--v-theme-secondary));
        box-shadow: 0 0 8px 2px rgb(var(--v-theme-secondary)),
              inset 0 0 8px 2px rgb(var(--v-theme-secondary));
        animation: none;
    }
    .neonButton:hover::before {
        animation: none;
    }
</style>