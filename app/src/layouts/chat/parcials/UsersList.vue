<script lang="ts" setup>
import type { User } from '@/types/user'
import UserSearch from '@/components/ProfileComponents/search/UserSearch.vue';

defineProps<{
  users: User[]
}>();
</script>

<template>
  <v-list>
    <v-list-item>
      <user-search>
        <template v-slot:items="{users}">
          <v-list-item
            v-for="user in users"
            :key="user.id"
            :prepend-avatar="user.avatar"
            :title="user.username"
            :subtitle="user.email"
            :to="{name: 'Dm', params: {id: user.id}}"
          >
          </v-list-item>
        </template>
      </user-search>
    </v-list-item>
    <v-divider></v-divider>
    <v-list-item v-for='user in users' :key="user.id" :title="user.username" :prependAvatar="user.avatar"
      :to="{ name: 'Dm', params: { id: user.id } }" :value='user.username'>
      <v-badge dot :color="user.isOnline ? `success` : `secondary`" inline>
      </v-badge>
    </v-list-item>
  </v-list>
</template>
