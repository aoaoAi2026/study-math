<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import QuizEngine from '@/components/practice/QuizEngine.vue'
import { findByKnowledge, EXERCISE_POOL, randomPick } from '@/stores/exerciseData'

const props = defineProps<{ knowledgeId: string; title?: string }>()
const pool = computed(() => {
  const r = findByKnowledge(props.knowledgeId)
  return r.length ? r : randomPick(EXERCISE_POOL, 5)
})
</script>

<template>
  <div class="aq">
    <button class="back" onclick="history.back()">← 返回</button>
    <h1 class="title">{{ title || '自适应练习' }}</h1>
    <QuizEngine :knowledge-id="knowledgeId" :pool="pool" />
  </div>
</template>

<style scoped>
.aq { max-width: 700px; margin: 0 auto; padding: 16px; }
.back { background: none; border: none; color: #6B7785; font-size: 14px; cursor: pointer; display: block; margin-bottom: 8px; }
.title { font-size: 22px; color: #2C3E50; text-align: center; margin-bottom: 16px; }
</style>
