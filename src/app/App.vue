<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'

const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.init()
})
</script>

<template>
  <RouterView />
</template>

<style>
/* 引入亮色和暗色主题 */
@import '@/assets/styles/themes/space.css';
@import '@/assets/styles/themes/ocean.css';
@import '@/assets/styles/themes/magic.css';
@import '@/assets/styles/themes/martial.css';
@import '@/assets/styles/themes/eye-care.css';
</style>
