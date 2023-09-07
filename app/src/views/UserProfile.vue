<script setup lang="ts">
import AvatarStatus from '@/components/ProfileComponents/AvatarCard/AvatarStatus.vue' 
import Level from '@/components/ProfileComponents/LevelCard/Level.vue' 
import LastMatches from '@/components/ProfileComponents/MatchesRecord/LastMatches.vue'
import Rank from '@/components/ProfileComponents/Rank/Rank.vue'
import Achievemets from '@/components/ProfileComponents/Achievements/Achievements.vue'

import { useUserStore } from '@/store/user'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { reactive, watch } from 'vue'

const userStore = useUserStore();
const { user, getRequstStatus, isBlocked } = storeToRefs(userStore);

const route = useRoute()
const data = reactive({
  sending: false
});

const username = route.params.username;
if (username) {
  userStore.getUser(username as string)
}

// watching the username change on route parame to refetch data
  watch(
    () => route.params.username, async newUsername => {
      console.log(newUsername)
      userStore.getUser(newUsername as string)
    }, {
    immediate: true
  }
)
</script>

<template>
  <v-card elevation="4" class="profileContainer">
    <h1 class="viewHeader element">Profile</h1>
    <AvatarStatus :user="user" class="avatarStatus element"/>
    <Level :user="user" class="level element"/>
    <LastMatches :user="user" class="matchsRecord element"/>
    <Rank :user="user" class="rank element"/>
    <Achievemets :user="user" class="achievements element"/>
  </v-card>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Gugi&display=swap');
::-webkit-scrollbar {
  display: none;
}

.profileContainer {
  overflow: scroll;
  color: white;
  font-family: 'Gugi', cursive;
  background-color: rgb(var(--v-theme-primary));
  padding: 1rem;
  display: grid;
  height: 93vh;
  grid-auto-columns: 1fr;
  gap: 1rem;
  grid-template-rows: 5% 20% 50% 20%;
  grid-template-areas: 
  "header    .         .         .        .        ."
  "profile   profile   profile   level    level    level"
  "rank      rank      rank      rank     matches  matches  "
  "achieves  achieves  achieves  achieves achieves achieves";
  .viewHeader {grid-area: header;}
  .avatarStatus {grid-area: profile;}
  .level {grid-area: level;}
  .friendInteract {grid-area: message;}
  .rank {grid-area: rank;}
  .matchsRecord {grid-area: matches;}
  .achievements {grid-area: achieves;}

}

.viewHeader {
  letter-spacing: 0.8rem;
}
@media (width < 970px) {
  .profileContainer{
    height: auto;
    width: 100%;
    display: block;
    .element {
      margin: 1rem;
    }
  }
}
@media (height < 900px) {
  .profileContainer{
  grid-template-rows: none;
  }
}

</style>