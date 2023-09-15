<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { reactive, watch } from 'vue'
import WinRate from './WinRate.vue'
import LevelBar from './LevelBar.vue'
import CustomCard from '@/components/CustomCard.vue'


const userStore = useUserStore();
const { user, getRequstStatus, isBlocked } = storeToRefs(userStore);

const route = useRoute()

const username = route.params.username;
if (username) {
  userStore.getUser(username as string)
}

const leagues = [
    "bronze",
    "silver",
    "gold",
    "platinum",
    "diamond",
    "heroic",
    "Master"]
  const leagueIcon = "/images/levels/" + leagues[6] + ".png";
</script>

<template>
<CustomCard class="levelWrapper">
  <div class="leag">
    <div class="leag">
      <img class="levelIcon" :src="leagueIcon" alt="level icon">
      <div class="leagueName"> {{ leagues[6] }}</div> <!-- this one to be removed and replaced by the one under it-->
    </div>
      <WinRate/>
  </div>
    <LevelBar/>
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