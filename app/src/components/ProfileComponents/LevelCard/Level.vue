<script setup lang="ts">
import WinRate from './WinRate.vue';
import LevelBar from './LevelBar.vue';
import CustomCard from '@/components/CustomCard.vue';

defineProps({
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