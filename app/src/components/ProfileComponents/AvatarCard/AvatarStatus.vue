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
    userStore.getUser(newUsername as string).then(() => {
      console.log(user.value);
    })
    }, {
    immediate: true
  }
)

</script>



<template>
  <CustomCard class="statusWrapper" >
    <img class="usrAvatar" :src="user.avatar" alt="avatar image">
    <div class="friendsCount">
      <h4 class="username"> {{ user.username }} </h4>
      <v-chip class="ms-2 text-medium-emphasis" color="colorTwo" prepend-icon="mdi-account-multiple" size="small"
      variant="flat"> {{ user.friendsCount.toString() }} friends</v-chip>
    </div>
    <OnOffStatus v-if="user" :isOnline="user.isOnline" :avatar="user.avatar"/>
    <UserInteract/>
  </CustomCard>
</template>

<style lang="scss">

.statusWrapper {
  position: relative;
  display: flex;
  overflow: hidden;
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
    font-size: 1.5em;
  }
}
@media (width < 480px) {
  .statusWrapper {
    .username {
      font-size: 0.8rem;
    }
    .ms-2 {
      height: 100px;
    }
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
