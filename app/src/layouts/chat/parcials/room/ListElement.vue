<script lang="ts" setup>
import type { UserRoom, Room } from '@/types/room'
import { useRoomStore } from '@/store/room';
import { iconColor, getIcon } from '@/composables/room'

const roomStore = useRoomStore();
const props = defineProps<{
  rooms: UserRoom[]
}>();



// room settings
const roomSettings = (room: UserRoom) => {
  // roomStore.showSettings(room);
}

</script>


<template>

  <v-list-item  v-for="room in rooms" :key="room.room.id" link :to="{name : 'Room', params: { id: room.room.id } }">
        {{ room.room.name}}
        <template v-slot:prepend>
          <v-icon :color="iconColor(room.role)">
            {{ getIcon(room.role) }}
          </v-icon>
        </template>
      </v-list-item>
</template>

