<script setup lang="ts">
    import { useUserStore } from '@/store/user'
    import { storeToRefs } from 'pinia'

    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);
</script>

<template>
    <div class="listWrapper">
    <v-table class="matchesTable" theme="dark">
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
        <tr v-for="friend in user.friends" :key="friend.id">
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