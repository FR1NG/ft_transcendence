<script lang="ts" setup>
import UserSearch from '@/components/ProfileComponents/search/UserSearch.vue'
import CustomDivider from '@/components/CustomDivider.vue'
import { useRoomStore } from '@/store/room'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue';
import { User } from '@/types/user';
import { useSearchStore } from '@/store/search'


const roomId = useRoute().params.id as string;
const props = defineProps({
  usersId: {
    type: Array,
    default: []
  },
  invitedsId: {
    type: Array,
    default: []
  },
  refetch: {
    type: Function
  }
});

const loading = ref(['']);

const refetch = () => {
    props.refetch?.call(props.refetch);
}

const invite = (userId: string) => {
  loading.value.push(userId);
  useRoomStore().inviteUser(roomId, userId).then(() => {
    refetch();
    removeLoading(userId);
  }).catch(error => {
      removeLoading(userId);
      console.log(error);
    });
}

const cancel = (userId: string) => {
  loading.value.push(userId);
  console.log('canceling')
  useRoomStore().cancelInvitation(roomId, userId).then(result => {
      console.log(result);
    refetch();
    removeLoading(userId);
  }).catch(() => {
      removeLoading(userId);
    });
}

const removeLoading = (id: string) => {
   loading.value = loading.value.filter(el => el != id);
}

</script>

<template>
  <div>
  <CustomDivider title="Invite users"/>
  <v-row>
      <v-col cols="12">
        <user-search ref="child"  min-with="400">
          <template v-slot:items="{users}">
            <v-list-item v-for="user in users as User[]" :key="user.id">
              {{user.username}}
              <template v-slot:append  v-if="!usersId.includes(user.id)">

                <v-btn v-if="invitedsId.includes(user.id)" icon flat  @click="cancel(user.id)" :loading="loading.includes(user.id)">
                  <v-icon>mdi-account-cancel-outline</v-icon>
                </v-btn>

                <v-btn v-else icon flat  @click="invite(user.id)" :loading="loading.includes(user.id)">
                  <v-icon>mdi-account-plus-outline</v-icon>
                </v-btn>
              </template>
          </v-list-item>
          </template>
        </user-search>
      </v-col>
    </v-row>
  </div>
</template>
