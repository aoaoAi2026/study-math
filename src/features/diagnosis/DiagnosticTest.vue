<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <div class="diagnosis-page">
      <h1>🔬 智能诊断</h1>
      <p>测试你的数学能力</p>
      <button class="diagnosis-page__start">开始诊断</button>
    </div>
  </AppLayout>
</template>

<style scoped>
.diagnosis-page {
  text-align: center;
  padding: var(--space-8);
}

.diagnosis-page__start {
  padding: var(--space-3) var(--space-6);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--text-lg);
}
</style>
