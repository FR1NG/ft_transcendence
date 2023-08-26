<script lang="ts" setup>
import type { User } from '@/types/user'

const props = defineProps<{
  users: User[]
}>();
</script>

<template>
  <v-list>
    <v-list-item v-for='user in users' :key="user.id" :title="user.username" :prependAvatar="user.avatar"
      :to="{ name: 'Dm', params: { id: user.id } }" :value='user.username'>
      <v-badge dot :color="user.isOnline ? `success` : `secondary`" inline>
      </v-badge>
    </v-list-item>
  </v-list>
</template>
