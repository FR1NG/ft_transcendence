<script setup lang="ts">

const props = defineProps({
  value1: String,
  value2: String,
});
</script>

<template>

    <div class="switch">
        <input type="checkbox" id="switcher">
        <label for="switcher"></label>
    </div>

</template>

<style lang="scss">

.switch {
    position: relative;
    width: 200px;
    height: 50px;
    margin: 10px;

    input {
        appearance: none;
        width: 200px;
        height: 50px;
        border-radius: 10px;
        background-color:rgb(87, 53, 75);
        outline: none;
        transition: 0.25s;
    }
    input::before,
    input::after {
        z-index: 2;
        position: absolute;
        top: 56%;
        transform: translateY(-55%);
        font-weight: bold;
    }
    input::before{
        content: "Global";
        left: 30px;
    }
    input::after {
        content: "Local";
        right:35px;
    }
    label {
        z-index: 1;
        position: absolute;
        top: 4px;
        bottom: 4px;
        border-radius: 10px;
    }
    input:checked::before,
    input:not(:checked)::after{
        color: rgb(var(--v-theme-secondary));
        transition:color 1.5s;
    }
    input:checked ~ label {
        left:10px;
        right:100px;
        background-color: black;
        transition: left 0.5s, right 0.4s 0.2s;
    }
    input:not(:checked)::before,
    input:checked::after {
       color: rgb(var(--v-theme-primary));
        transition:color 1.5s;
    }
    input:not(:checked) ~ label {
        left: 100px;
        right: 10px;
        background-color: black;
        transition: left 0.4s 0.2s, right 0.5s;
    }
}

</style>