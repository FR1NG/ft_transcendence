<template>
  <v-app-bar flat color="colorOne">
    <v-app-bar-title>
      <v-icon icon="logo mdi-table-tennis" />
      otossa
    </v-app-bar-title>

    <v-spacer></v-spacer>
     <v-card min-height="50" width="500" class="d-flex justify-center my-2">
      <v-btn icon color="secondary">
        <v-icon>mdi-home-circle-outline</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon color="secondary">
        <v-icon>mdi-chat-outline</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon color="secondary">
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>
      </v-card>
    <v-spacer></v-spacer>
    <NavNotification />
      <SearchList/>
    <!-- <v-app-bar-action-item> -->
    <!-- </v-app-bar-action-item> -->
    <template v-slot:append>
      <NavMenu v-if="logged" />
      <v-btn v-else color="#0C134F" outlined :to="{ name: 'Login' }">Login</v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import NavMenu from './navbar/NavMenu.vue'
import NavNotification from './navbar/NavNotification.vue'
import SearchList from './navbar/SearchList.vue'
import { useAuthStore } from '@/store/auth'
import { storeToRefs } from 'pinia'


const authStore = useAuthStore();
const { logged } = storeToRefs(authStore);
</script>

<style>
.logo {
  transform: rotate(40deg);
  color: #0C134F;
  font-size: 50px !important;
}
</style>
