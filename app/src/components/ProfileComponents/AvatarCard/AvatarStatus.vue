<script setup lang="ts">
import CustomCard from '@/components/CustomCard.vue';
import OnOffStatus from './OnOffStatus.vue';
import UserInteract from './Request.vue'
import type { User, Me } from '@/types/user'

defineProps<{ user: User, loading: Boolean, me: Me }>()

</script>



<template>
  <CustomCard :loading="loading" class="statusWrapper">
    <v-row>
      <v-col cols="6" sm="3" class="d-flex justify-center">
        <v-card width="100%" max-height="150px" class="ma-3 status-container" rounded="xl">
          <v-img height="100%" :src="user.avatar" cover>
          </v-img>
            <OnOffStatus v-if="user" class="status" :isOnline="user.isOnline" :avatar="user.avatar" />
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <div class="friendsCount">
          <h4 class="username"> {{ user.username }} </h4>
          <v-chip class="ms-2 text-medium-emphasis" color="colorTwo" prepend-icon="mdi-account-multiple" size="small"
            variant="flat"> {{ user.friendsCount.toString() }} friends</v-chip>
        </div>
      </v-col>
      <v-col cols="12" sm="6">
        <UserInteract v-if="user.id !== me.id" :user="user" />
      </v-col>

    </v-row>
  </CustomCard>
</template>

<style lang="scss">
button.v-btn.v-btn--icon.v-theme--light.v-btn--density-comfortable.v-btn--size-default.v-btn--variant-outlined.btn-edit {
    z-index: 999;
    position: absolute;
    top: 10px;
    right: 5px;
}
.statusWrapper {
  position: relative;
  display: flex;
  overflow: hidden;
}

.status-container {
    display: flex !important;
    justify-content: center !important;
    align-items: flex-end !important;
}
.usrAvatar {
  margin: 10px;
  // width: 200px;
  height: 150px;
  border-radius: 20px;
  border: 1px solid;
}

.friendsCount {
  margin-top: 0.5rem;

  .username {
    font-size: 1.5em;
  }
}

@media (width < 480px) {
  .statusWrapper {
    .username {
      font-size: 0.8rem;
    }
  }
}
</style>
