<template>
  <div class="mb-6">
    <h1 class="text-3xl font-black text-secondary">{{ title }}</h1>
  </div>
</template>

<script setup>
const props = defineProps({
    title: { type: String, default: 'Setting Profile' }
})
</script>

<style scoped>
</style>