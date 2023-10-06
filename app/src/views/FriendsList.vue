<script setup lang="ts">
    import { useFriendsStore } from '@/store/friends'
    import { storeToRefs } from 'pinia'
import { ref } from 'vue';

    const friendsStore = useFriendsStore();
    const { friends } = storeToRefs(friendsStore);
    const loader = ref(true);


    friendsStore.getFriends().then(() => {
      loader.value = false;
    }).catch(() => {
        loader.value = false;
      });

</script>

<template>
    <div class="listWrapper">
    <v-table class="matchesTable" :loading="loader" theme="dark">
      <thead>
        <tr>
          <th class="text-left">
            Friend
          </th>
          <th class="text-center">
            Status
          </th>
          <th class="text-right">
            Profile
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="friend in friends" :key="friend.id">
          <td>
            <v-list-item :prepend-avatar="friend.avatar">{{ friend.username }}</v-list-item>
          </td>
          <td>
            <v-list-item>{{ friend.status }}</v-list-item>
          </td>
          <td>
            <v-list-item :to="{name: 'UserProfile', params: {username: friend.username}}">view profile</v-list-item>
          </td>
        </tr>
      </tbody>
    </v-table>
    </div>
</template>

<style lang="scss">

.listWrapper {
    background-color: rgb(var(--v-theme-colorOne));
    height: 100%;
    width: 100%;
    padding: 2rem;
}

</style>
