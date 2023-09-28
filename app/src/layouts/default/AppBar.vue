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
  <v-app-bar color="colorOne">
    <v-app-bar-title>
      home
    </v-app-bar-title>

    <v-spacer></v-spacer>
    <NavNotification v-if="logged"/>
    <v-menu :close-on-content-click="false" width="200" location="bottom left" offset="5">
      <template v-slot:activator="{props}">
          <v-btn v-bind="props" color="colorFour" icon><v-icon>mdi-magnify</v-icon></v-btn>
      </template>
      <!-- <v-card width="200" class="pa-4"> -->
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
          </v-list-item>
        </template>
      </user-search>
      <!-- </v-card> -->
    </v-menu>
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
