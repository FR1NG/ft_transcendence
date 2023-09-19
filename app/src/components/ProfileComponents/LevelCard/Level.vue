<script setup lang="ts">
import WinRate from './WinRate.vue';
import LevelBar from './LevelBar.vue';
import CustomCard from '@/components/CustomCard.vue';
import { User } from '@/types/user';
import { watch, ref } from 'vue';

const props = defineProps({
  points: {
    type: Number,
    default: 0
  },
  league: {
    type: String,
    deafult: 'none'
},
  loading: {
    type: Boolean,
    default: true
  }
});

</script>

<template>
  <CustomCard class="levelWrapper" :loading="loading">
      <div class="leag">
        <div class="leag">
          <img class="levelIcon" :src="`/images/levels/${league}.png`" alt="level icon">
          <div class="leagueName"> {{ league }}</div> <!-- this one to be removed and replaced by the one under it-->
        </div>
        <WinRate />
      </div>
      <LevelBar :points="points" />
  </CustomCard>
</template>

<style lang="scss">
.levelWrapper {
  position: relative;
  padding-top: 1rem;
  overflow: hidden;
}

.leag {
  display: flex;
  font-size: 1.5rem;
  align-content: space-around;
  justify-content: space-around;
  align-items: center;

  .levelIcon {
    width: 100px;
    height: 100px;
  }
}
</style>





<!-- <script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { User } from '@/types/user'
import WinRate from './WinRate.vue'
import LevelBar from './LevelBar.vue'
import CustomCard from '@/components/CustomCard.vue'


const props = defineProps<{
  user: User
}>();

const leagueIcon = "/images/levels/" + props.user.leag.name + ".png";

</script>

<template>
<CustomCard class="levelWrapper">
  <div class="leag">
    <div class="leag">
      <img class="levelIcon" :src="leagueIcon" alt="level icon">
      <div class="leagueName"> {{ props.user.leag.name }}</div>
    </div>
      <WinRate :wins="user.wins" :gamesNum="user.numberOfGames"/>
  </div>
    <LevelBar :lvl="level"/>
</CustomCard>

</template> -->
