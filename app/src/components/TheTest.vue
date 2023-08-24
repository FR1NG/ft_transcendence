<script setup lang="ts">
    const emit = defineEmits(['slokh'])

    const handlSlokh = () => {
        emit('slokh')
    }
</script>

<template>
    <v-btn @click="handlSlokh" color="error">
        slokh
    </v-btn>
</template>


<!-- const testFunc = () => {
    alert('need to slokh somebody')
}
</script>

<template>
    <div class="wrapper">
        here
        <TheTest @slokh="testFunc"/> -->