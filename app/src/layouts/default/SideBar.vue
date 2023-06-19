<template>
    <v-navigation-drawer
    class='nav'
    permanent
    v-model='drawer'
    :rail='rail'
    @click='rail = !rail'
  >
    <v-list v-for='item in items'>
    <v-list-item :prepend-icon='item.icon' :title='item.title' :value='item.value'>
    </v-list-item>
    </v-list>
    </v-navigation-drawer>

</template>

<script lang="ts">
import { ref } from 'vue';


export default {
  setup() {
    let drawer = ref(true);
    let rail = ref(false);
    const items = [
      {title: 'games', value: 'games', icon: 'mdi-controller'},
      {title: 'chat', value: 'chat', icon: 'mdi-chat-outline'},
      {title: 'games', value: 'games', icon: 'mdi-table-tennis'},
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
