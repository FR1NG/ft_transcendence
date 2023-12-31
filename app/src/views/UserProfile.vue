<script setup lang="ts">
import AvatarStatus from '@/components/ProfileComponents/AvatarCard/AvatarStatus.vue'
import Level from '@/components/ProfileComponents/LevelCard/Level.vue'
import LastMatches from '@/components/ProfileComponents/MatchesRecord/LastMatches.vue'
import Rank from '@/components/ProfileComponents/Rank/Rank.vue'
import Achievemets from '@/components/ProfileComponents/Achievements/Achievements.vue'

import { useUserStore } from '@/store/user'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useSocketStore } from '@/store/socket'

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { me } = storeToRefs(useAuthStore());

const route = useRoute()
const loading = ref(true);
const league = ref('')

// subscript hot reload event to get user
const getUsername = () => {
  return user.value.username
}
useSocketStore().subscribHotReloadEvent({scope: 'user', cb: userStore.getUser, getParams: getUsername});
// watching the username change on route parame to refetch data
watch(
  () => route.params.username, async newUsername => {
    loading.value = true;
    userStore.getUser(newUsername as string).then(() => {
      loading.value = false;
      setLeag(user.value.points);
    }).catch(() => {
      loading.value = false
    })
  }, {
  immediate: true
}
)

const leagues = [
  { name: "bronze", points: 10 },
  { name: "silver", points: 50 },
  { name: "gold", points: 100 },
  { name: "sapphire", points: 500 },
  { name: "platinum", points: 1800 },
  { name: "diamond", points: 5000 },
  { name: "Master", points: 10000 },
];

const setLeag = (points: number) => {
  const selected: {name: string, points: number} = leagues.find((el: any) => el.points > points) || {name: '', points:0};
  league.value = selected.name;
}
</script>

<template>
  <v-card elevation="4" class="profileContainer" v-if="user.id">
    <h1 class="viewHeader element">Profile</h1>
    <AvatarStatus :me="me" :loading="loading" :user="user" class="avatarStatus element" />
    <Level :loading="loading" :league="league" :points="user.points" class="level element" />
    <LastMatches :loading="loading" :user="user" class="matchsRecord element" />
    <Rank :user="user" :loading="loading" :league="league" class="rank element" />
    <Achievemets :user="user" :loading="loading" class="achievements element" />
  </v-card>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Gugi&display=swap');

::-webkit-scrollbar {
  display: none;
}

.profileContainer {
  overflow: scroll;
  color: rgb(var(--v-theme-colorTwo));
  font-family: 'Gugi', cursive;
  background-color: rgb(var(--v-theme-colorOne));
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

  .viewHeader {
    grid-area: header;
  }

  .avatarStatus {
    grid-area: profile;
  }

  .level {
    grid-area: level;
  }

  .friendInteract {
    grid-area: message;
  }

  .rank {
    grid-area: rank;
  }

  .matchsRecord {
    grid-area: matches;
  }

  .achievements {
    grid-area: achieves;
  }

}

.viewHeader {
  letter-spacing: 0.8rem;
}

@media (width < 970px) {
  .profileContainer {
    height: auto;
    width: 100%;
    display: block;

    .element {
      margin: 1rem;
    }
  }
}

@media (height < 900px) {
  .profileContainer {
    grid-template-rows: none;
  }
}</style>
