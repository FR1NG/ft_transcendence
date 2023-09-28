<script lang="ts" setup>
import { ref, watch, reactive } from 'vue'
import { useRoomStore } from '@/store/room'
import { CreateRoomDto } from '@/types/room';
import { assignObject, resetObject } from '@/composables/helpers';
import { pushNotify } from '@/composables/simpleNotify';

const roomStore = useRoomStore()

const dialog = ref(false)
const types = ref([
  'PUBLIC',
  'PROTECTED',
  'PRIVATE'
]);

const showPassword = ref(false)
const form = reactive<CreateRoomDto>({
  name: '',
  type: 'PUBLIC',
  password: ''
})

const errors = reactive({
  name: '',
  type: '',
  password: '',
});

watch(
  () => form.type,
  (newval) => {
    if (newval === 'PROTECTED')
      showPassword.value = true
    else {
      showPassword.value = false
      form.password = ''
    }
  },
  {
    deep: true
  });

const reset = () => {
  resetObject(form)
  form.type = 'PUBLIC';
}

// submit handler
const handleSubmit = async () => {
  resetObject(errors);
  roomStore.createRoom(form).then(result => {
    dialog.value = false;
    reset();
  }).catch(error => {
    assignObject(error.data.errors, errors);
  })
}
</script>

<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="500">
      <template v-slot:activator="{ props }">
        <v-list-item>
          <v-btn color="colorOne" v-bind="props" class="mx-2 pa-2">new</v-btn>
        </v-list-item>
      </template>
      <v-card rounded="xl" color="colorOne">
        <v-form @submit.prevent="handleSubmit">
          <v-card-title>
            <span class="text-h5">Create Room</span>
          </v-card-title>
          <v-card-text>
            <v-container>

              <v-row>
                <v-col cols="12">
                  <v-text-field label="Room name*" color="colorThree" variant="outlined" :error="errors.name.length > 0" :error-messages="errors.name" v-model="form.name"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select label="type" v-model="form.type" variant="outlined" color="colorThree" :items="types">
                  </v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-if="showPassword" label="Password*" variant="outlined" color="colorThree" :error="errors.password.length > 0" :error-messages="errors.password" v-model="form.password" type="password"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="colorTwo" variant="text" @click="dialog = false">
              Close
            </v-btn>
            <v-btn color="colorThree" variant="text" type="submit">
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>
