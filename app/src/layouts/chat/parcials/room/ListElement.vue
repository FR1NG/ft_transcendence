<script lang="ts" setup>
import type { UserRoom, Room } from '@/types/room'
import { useRoomStore } from '@/store/room';

const roomStore = useRoomStore();
const props = defineProps<{
  rooms: UserRoom[]
}>();

const iconColor = (role: string): String => {
  switch (role) {
    case 'ADMIN':
      return 'light-green-accent-3'
    case 'OWNER':
      return 'amber-lighten-1'
    default:
      return 'light-blue-darken-1'
  }
}

const getIcon = (role: string): String => {
  switch (role) {
    case 'ADMIN':
      return 'mdi-shield-edit-outline'
    case 'OWNER':
      return 'mdi-shield-crown-outline'
    default:
      return 'mdi-shield-account-outline'
  }
}


// room settings
const roomSettings = (room: UserRoom) => {
  roomStore.showSettings(room);
}

</script>


<template>

      <v-list-item  v-for="room in rooms" :key="room.room.id" link>
        {{ room.room.name}}
        <template v-if="room.role !== 'USER'" v-slot:prepend>
          <v-icon :color="iconColor(room.role)">
            {{ getIcon(room.role) }}
          </v-icon>
        </template>

        <template v-slot:append>

          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon flat>
                <v-icon icon="mdi-dots-vertical"> </v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-list>
                <v-list-item @click="roomSettings(room)">
                  setting
                </v-list-item>
                <v-list-item>
                  setting two
                </v-list-item>
                <v-list-item>
                  setting three
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </template>
      </v-list-item>
</template>

