<script setup lang="ts">
import CustomDivider from '@/components/CustomDivider.vue'
import { useRoomStore } from '@/store/room';
import { RoomType, Room } from '@/types/room';
import { reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { assignObject, resetObject } from '@/composables/helpers';

// defining props
const props = defineProps<{
  room: Room
}>()

// defining emits
const emit = defineEmits(['update']);

const roomStore = useRoomStore();
const route = useRoute();
const id = route.params.id as string;
const types = ['PUBLIC', 'PROTECTED', 'PRIVATE'];
const showpass = ref(false);
const showActions = ref(false);
let changeState = false;
const loading = ref(false);


const form = reactive({
  name: '',
  type: 'PUBLIC' as RoomType,
  password: '',
  oldPassword: '',
})

const init = () => {
  form.name = props.room.name;
  form.type = props.room.type || 'PUBLIC';
  if(form.type === 'PROTECTED')
    showpass.value = true;
}

// watching form change to chow actions
watch(() => form, () => {
 if(!changeState)
  changeState = true;
else {
    showActions.value = true;
    console.log('changing the state')
  }
},
{ deep: true}
)

// watching type change to show password
watch(() => form.type, (newval) => {
  if (newval === 'PROTECTED')
    showpass.value = true;
  else {
    showpass.value = false;
    form.oldPassword = '';
    form.password = '';
  }
});


init();

const update = async () => {
  loading.value = true;
  resetObject(errors);
  try {
    const result = await roomStore.updateRoom(id, form);
    loading.value = false;
    emit('update');
  } catch (error: any) {
    loading.value = false;
    assignObject(error.data.errors, errors);
  }
}

const errors = reactive({
  name: '',
  type: '',
  password: '',
  oldPassword: ''
});

</script>

<template>
  <v-form class="ma-4" @submit.prevent="update">
    <custom-divider title="Edit room"></custom-divider>
    <v-row>
      <v-col cols="12">
        <v-text-field label="Name" :error-messages="errors.name" variant="outlined" v-model="form.name"></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-select :items="types" :error-messages="errors.type" v-model="form.type" variant="outlined">
        </v-select>
      </v-col>
    </v-row>
    <v-expand-transition>
    <div  v-if="showpass">
      <custom-divider title="Change password"></custom-divider>
      <v-row>
        <v-col cols="12">
          <v-text-field label="Old Password" :error-messages="errors.oldPassword" variant="outlined" v-model="form.oldPassword"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field label="New Password" :error-messages="errors.password" variant="outlined" v-model="form.password"></v-text-field>
        </v-col>
      </v-row>
    </div>
    <div v-else></div>
    </v-expand-transition>
    <v-expand-transition>
      <div v-if="showActions">
        <v-btn variant="text" class="mx-2">reset</v-btn>
        <v-btn variant="outlined" class="mx-2" color="primary" type="submit" :loading="loading">update</v-btn>
      </div>
    </v-expand-transition>
  </v-form>
</template>
