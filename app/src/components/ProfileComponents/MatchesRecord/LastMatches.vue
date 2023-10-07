<script setup lang="ts">
import CustomCard from '@/components/CustomCard.vue';
import { User } from '@/types/user';

defineProps<{user: User, loading: Boolean}>()
</script>

<template>
  <CustomCard class="matchesWrapper" :loading="loading">
    <h2 class="matchesHeader">Last matches</h2>
    <v-table class="matchesTable" theme="dark">
      <thead class="pa-4">
        <tr>
          <th class="text-left">
            <span class="inv-points">....</span>host
          </th>
          <th class="text-center">
            result
          </th>
          <th class="text-right">
            guest<span class="inv-points">..</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="game in user.games" :key="game.id">
          <td>
            <v-list-item  class="elip" lines="one" :to="{name: 'UserProfile', params: {username: game.host.username}}" :active="false" :prepend-avatar="game.host.avatar">
              {{ game.host.username }}
            </v-list-item>
          </td>

          <td class="text-center">{{ game.winnerId === game.host.id ? `${game.winnerScore} - ${game.loserScore}` : `${game.loserScore} - ${game.winnerScore}`}}</td>
          <td>
            <v-list-item class="text-right" lines="one" :to="{name: 'UserProfile', params: {username: game.guest.username}}" :active="false" :append-avatar="game.guest.avatar">
              {{ game.guest.username }}
            </v-list-item>
          </td>
        </tr>
      </tbody>
    </v-table>
  </CustomCard>
</template>

<style lang="scss">
.matchesWrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 600px;
  overflow: hidden;
  // min-width: 400px !important;

  .matchesHeader {
    padding-top: 0.5rem;
    color: rgb(var(--v-theme-two));
  }

  .matchesTable {
    width: 100%;
    height: 85%;
    background-color: transparent;
    overflow-y: hidden;
    margin-right: 15px;
  }

  .matchesTable:hover {
    overflow-y: scroll;
  }

  .matchesTable::-webkit-scrollbar {
    display: block;
  }

  .matchesTable::-webkit-scrollbar {
    width: 4px;
  }

  .matchesTable::-webkit-scrollbar-track {
    background-color: black;
    border-radius: 25px;
  }

  .matchesTable::-webkit-scrollbar-thumb {
    background-color: rgb(var(--v-theme-colorTwo));
    width: 20px;
    border-radius: 25px;
  }
}
.v-list-item__content {
  text-wrap: nowrap;
  text-overflow: ellipsis;
}

.inv-points {
  opacity: 0;
}
</style>
