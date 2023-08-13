<template>
  <v-navigation-drawer class='nav' permanent elevation="0" border="0" v-model='drawer' :rail="rail">
    <v-list-item prepend-icon="mdi-dotes" title='close' @click="rail = !rail"></v-list-item>
    <v-list v-for='item in items' :key="item.title">
      <v-list-item :prepend-icon='item.icon' :title='item.title' :to="{name: item.link}" :value='item.value'>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { ref } from 'vue';


export default {
  setup() {
    let drawer = ref(true);
    let rail = ref(true);
    const items = [
      { title: 'chat', link: 'Chat',value: 'chat', icon: 'mdi-chat-outline' },
      // { title: 'games', link: 'Home', value: 'games', icon: 'mdi-controller' },
      // { title: 'games', link: 'Home', value: 'games', icon: 'mdi-table-tennis' },
    ]
    return {
      drawer,
      rail,
      items
    }
  }
}
</script>

<style>
.nav {
  background: '#282043';
}
</style>
