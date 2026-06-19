<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <div class="daily-challenge">
      <h1>⚡ 每日挑战</h1>
      <p>完成挑战赢取奖励</p>
    </div>
  </AppLayout>
</template>

<style scoped>
.daily-challenge {
  text-align: center;
  padding: var(--space-8);
}
</style>
