<script setup>
import { ref } from 'vue'

const menu = ref(false);

</script>


<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      location="bottom"
      offset="5"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon>
          <v-icon class="notification-icon">mdi-bell-outline</v-icon>
        </v-btn>
      </template>
      <v-card min-width="300" min-height="70">
        <v-list>
          <v-list-item
            v-for="notification in 5"
            :key="notification"
            :title="`test ${notification}`"
            subtitle="you have recieved a friend request from otossa"
          >
            <!-- <template v-slot:append> -->
            <!--   <v-btn -->
            <!--     variant="text" -->
            <!--     icon="mdi-account-plus-outline" -->
            <!--   ></v-btn> -->
            <!-- </template> -->
          </v-list-item>
        </v-list>
        <!-- <v-list v-else> -->
        <!--   <v-list-item v-if="!searchLoader" title="no result"></v-list-item> -->
        <!-- </v-list> -->
      </v-card>
    </v-menu>
  </div>
</template>

<style>
.notification-icon {
  rotate: 45%;
}

</style>
