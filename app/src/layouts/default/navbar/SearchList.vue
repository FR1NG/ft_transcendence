
<script setup lang="ts">
import SearchBar from './SearchBar.vue'
import { storeToRefs } from 'pinia';
import {useUserStore } from '@/store/user'
import { reactive } from 'vue'

const userStore = useUserStore();
const { searchedUsers, isUserSerched } = storeToRefs(userStore);

const data = reactive({
  loaded : false,
  menu: true,
})
</script>

<template>
  <div class="text-center">
    <v-menu
      v-model="isUserSerched"
      location="bottom"
      :open-on-click="false"
      :close-on-click="false"
      offset="5"
    >
      <template v-slot:activator="{ props }">
        <SearchBar :binds="props"/>
      </template>
      <v-card min-width="300">
        <v-list>
          <v-list-item
            v-for="user in searchedUsers"
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
        </v-list>
        <v-divider></v-divider>
      </v-card>
    </v-menu>
  </div>
</template>
