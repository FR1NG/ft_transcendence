<script lang="ts" setup>
import { SearchedRoom } from '@/types/room';
import { ref } from 'vue';
import { useRoomStore } from '@/store/room'
import { useSnackBarStore } from '@/store/snackbar';

const roomStore = useRoomStore();
const snackBarStore = useSnackBarStore();
const appearance = ref(true);
const password = ref('');
const loading = ref(false);

const props = defineProps<{
  room: SearchedRoom
}>()


const emit = defineEmits(["close"])

const onClose = () => {
  emit('close');
}

const passwordError = ref('');

// api calls
const confirm = async () => {
  try {
    loading.value = true
    passwordError.value = '';
    const data: any = await roomStore.joinRoom(props.room.id, password.value);
    loading.value = false;
    // refetching the rooms list
    roomStore.getRooms()
    // showing the snackbar notification
    const message: string = data.message;
    snackBarStore.notify(message);
    // emiting the close event
    emit('close');
  } catch (error: any) {
    loading.value = false;
    passwordError.value = error.data?.message;
    console.log(error)
  }

}

</script>

<template>
  <v-dialog v-model="appearance" width="500" persistent>
    <v-card :loading="loading">
      <v-card-title>
        Join room
      </v-card-title>
      <v-card-subtitle>
        {{ room.name }}
      </v-card-subtitle>
      <v-card-text>
        <p class="mb-4 text-gray">are you sure you want to join room {{ room.name }} ?</p>
        <v-text-field label="password" type="password" v-model="password" :error="passwordError.length > 0" :error-messages="passwordError" variant="outlined" v-if="room.type === 'PROTECTED'" ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="onClose" color="secondary">cancel</v-btn>
        <v-btn @click="confirm" color="primary" variant="outlined" :loading="loading" >confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
