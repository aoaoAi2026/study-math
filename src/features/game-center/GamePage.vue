<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const route = useRoute()
const gameId = route.params.id as string
</script>

<template>
  <AppLayout>
    <div class="game-page">
      <h1>🎮 {{ gameId }}</h1>
      <p>游戏页面开发中...</p>
    </div>
  </AppLayout>
</template>

<style scoped>
.game-page {
  text-align: center;
  padding: var(--space-8);
}
</style>
