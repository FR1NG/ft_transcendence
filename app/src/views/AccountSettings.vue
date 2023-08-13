<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { ref, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { resetObject, assignObject } from '@/composables/helpers'
import { useSnackBarStore } from '@/store/snackbar'
import ProfileAvatar from '@/components/ProfileAvatar.vue'
import customDivider from '@/components/customDivider.vue'

const userStore = useUserStore();
const snackBarStore = useSnackBarStore();
const { loading } = storeToRefs(userStore);
const updating = ref(false);

const profile = reactive({
  avatar: "",
  username: "",
  email: "",
  fa: false,
});

const showPassword = ref(false)

const errors = reactive({
  username: '',
  email: '',
  fa: '',
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

<template>
  <div class="card settingsPage">
    <h1 class="pageHeader">Settings</h1>
    <v-form class="pa-4">
      <ProfileAvatar :link="profile.avatar" :update="getProfile" />
      <customDivider class="mainDivider" title="General Info" top="2"/>
      <v-text-field prepend-inner-icon="mdi-account-circle" class="ma-2" label="Username" variant="outlined" v-model="profile.username"
        :error="errors.username.length !== 0" :messages="errors.username"></v-text-field>
      <v-text-field prepend-inner-icon="mdi-email" class="ma-2" label="Email" variant="outlined" v-model="profile.email"
        :error="errors.email.length !== 0" :messages="errors.email"
      ></v-text-field>
      <customDivider title="2 Factor authentication"/>
        <v-switch class="switch"
        prepend-icon="mdi-two-factor-authentication"
          v-model="profile.fa"
          hide-details
          :label="profile.fa ? `Enabled` : `Disabled`"
          @click="profile.fa = !profile.fa"
        ></v-switch>
      <v-card-actions>
        <v-btn class="update" :disabled="updating" :loading="updating" color="info" variant="outlined" @click="update">Update</v-btn>
      </v-card-actions>
    </v-form>
    </div>
</template>

<style lang="scss">

.pageHeader {
  padding: 2rem 0rem 0rem 2rem;
}

.card {
  margin: 1rem;
  border-radius: 25px;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
}

.mainDivider {
  margin-top: 4rem;
}

.generalInfo {
  display: grid;
  gap: 2rem;
} 

.profileImg {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.field {
  margin: 0 1rem;
}
.input {
  height: 10px;
  background-color: red;
  height: 3rem;
  border: 2px solid black;
  border-radius: 15px;
}

.switch {
  margin-left: 2rem;
}

.update {
  left: 50%;
  margin-top: 2rem;
  position:absolute;
}

.valid {
  border: 2px solid aqua;
}
.invalid {
  border-color: red;
}

</style>

