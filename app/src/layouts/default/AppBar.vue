<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <v-icon icon="logo mdi-table-tennis" />
      otossa
    </v-app-bar-title>
     <template v-slot:append>
      <v-btn color="#0C134F" outlined href="#">login with intra</v-btn>
        </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
  //
</script>

<style>
.logo {
  transform: rotate(40deg);
  color: #0C134F;
  font-size: 50px !important;
}
</style>
