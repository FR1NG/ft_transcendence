<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { reactive, watch } from 'vue'
import CustomCard from '@/components/CustomCard.vue';
import OnOffStatus from './OnOffStatus.vue';
import UserInteract from './Request.vue'
import { ref } from 'vue'

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
const st = ref(true);


// temp variable to test----------------- going to be deleted later-----------------------------------------//
const userAvatar = "/images/avatars/eagle.jpg";
const userName = "WWWWWWWWWW";
const totalWins = 40;
const totalTies = 5;
const totalLosses = 20;
//----------------------------------------------------------------------------------------------------------//


</script>



<template>
  <CustomCard class="statusWrapper">
    <img class="usrAvatar" src="https://cdn.intra.42.fr/users/9a65446eb4e52003992947a9cb266862/ael-rhai.jpg" alt="avatar image">
    <div class="friendsCount">
      <h4 class="username"> {{userName}} </h4>
      <v-chip class="ms-2 text-medium-emphasis" color="colorTwo" prepend-icon="mdi-account-multiple" size="small"
      variant="flat"> {{ userStore.friendsCount.toString() }} friends</v-chip>
    </div>
    <OnOffStatus :isOnline="st" :avatar="userAvatar"/>
    <UserInteract/>
  </CustomCard>
</template>

<style lang="scss">

.statusWrapper {
  position: relative;
  display: flex;
}
.usrAvatar {
  margin: 10px;
  // width: 200px;
  height: 150px;
  border-radius: 20px;
  border: 1px solid;
}

.friendsCount {
  margin-top: 0.5rem;
  
  .username {
    margin-top: -0.3rem;
    font-size: 1.5em;
  }
}
</style>


 <!-- <script setup lang="ts">

import { User } from '@/types/user';

import CustomCard from '@/components/CustomCard.vue';
import OnOffStatus from './OnOffStatus.vue';
import UserInteract from './Request.vue'


const props = defineProps<{
  user: User,
}>();

</script>

  <CustomCard class="statusWrapper">
    <img class="usrAvatar" :src="userAvatar" alt="avatar image">
    <div class="friendsCount">
      <h4 class="username"> {{user.username}}</h4>
      <v-chip class="ms-2 text-medium-emphasis" color="secondary" prepend-icon="mdi-account-multiple" size="small"
      variant="flat"> {{ user.friendsNumber }} friends</v-chip>
    </div>
    <OnOffStatus :isOnline="user.isOnline" :avatar="userAvatar"/>
    <UserInteract/>
  </CustomCard> -->