<script lang="ts" setup>
import NavMenu from './navbar/NavMenu.vue';
import NavNotification from './navbar/NavNotification.vue';
import UserSearch from '@/components/ProfileComponents/search/UserSearch.vue';
import { useAuthStore } from '@/store/auth';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';


const authStore = useAuthStore();
const { logged } = storeToRefs(authStore);
const route = useRoute();
</script>

<template>
  <v-app-bar flat color="colorOne">
    <v-app-bar-title>

    </v-app-bar-title>

    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <NavNotification v-if="logged"/>
      <user-search v-if="logged">
        <template v-slot:items="{users}">
          <v-list-item
            v-for="user in users"
            :key="user.id"
            :prepend-avatar="user.avatar"
            :title="user.username"
            :subtitle="user.email"
            :to="{name: 'UserProfile', params: {username: user.username}}"
          >
            <template v-slot:append>
              <v-btn
                variant="text"
                icon="mdi-account-plus-outline"
              ></v-btn>
            </template>
          </v-list-item>
        </template>
    </user-search>
    <template v-slot:append>
      <NavMenu v-if="logged" />
      <v-btn v-else-if="!logged && route.name !=='Login'" color="colorTwo" outlined :to="{ name: 'Login' }">Login</v-btn>
    </template>
  </v-app-bar>
</template>


<style>
.logo {
  transform: rotate(40deg);
  color: #0C134F;
  font-size: 50px !important;
}
</style>
