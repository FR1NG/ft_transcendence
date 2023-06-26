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
          <v-avatar size="40" :image="profile.avatar">
          </v-avatar>
        </v-btn>
      </template>

      <v-card min-width="250">
        <v-list>
          <v-list-item
            :prepend-avatar="profile.avatar"
            :title="profile.username"
          >
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item :to="{name: 'Profile'}">
            Profile
          </v-list-item>

          <v-list-item>
            Settings
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
import { useUserStore } from '@/store/user'
import { computed } from 'vue'
  export default {
    data: () => ({
      fav: true,
      menu: false,
      message: false,
      hints: true,
    }),
    setup() {
      const userStore = useUserStore();
      const profile = computed({
      get() { return userStore.profile },
      set(value) { userStore.profile = value }
    })

      return {
      profile
    }
    }
  }
</script>
