<script setup lang="ts">
import { ref } from 'vue';
import { useRoomStore } from '@/store/room';

const props = defineProps<{
  roomId: String,
  userId: String
  username: String
}>()

const loading = ref(false);
const emit = defineEmits(['close'])

const roomStore = useRoomStore();

const time = ref(5);

const mute = async () => {
  loading.value = true;
  try {
    await roomStore.muteUser(props.roomId, props.userId, time.value);
  } catch (error: any) {
    console.log(error.data.message)
  }
  loading.value = false;
  emit('close')
}

const close = () => {
  emit('close');
}

</script>

<template>
  <v-dialog :model-value="true" persistent width="200">
    <v-card :loading="loading" class="pa-4" color="colorOne" rounded="xl">
      <v-form @submit.prevent="mute">
        <v-card-title>Muting {{ username }}</v-card-title>
        <v-card-text>
          <v-radio-group v-model="time">
            <v-radio label="5 min" color="red" :value="5"></v-radio>
            <v-radio label="10 min" color="red" :value="10"></v-radio>
            <v-radio label="15 min" color="red" :value="15"></v-radio>
            <v-radio label="30 min" color="red" :value="30"></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="close">cancel</v-btn>
          <v-btn type="submit">mute</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
