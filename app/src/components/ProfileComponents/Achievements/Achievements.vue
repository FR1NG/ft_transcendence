<!-- 
    x -pong veteran       : win a game                           -> 20  points
    x -pong win:          : win 10 games                         -> 20  points
    x -pong pro           : win 100 games                        -> 100 points
    x -pong master        : win 1000 games                       -> 200 points
    x -pong legend        : win 10 000 games                     -> 500 points
    x -clean sheet        : win a game with 11-0 score           -> 20  points
    x -lightning game     : win a game in less than 1 min        -> 20  points
    x -hot streak         : win 5 games in a row                 -> 20  points
    x -hotter streak      : win 10 games in a row                -> 100 points
    x -hottest streak     : win 20 games in a row                -> 200 points
    x -way of life        : get to the Master league             -> 100 points
    x -best of friends    : win the friends leaderboard          -> 100 points
    x -top of the world   : win the global leaderboard           -> 500 points
 -->

<!-- make the cards flip when hovered to show the details -->

 <script setup lang="ts">
    import { ref } from 'vue'

    import CustomCard from '@/components/CustomCard.vue'
    import PongWin from './Badges/PongWin.vue'
    import PongVeteran from './Badges/PongVeteran.vue'
    import LightningGame from './Badges/Lightning.vue'
    import Streak from './Badges/Streak.vue'
    import WayOfLife from './Badges/WayOfLife.vue'
    import BestOfFriends from './Badges/BestOfFriends.vue'
    import topOfWorld from './Badges/topOfWorld.vue'


</script>

<template>
    <CustomCard class="achievementsWrapper">
        <div class="slidera">
            <PongWin class="win" content="PONG"/>
            <Streak num="5" colr="rgba(218, 165, 32, 0.5)" fire="/images/fires/yellowFire.png"/>
            <PongVeteran num="10"/>
            <WayOfLife/>
            <Streak num="10" colr="rgba(232, 6, 6, 0.5)" fire="/images/fires/redFire.png"/>
            <BestOfFriends/>
            <topOfWorld/>
            <PongVeteran num="100"/>
            <PongWin content="11-0"/>
            <Streak num="20" colr="rgba(122, 106, 244, 0.5)" fire="/images/fires/blueFire.png"/>
            <PongVeteran num="1000"/>
            <LightningGame/>
            <PongVeteran num="10000"/>
        </div>
        <!-- <div class="slidera"> // FOR SLIDING
            <PongWin class="win" content="PONG"/>
            <Streak num="5" colr="rgba(218, 165, 32, 0.5)" fire="/images/fires/yellowFire.png"/>
            <PongVeteran num="10"/>
            <WayOfLife/>
            <Streak num="10" colr="rgba(232, 6, 6, 0.5)" fire="/images/fires/redFire.png"/>
            <BestOfFriends/>
            <topOfWorld/>
            <PongVeteran num="100"/>
            <PongWin content="11-0"/>
            <Streak num="20" colr="rgba(122, 106, 244, 0.5)" fire="/images/fires/blueFire.png"/>
            <PongVeteran num="1000"/>
            <LightningGame/>
            <PongVeteran num="10000"/>
        </div> -->
    </CustomCard>
</template>

<style lang="scss">

.achievementsWrapper {
    position: relative;
}

.slidera {
    position: relative;
    display:flex;
    gap:7rem;
    padding: 1rem;
    overflow-y: hidden;
    overflow-x: scroll !important;
}

</style>