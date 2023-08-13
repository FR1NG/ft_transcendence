<script setup lang="ts">
import { ref } from 'vue';
import axios from '@/plugins/axios'
import { useSnackBarStore } from '@/store/snackbar';

const snackBarStore = useSnackBarStore();
const dialog = ref(false);
const loading = ref(false);
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
  loading.value = true
  const data = new FormData();
  data.append('avatar', avatar.value[0]);
  try {
    const result = await axios.post('/user/avatar', data);
    callback(result);
  } catch (error) {
    console.log(error)
    loading.value = false;
  }
}

const callback = async (response: any) => {
  loading.value = false;
  dialog.value = false;
  await props.update();
  avatar.value = null;
  if(response.data.message) {
    snackBarStore.notify(response.data.message);
  }
}
</script>

<template>
    <v-card elevation="0">
      <div class="avatarPic">
        <img class="pic" :src="link" alt="">
        <v-btn @click="dialog = !dialog" variant="text" class="changePic"
        color="gray" small icon="mdi-image-edit"></v-btn>
      </div>
      </v-card>
    <v-row justify="center">
      <v-form @submit.prevent="handleSubmit" :disabled="loading">
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
              <v-btn type="submit" @click="handleSubmit" :loading="loading">
                update
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn type="submit" @click="dialog=false">
                cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-form>
    </v-row>
</template>


<style scoped>

.avatarPic {
  position: relative;
}

.pic {
  width: 100px;
  border-radius: 50px;
}

.changePic {
  position: absolute;
  bottom: 0;
  left: 75px;
  opacity: 0;
  transition: 0.5s;
  background-color: lightgray;
}

.pic:hover ~ .changePic,
.changePic:hover {
  opacity: 1;
}

</style>
