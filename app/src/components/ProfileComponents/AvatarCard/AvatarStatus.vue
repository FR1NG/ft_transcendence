<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { reactive, watch } from 'vue'
import CustomCard from '@/components/CustomCard.vue';
import OnOffStatus from './OnOffStatus.vue';
import UserInteract from './Request.vue'

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const route = useRoute()

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
  <CustomCard class="statusWrapper">
    <img class="usrAvatar" :src="user.avatar" alt="avatar image">
    <div class="friendsCount">
      <h4 class="username"> {{ user.username }} </h4>
      <v-chip class="ms-2 text-medium-emphasis" color="colorTwo" prepend-icon="mdi-account-multiple" size="small"
      variant="flat"> {{ userStore.friendsCount.toString() }} friends</v-chip>
    </div>
    <OnOffStatus :isOnline="user.isOnline" :avatar="user.avatar"/>
    <UserInteract/>
  </CustomCard>
</template>

<style lang="scss">

.statusWrapper {
  position: relative;
  display: flex;
}
.usrAvatar {
  margin: 2px;
  width: 200px;
  height: 98%;
  border-radius: 20px;
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
