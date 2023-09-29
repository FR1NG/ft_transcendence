<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from '@/plugins/axios'
import { useAuthStore } from '@/store/auth';
import { storeToRefs } from 'pinia';
import { pushNotify } from '@/composables/simpleNotify';

const dialog = ref(false);
const loading = ref(false);
const avatar = ref();
const transparent = 'rgba(255, 255, 255, 0)';
const { me } = storeToRefs(useAuthStore());

const props = defineProps({
  link: String,
  update: {
    type: Function,
    required: true,
  },
});

const showInput = ref(true);
const chooseddAvatar = ref('');


const pics = ref ([
  {
    name: "po",
    path: "/images/avatars/po.jpg",
    clicked: false,
  },
  {
    name: "tigress",
    path: "/images/avatars/tigress.jpg",
    clicked: false,
  },
  {
    name: "crane",
    path: "/images/avatars/crane.jpg",
    clicked: false,
  },
  {
    name: "mantis",
    path: "/images/avatars/mantis.jpg",
    clicked: false,
  },
  {
    name: "monkey",
    path: "/images/avatars/monkey.jpg",
    clicked: false,
  },
  {
    name: "master shifu",
    path: "/images/avatars/shifu.jpg",
    clicked: false,
  },
  {
    name: "tai lung",
    path: "/images/avatars/taiLung.jpg",
    clicked: false,
  },
])



const handleSubmit = async () => {
  const data = new FormData();
  loading.value = true
  if(chooseddAvatar.value.length > 0) {
    data.append('pickedAvatar', chooseddAvatar.value);
  } else {
    data.append('avatar', avatar.value[0]);
  }
  try {
    const result = await axios.post('/user/avatar', data);
    callback(result);
  } catch (error) {
      loading.value = false;
  }
}

const callback = async (response: any) => {
  loading.value = false;
  dialog.value = false;
  await props.update();
  avatar.value = null;
  if(response.data.message) {
    pushNotify({status:'info', title:'Action status', text:response.data.message})
  }
}



const changechooseddAvatar = (pic: { name:string, path: string, clicked:boolean}) =>{
  const index = pics.value.findIndex(el => el.path === pic.path);
  if(pic.path === chooseddAvatar.value) {
    chooseddAvatar.value = '';
    pics.value[index].clicked = false;
  }
  else {
    chooseddAvatar.value = pic.path
    pics.value[index].clicked = true;
    avatar.value[0] = "";
  }
}

watch(() => chooseddAvatar.value,(newValue: string, oldValue: string) => {
  if (newValue?.length > 0) {
    showInput.value = false;
    if (oldValue?.length > 0 && oldValue !== newValue) {
      const index = pics.value.findIndex(el => el.path === oldValue);
      pics.value[index].clicked = false;
    }
  }
  else {
    showInput.value = true;

  }
})


</script>

<template>
    <v-card  elevation="0" color="transparent">
      <div class="avatarPic">
        <img class="pic" :src="me.avatar" alt="Avatar image">
        <v-btn @click="dialog = !dialog" variant="text" class="changePic"
        color="gray" small icon="mdi-image-edit"></v-btn>
      </div>
      </v-card>
    <v-row justify="center">
      <v-form @submit.prevent="handleSubmit" :disabled="loading">
        <v-dialog overlay-color="red" overlay-opacity="1" v-model="dialog" persistent width="500" backgound="red">
          <v-card color="rgb(var(--v-theme-colorTwo))">
            <v-card-title> Update avatar </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col clos="12">
                    <v-file-input v-if="showInput" accept="image/png, image/jpeg, image/bmp" placeholder="Pick an avatar"
                      prepend-icon="mdi-camera" label="upload" v-model="avatar"></v-file-input>
                  </v-col>
                </v-row>
                <v-row>
                  <button v-for="pic in pics" @click="changechooseddAvatar(pic)">
                    <img class="chooseAvatar"  :class="pic.clicked ? `active-avatar` : ``" :src="pic.path" :alt="pic.name"   >
                  </button>
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
  background-color: rgb(var(--v-theme-colorThree));
}

.pic:hover ~ .changePic,
.changePic:hover {
  opacity: 1;
}
.chooseAvatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 0 6px;
  opacity: 0.7;
}

.active-avatar {
  transform: scale(1.5);
  border: 2px solid rgb(var(--v-theme-colorThree));
  opacity: 1;
}
.chooseAvatar:hover {
  transform: scale(1.5);
  opacity: 1;
}

</style>
