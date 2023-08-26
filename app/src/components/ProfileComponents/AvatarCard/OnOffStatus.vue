<script setup lang="ts">

const props = defineProps<{
  isOnline: boolean,
  avatar: string
}>();

</script>

<template>

    <div class="imgAndStatus">
      <img class="usrAvatar" :src="props.avatar" alt="avatar image">
      <div class="status">
        <div class="dot"></div>
        <p class="statusString">{{isOnline ? 'online' : 'offline'}}</p>
      </div>
    </div>
</template>

<style lang="scss">

.imgAndStatus {
      position: relative;
      width: 150px;
      .usrAvatar {
        width: 100%;
        height: 100%;
        border-radius: 20px;
      }
      .status {
        position: absolute;
        background-color: rgba(93, 237, 105, 0.4);
        width: 80px;
        left: 25%;
        bottom: 5px;
        display: flex;
        align-items: center;
        color: rgb(32, 241, 32);
        border-radius: 15px;
        padding: 0rem 0.2rem;
        .dot {
          top:0.6rem;
          background-color: rgb(32, 241, 32);
          border-radius: 50%;
          width: 0.6rem;
          height: 0.6rem;
          margin-right: 0.5rem;
        }
      }
}

</style>