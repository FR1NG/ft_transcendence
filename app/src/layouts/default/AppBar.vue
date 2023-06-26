<template>
  <v-app-bar flat> <v-app-bar-title>
    <v-icon icon="logo mdi-table-tennis" /> otossa </v-app-bar-title>
    <template v-slot:append >
      <NavMenu v-if="logged" />
      <v-btn v-else color="#0C134F" outlined :href="login_url">login with intra</v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import NavMenu from './NavMenu.vue'
import { computed } from 'vue';
import { useAuthStore } from '@/store/auth'
const login_url = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-2ebd9b965b96081e9d4ab5fac11a7d995823306995f0f9eb23e3b1516ef4b9b2&redirect_uri=https%3A%2F%2Fgame.hchakoub.codes%2Flogin&response_type=code"
const authStore = useAuthStore();
const logged = authStore.getLogged;
</script>

<style>
.logo {
  transform: rotate(40deg);
  color: #0C134F; font-size: 50px !important;
}
</style>
