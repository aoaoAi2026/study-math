<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { useTheme } from '@/assets/styles/themes/theme-manager'

const settingsStore = useSettingsStore()
useTheme() // 主题自动初始化

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
