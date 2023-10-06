<script setup lang="ts">
import SettingsCard from "@/components/SettingsComponents/SettingsCard.vue"
import { useAuthStore } from "@/store/auth";
import { storeToRefs } from "pinia";

const { me } = storeToRefs(useAuthStore())
</script>

<template>
  <div class="settings">
    <v-alert v-if="me.id && !me.isSetup"  variant="outlined" title="Warning" color="warning" rounded="xl" >
      Your accout is not setup, please choose a unique username</v-alert>
    <SettingsCard/>
  </div>
</template>

<style lang="scss">

.settings {
  padding: 2rem;
  height: 100%;
  background-color: rgb(var(--v-theme-colorOne));
}

</style>

