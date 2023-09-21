<script setup lang="ts">

const props = defineProps < {
    userAvatar :string,
    username: string,
    points: number,
    rank: number,
}>()

const positions:string[] = [
    "/images/trophies/goldTrophy.png",
    "/images/trophies/silverTrophy.png",
    "/images/trophies/bronzeTrophy.png",
]

</script>

<template>
    <div class="cube">
        <img class="rankedPic" :src="userAvatar" alt="">
        <div class="face topFace"></div>
        <div class="face frontFace"></div>
        <div class="rankedData">
            <img class="trophy" :src="positions[props.rank]" alt="trophy">
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

    &:hover {
    cursor: pointer;
    }

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
        top: 49.4%;
        left: 2%;
        background-image:  linear-gradient(rgb(var(--v-theme-colorThree)),rgb(var(--v-theme-colorOne)));
        width: 94.2%;
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
