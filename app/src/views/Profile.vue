<template>
  <v-card class="ma-4" :loading="loading" rounded="xl">
    <v-form class="pa-4">
      <ProfileAvatar :link="profile.avatar" :update="getProfile" />
      <v-text-field class="ma-2" label="Username" variant="outlined" v-model="profile.username"
        :error="errors.username.length !== 0" :messages="errors.username"></v-text-field>
      <v-text-field class="ma-2" label="Email" variant="outlined" v-model="profile.email"
        :error="errors.email.length !== 0" :messages="errors.email"
      ></v-text-field>
      <v-card-actions>
        <v-btn :disabled="updating" :loading="updating" color="info" variant="outlined" @click="update">Update</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { resetObject, assignObject } from '@/composables/helpers'
import { useSnackBarStore } from '@/store/snackbar'
import ProfileAvatar from '@/components/ProfileAvatar.vue'

const userStore = useUserStore();
const snackBarStore = useSnackBarStore();
const { loading } = storeToRefs(userStore);
const updating = ref(false);

const profile = reactive({
  avatar: "",
  username: "",
  email: "",
});

const errors = reactive({
  username: '',
  email: '',
});

// getting profile
const getProfile = async () => {
  // removing old errors
  resetObject(errors);
  try {
    const data = await userStore.getProfile();
    assignObject(data, profile);
  } catch (error) {
    console.log(error)
  }
}

// getting the profile data
getProfile();

// update profile function
const update = async () => {
  // removing old validation errors
  resetObject(errors);
  updating.value = true;
  const { username, email } = profile;
  try {
    const response = await userStore.updateProfile({ username, email })
    updating.value = false;
    snackBarStore.notify(response.message || 'Updated')
  } catch (error: any) {
    // assignin valiation errors to errors object
    snackBarStore.notify(error.message || 'Error')
    assignObject(error.errors, errors);
    updating.value = false;
  }
}
</script>
