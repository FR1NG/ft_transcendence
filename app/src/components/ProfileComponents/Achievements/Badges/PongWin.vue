<script setup lang="ts">

const props = defineProps( {
  content:String,
})

</script>

<template>
        <div class="contain">
            <div>
                <h1 class="pongFont">{{content}}</h1>
            </div>
        </div>
</template>

<style scoped lang="scss">

.contain {
      position: relative;
      min-width: 200px;
      height: 140px;
      letter-spacing: 0.2em;
      border-radius:20px 5px;
      text-align: center;
      padding-top: 2.5rem;
      border: 1px solid rgba(var(--v-theme-secondary), 0.5);
      box-shadow: -5px -5px 5px -4px rgba(var(--v-theme-secondary), 0.5),
                  2px 2px 10px 0 black;
      border-bottom: 2px solid black;
      border-right: 2px solid black;
      .pongFont {
        color: rgb(var(--v-theme-secondary));
          font-size: 2.5rem;
          text-shadow: 1px 1px 2px white;
          white-space: nowrap;
      }
    }

</style>