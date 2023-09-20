<script lang="ts">
import { useUserStore } from '@/store/user'
import { useAuthStore } from '@/store/auth'
import { computed } from 'vue'
import { storeToRefs } from 'pinia';

  export default {
    data: () => ({
      fav: true,
      menu: false,
      message: false,
      hints: true,
    }),
    setup() {

      const userStore = useUserStore();
      const authStore = useAuthStore();
      const { me } = storeToRefs(authStore);
    const logout = () => {
      authStore.logout();
    }
      return {
      // profile,
      logout,
      me
    }
    }
  }
</script>

<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      location="end"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          color="indigo"
          v-bind="props"
        >
          <v-avatar size="40" :image="me.avatar">
          </v-avatar>
        </v-btn>
      </template>

      <v-card min-width="250">
        <v-list>
          <v-list-item
            :prepend-avatar="me.avatar"
            :title="me.username"
          >
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>

          <v-list-item :to="{name: 'UserProfile', params: { username: me.username}}">
            Profile
          </v-list-item>
          <v-list-item :to="{name: 'Settings'}">
            Settings
          </v-list-item>

          <v-list-item @click="logout">
            logout
          </v-list-item>

        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>
