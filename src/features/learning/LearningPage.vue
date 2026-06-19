<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()
</script>

<template>
  <AppLayout>
    <div class="learning-page">
      <h1>📚 专题学习</h1>
      <p>选择年级开始学习</p>
    </div>
  </AppLayout>
</template>

<style scoped>
.learning-page {
  text-align: center;
  padding: var(--space-8);
}
</style>
