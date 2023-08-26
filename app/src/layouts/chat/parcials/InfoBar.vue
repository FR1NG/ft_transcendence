<script lang="ts" setup>
import type { User } from '@/types/user'
import type { Room } from '@/types/room'
import { useRoomStore } from '@/store/room'

const roomStore = useRoomStore();

const props = defineProps<{
  user: User | undefined
  room: Room | undefined
  type: 'dm' | 'room'
}>()

const emit = defineEmits(['click:menu'])

const toggle = () => {
  emit('click:menu');
}

const handleRoomClick = () => {
  if(props.room)
    roomStore.showSettings(props.room.id);
}
</script>

<template>
    <v-app-bar class="px-3" color="colorTwo" elevation="4" flat height="72">
      <v-btn icon="mdi-menu" color="colorOne" @click="toggle"></v-btn>
      <v-badge v-if="type === 'dm' && user" dot :color="user.isOnline ? `success` : `secondary`" inline>
        <v-list-item v-if="user.username" color="primary" :title="user.username"
          :prependAvatar="user.avatar" :to="{ name: 'UserProfile', params: { username: user.username } }"
          :value='user.username'>
        </v-list-item>
      </v-badge>
      <v-badge color="colorThree" v-else-if="type === 'room' && room">
         <v-list-item :title="room.name" prepend-icon="mdi-account-group-outline"  @click="handleRoomClick">
          <v-spacer></v-spacer>
        </v-list-item>
      </v-badge>
      <v-spacer></v-spacer>

    </v-app-bar>
</template>
