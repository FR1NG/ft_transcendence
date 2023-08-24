<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { reactive, watch } from 'vue'
import axios from '@/plugins/axios'
import CustomCard from '@/components/CustomCard.vue';
import OnOffStatus from './OnOffStatus.vue';
import UserInteract from './Request.vue'

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



// temp variable to test----------------- going to be deleted later-----------------------------------------//
const userAvatar = "/images/eagleAvatar.jpeg";
const userName = "WWWWWWWWWW";
const totalWins = 40;
const totalTies = 5;
const totalLosses = 20;
//----------------------------------------------------------------------------------------------------------//


</script>



<template>
  <CustomCard class="statusWrapper">
    <OnOffStatus :isOnline="user.isOnline" :avatar="user.avatar"/>
    <div class="friendsCount">
      <h4 class="username"> {{user.username}} </h4>
      <v-chip class="ms-2 text-medium-emphasis" color="secondary" prepend-icon="mdi-account-multiple" size="small"
         variant="flat"> {{ userStore.friendsCount.toString() }} friends</v-chip>
    </div>
    <UserInteract/>
  </CustomCard>
</template>

<style lang="scss">

.statusWrapper {
  position: relative;
  display: flex;
}

.friendsCount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .username {
    padding-top: 0.8rem;
    font-size: 1.5em;
  }
}
</style>