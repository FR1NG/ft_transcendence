<script setup lang="ts">

import { Achiement, User } from '@/types/user'
import CustomCard from '@/components/CustomCard.vue'
import PongWin from './Badges/PongWin.vue'
import PongVeteran from './Badges/PongVeteran.vue'
import Streak from './Badges/Streak.vue'

const props = defineProps<{
  user: User,
  loading: Boolean
}>();

const isLocked = (name: string) => {
  if(props.user.achievments.find((item: Achiement) => item.name === name))
    return false;
  return true;
}

</script>

<template>
    <CustomCard :loading="loading" class="achievementsWrapper">
      <PongWin class="slide" :achieved="isLocked('pong win')" content="PONG" name="Pong win" description="win a game" />
      <Streak class="slide" :achieved="isLocked('hot streak')" num="5" colr="rgba(218, 165, 32, 0.5)" fire="/images/fires/yellowFire.png" name="Hot streak" description="win 5 games in a row"/>
      <PongVeteran class="slide" :achieved="isLocked('hotter streak')" num="10" name="Pong veteran" description="win 10 games"/>
    </CustomCard>
</template>

<style lang="scss">


.achievementsWrapper {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem 5rem;
    flex-wrap: wrap;
    padding: 1rem;
}


.contain {
      position: relative;
      width: 200px;
      height: 100%;
      letter-spacing: 0.2em;
      border-radius:20px;
      text-align: center;
      border: 1px solid rgba(var(--v-theme-colorTwo), 0.5);
      box-shadow: -3px -3px 5px -5px rgba(var(--v-theme-colorTwo), 0.5),
      1px 1px 2px 0 black;
      border-bottom: 2px solid black;
      border-right: 2px solid black;
      padding-top: 1rem;
      h3 {
        color: rgb(var(--v-theme-colorTwo));
        padding-bottom: 1rem;
      }
      .pongFont {
        padding-top: 1.5rem;
        color: rgb(var(--v-theme-colorTwo));
          font-size: 2.5rem;
          text-shadow: 1px 1px 2px white;
          white-space: nowrap;
      }
    }
</style>



<!-- <script setup lang="ts">

import { ref, onMounted } from 'vue'
import { User } from '@/types/user'
import CustomCard from '@/components/CustomCard.vue'
import PongWin from './Badges/PongWin.vue'
import PongVeteran from './Badges/PongVeteran.vue'
import LightningGame from './Badges/Lightning.vue'
import Streak from './Badges/Streak.vue'
import WayOfLife from './Badges/WayOfLife.vue'
import BestOfFriends from './Badges/BestOfFriends.vue'
import topOfWorld from './Badges/topOfWorld.vue'

const props = defineProps<{
  user: User,
}>();


</script>

<template>
    <CustomCard class="achievementsWrapper">
        <div class="sliderTrack">
            <PongWin class="slide" :achieved="props.user.achievements[0].achieved" content="PONG" name="Pong win" description="win a game" />
            <Streak class="slide" :achieved="props.user.achievements[1].achieved" num="5" colr="rgba(218, 165, 32, 0.5)" fire="/images/fires/yellowFire.png" name="Hot streak" description="win 5 games in a row"/>
            <PongVeteran class="slide" :achieved="props.user.achievements[2].achieved" num="10" name="Pong veteran" description="win 10 games"/>
            <WayOfLife class="slide" :achieved="props.user.achievements[3].achieved" name="Way of life" description="get to the Master league"/>
            <Streak class="slide" :achieved="props.user.achievements[4].achieved" num="10" colr="rgba(232, 6, 6, 0.5)" fire="/images/fires/redFire.png" name="Hotter streak" description="win 10 games in a row"/>
            <BestOfFriends class="slide" :achieved="props.user.achievements[5].achieved" name="Pong win" description="win a game"/>
            <topOfWorld class="slide" :achieved="props.user.achievements[6].achieved" name="top of the world" description="win the global leaderboard "/>
            <PongVeteran class="slide" :achieved="props.user.achievements[7].achieved" num="100" name="Pong pro" description="win 100 games"/>
            <PongWin class="slide" :achieved="props.user.achievements[8].achieved" name="clean sheet" description="win a game with 11 - 0 score" content="11-0"/>
            <Streak class="slide" :achieved="props.user.achievements[9].achieved" num="20" colr="rgba(122, 106, 244, 0.5)" fire="/images/fires/blueFire.png" name="Hottest streak" description="win 20 games in a row"/>
            <PongVeteran class="slide" :achieved="props.user.achievements10].achieved" num="1000" name="Pong master" description="win 1 000 games"/>
            <LightningGame class="slide" :achieved="props.user.achievements[11].achieved" name="Pong win" description="win a game"/>
            <PongVeteran class="slide" :achieved="props.user.achievements[12].achieved" num="10000" name="Pong legend" description="win 10 000 games"/>
        </div>
        <div class="sliderTrack">
            <PongWin class="slide" :achieved="props.user.achievements[0].achieved" content="PONG" name="Pong win" description="win a game" />
            <Streak class="slide" :achieved="props.user.achievements[1].achieved" num="5" colr="rgba(218, 165, 32, 0.5)" fire="/images/fires/yellowFire.png" name="Hot streak" description="win 5 games in a row"/>
            <PongVeteran class="slide" :achieved="props.user.achievements[2].achieved" num="10" name="Pong veteran" description="win 10 games"/>
            <WayOfLife class="slide" :achieved="props.user.achievements[3].achieved" name="Way of life" description="get to the Master league"/>
            <Streak class="slide" :achieved="props.user.achievements[4].achieved" num="10" colr="rgba(232, 6, 6, 0.5)" fire="/images/fires/redFire.png" name="Hotter streak" description="win 10 games in a row"/>
            <BestOfFriends class="slide" :achieved="props.user.achievements[5].achieved" name="Pong win" description="win a game"/>
            <topOfWorld class="slide" :achieved="props.user.achievements[6].achieved" name="top of the world" description="win the global leaderboard "/>
            <PongVeteran class="slide" :achieved="props.user.achievements[7].achieved" num="100" name="Pong pro" description="win 100 games"/>
            <PongWin class="slide" :achieved="props.user.achievements[8].achieved" name="clean sheet" description="win a game with 11 - 0 score" content="11-0"/>
            <Streak class="slide" :achieved="props.user.achievements[9].achieved" num="20" colr="rgba(122, 106, 244, 0.5)" fire="/images/fires/blueFire.png" name="Hottest streak" description="win 20 games in a row"/>
            <PongVeteran class="slide" :achieved="props.user.achievements[10].achieved" num="1000" name="Pong master" description="win 1 000 games"/>
            <LightningGame class="slide" :achieved="props.user.achievements[11].achieved" name="Pong win" description="win a game"/>
            <PongVeteran class="slide" :achieved="props.user.achievements[12].achieved" num="10000" name="Pong legend" description="win 10 000 games"/>
        </div>
    </CustomCard>
</template> -->













<!--
    x -pong win           : win a game                           -> 20  points
    x -pong veteran:      : win 10 games                         -> 20  points
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
