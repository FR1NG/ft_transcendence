<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <v-icon icon="logo mdi-table-tennis" />
      otossa
    </v-app-bar-title>
    <v-app-bar-action-item>
      <SearchList/>
    </v-app-bar-action-item>
    <template v-slot:append>
      <NavMenu v-if="logged" />
      <v-btn v-else color="#0C134F" outlined :to="{ name: 'Login' }">Login</v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import NavMenu from './navbar/NavMenu.vue'
import SearchBar from './navbar/SearchBar.vue'
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
