<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { ref, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { resetObject, assignObject } from '@/composables/helpers'
import { useSnackBarStore } from '@/store/snackbar'
import CustomCard from '@/components/CustomCard.vue'
import ProfileAvatar from './ProfileAvatar.vue'
import CustomDivider from '@/components/CustomDivider.vue'
import TwoFa from './TwoFa.vue'

const userStore = useUserStore();
const snackBarStore = useSnackBarStore();
const { loading } = storeToRefs(userStore);
const updating = ref(false);

const profile = reactive({
  avatar: "/images/defaultUserAvatar1.jpg",
  username: "",
  email: "",
  isOtpActivated: true,
});

const showPassword = ref(false)
const tfa = ref(false)

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
    tfa.value = true
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
    <CustomCard :loading="false" class="settingsWrapper">
      <v-card-title class="pageHeader">Settings</v-card-title>
      <v-form class="pa-4">
        <ProfileAvatar :link="profile.avatar" :update="getProfile" />
        <CustomDivider class="mainDivider" title="General Info" top="2"/>
        <v-text-field prepend-inner-icon="mdi-account-circle" class="ma-2" label="Username" variant="outlined" v-model="profile.username"
          :error="errors.username.length !== 0" :messages="errors.username" @keyup.enter="update" ></v-text-field>
        <v-text-field prepend-inner-icon="mdi-email" class="ma-2" label="Email" variant="outlined" v-model="profile.email"
          :error="errors.email.length !== 0" :messages="errors.email" @keyup.enter="update"></v-text-field>
        <CustomDivider title="2 Factor authentication"/>
        <TwoFa v-if="tfa" :user="profile"/>
        <v-card-actions>
          <v-btn class="update" :disabled="updating" :loading="updating" color="rgb(var(--v-theme-colorTwo)" variant="outlined" @click="update">Update</v-btn>
        </v-card-actions>
      </v-form>
    </CustomCard>
</template>

<style lang="scss">

.settingsWrapper {
  color: rgb(var(--v-theme-colorTwo));
  margin-top: 2rem;
  padding: 2rem;
}

.pageHeader {
  font-size: 2rem;
}


.mainDivider {
  margin-top: 4rem;
}

.switch {
  margin-left: 0.5rem;
  font-size: 1.5rem;
}

.update {
  position:absolute;
  right: 5%;
  margin: 2rem;
  margin-bottom: 0;
  color: rgb(var(--v-theme-colorTwo));
  border: 1px solid rgb(var(--v-theme-colorTwo));
}

</style>

