<script setup lang="ts">
import CustomCard from '@/components/CustomCard.vue';
import OnOffStatus from './OnOffStatus.vue';
import UserInteract from './Request.vue'
import type { User } from '@/types/user'

defineProps<{user: User, loading: Boolean}>()

</script>



<template>
  <CustomCard :loading="loading" class="statusWrapper" >
    <!-- <img class="usrAvatar" :src="user.avatar" alt="avatar image"> -->
    <!-- <div class="friendsCount"> -->
    <!--   <h4 class="username"> {{ user.username }} </h4> -->
    <!--   <v-chip class="ms-2 text-medium-emphasis" color="colorTwo" prepend-icon="mdi-account-multiple" size="small" -->
    <!--   variant="flat"> {{ user.friendsCount.toString() }} friends</v-chip> -->
    <!-- </div> -->
    <!-- <OnOffStatus v-if="user" :isOnline="user.isOnline" :avatar="user.avatar"/> -->
    <!-- <UserInteract :user="user"/> -->
    <v-row>
      <v-col cols="6" sm="3" class="d-flex justify-center pa-4">
        <v-avatar rounded="lg" size="150" class="mt-2">
          <v-img :src="user.avatar"></v-img>
             <OnOffStatus v-if="user" :isOnline="user.isOnline" :avatar="user.avatar"/>
        </v-avatar>
      </v-col>
      <v-col cols="6" sm="3">
    <div class="friendsCount">
      <h4 class="username"> {{ user.username }} </h4>
      <v-chip class="ms-2 text-medium-emphasis" color="colorTwo" prepend-icon="mdi-account-multiple" size="small"
      variant="flat"> {{ user.friendsCount.toString() }} friends</v-chip>
    </div>
      </v-col>
      <v-col cols="12" sm="6">
        <UserInteract :user="user"/>
      </v-col>

    </v-row>
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
