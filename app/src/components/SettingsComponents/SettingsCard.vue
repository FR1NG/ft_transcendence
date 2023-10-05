<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { ref, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { resetObject, assignObject } from '@/composables/helpers'
import { pushNotify } from '@/composables/simpleNotify'
import { useAuthStore } from '@/store/auth'
import CustomCard from '@/components/CustomCard.vue'
import ProfileAvatar from './ProfileAvatar.vue'
import CustomDivider from '@/components/CustomDivider.vue'
import TwoFa from './TwoFa.vue'
import Theme from './Theme.vue'


const userStore = useUserStore();
const { me } = storeToRefs(useAuthStore());
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
    if(!me.value.id)
      await useAuthStore().getMe();
    assignObject(me.value, profile);
    tfa.value = true
  } catch (error) {
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
    pushNotify({status:'success', title:'Action completed', text:response.message || 'updated'})
  } catch (error: any) {
    // assignin valiation errors to errors object
    console.log(error);
    pushNotify({status:'error', title:'error', text:error?.message})
    assignObject(error.errors, errors);
    updating.value = false;
  }
}
</script>

<template>
    <CustomCard :loading="false" class="settingsWrapper">
      <v-card-title class="text-h3">Settings</v-card-title>
      <v-form class="pa-4">
        <ProfileAvatar :link="profile.avatar" :update="getProfile" />
        <CustomDivider class="mt-8" title="General Info" top="2"/>
        <v-text-field prepend-inner-icon="mdi-account-circle" class="ma-2" label="Username" variant="outlined" v-model="profile.username"
          :error="errors.username.length !== 0" :messages="errors.username" @keyup.enter="update" ></v-text-field>
        <v-text-field prepend-inner-icon="mdi-email" class="ma-2" label="Email" variant="outlined" v-model="profile.email"
          :error="errors.email.length !== 0" :messages="errors.email" @keyup.enter="update"></v-text-field>
        <CustomDivider title="2 Factor authentication"/>
        <TwoFa v-if="tfa" :user="profile"/>
        <CustomDivider title="Theme" top="2"/>
        <theme/>
        <v-card-actions class="d-flex justify-end">
          <v-btn class="update" :disabled="updating" :loading="updating" color="colorTwo" variant="outlined" @click="update">Update</v-btn>
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
</style>

