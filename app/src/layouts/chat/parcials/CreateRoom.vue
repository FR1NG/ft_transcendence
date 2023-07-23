<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoomStore } from '@/store/room'
import { CreateRoomDto } from '@/types/room';
import { storeToRefs } from 'pinia';

const roomStore = useRoomStore()
const dialog = ref(false)
const types = ref([
  'PUBLIC',
  'RROTECTED',
  'PRIVATE'
]);
const showPassword = ref(false)
const form = ref<CreateRoomDto>({
  name: '',
  type: 'PUBLIC',
  password: ''
})

watch(
  () => form.value?.type,
  (newval) => {
    if (newval === 'RROTECTED')
      showPassword.value = true
    else {
      showPassword.value = false
      form.value.password = ''
    }
  },
  {
    deep: true
  });

// submit handler
const handleSubmit = async () => {
   console.log(form.value);
  const response = await roomStore.createRoom(form.value);
}
</script>

<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="500">
      <template v-slot:activator="{ props }">
        <v-list-item class="pa-2">
          <v-btn v-bind="props" class="ma-2" density="compact" icon="mdi-plus">
          </v-btn>
        </v-list-item>
      </template>
      <v-card>
        <v-form @submit.prevent="handleSubmit">
          <v-card-title>
            <span class="text-h5">Create Room</span>
          </v-card-title>
          <v-card-text>
            <v-container>

              <v-row>
                <v-col cols="12">
                  <v-text-field label="Room name*" v-model="form.name"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select label="type" v-model="form.type" :items="types">
                  </v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-if="showPassword" label="Password*" v-model="form.password" type="password"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
              Close
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" type="submit">
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>
