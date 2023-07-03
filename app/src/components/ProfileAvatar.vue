<template>
  <v-container class="pa-4 text-center">
    <v-row class="fill-height" align="center" justify="start">
      <v-col cols="12" md="4">
        <v-hover v-slot="{ isHovering, props }">
          <v-card rounded="circle" elevation="0" :class="{ 'on-hover': !isHovering }" v-bind="props">
            <v-avatar cover size="100">
              <v-img :src="link">
                <div class="align-self-right">
                  <v-btn @click="dialog = !dialog" variant="text" :class="{ 'show-btns': isHovering }"
                    :color="transparent" icon="mdi-image-edit"></v-btn>
                </div>
              </v-img>
            </v-avatar>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-form @submit.prevent="handleSubmit">
        <v-dialog v-model="dialog" persistent width="500" backgound="red">
          <v-card>
            <v-card-title>
              <span class="text-h5">Update Avatar</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col clos="12">
                    <v-file-input accept="image/png, image/jpeg, image/bmp" placeholder="Pick an avatar"
                      prepend-icon="mdi-camera" label="Avatar" v-model="avatar"></v-file-input>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit" @click="handleSubmit">
                update
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-form>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from '@/plugins/axios'

const dialog = ref(false);
const avatar = ref();
const transparent = 'rgba(255, 255, 255, 0)';

const props = defineProps({
  link: String,
  update: {
    type: Function,
    required: true,
  },
});

const handleSubmit = async () => {
  const data = new FormData();
  data.append('avatar', avatar.value[0]);
  try {
    const result = await axios.post('/user/avatar', data);
    props.update();
    callback(result);
  } catch (error) {
    console.log(error)
  }
}

const callback = (data: {}) => {
  console.log(data)
}
</script>

<style scoped>
.v-card {
  transition: opacity .4s ease-in-out;
}

.v-card:not(.on-hover) {
  opacity: 0.6;
}

.show-btns {
  color: rgba(255, 255, 255, 1) !important;
}
</style>
