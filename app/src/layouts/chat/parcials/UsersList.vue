<script lang="ts" setup>
import type { User } from '@/types/user'
import UserSearch from '@/components/ProfileComponents/search/UserSearch.vue';

type Element = {
  user: User,
  unseen: Array<string>
}

defineProps<{
  users: Element[]
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
    <v-list-item v-for='element in users' :key="element.user.id" :title="element.user.username" :prependAvatar="element.user.avatar"
      :to="{ name: 'Dm', params: { id: element.user.id } }" :value='element.user.username'>
      <v-badge dot :color="element.user.isOnline ? `success` : `secondary`" inline>
      </v-badge>
      <template v-slot:append v-if="element.unseen.length > 0">
        <v-badge :content="element.unseen.length" color="red"></v-badge>
      </template>
    </v-list-item>
  </v-list>
</template>
