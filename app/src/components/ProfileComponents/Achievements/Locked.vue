<template>
<div class="achieved">
    <img class="lock" src="/images/lock.jpg" alt="lock icon">
</div>
</template>

<style scoped lang="scss">


.achieved {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  .lock {
      z-index: 2;
      width: 60%;
      height: 90%;
      opacity: 0.5;
      width: 100%;
      height: 100%;
      border-radius:20px;
      box-shadow: -2px -2px 0 2px black;
      opacity: 0.7;
      transition: 1s;
  }
  .lock:hover {
    opacity: 0;
    z-index: -1;
  }
}

</style>