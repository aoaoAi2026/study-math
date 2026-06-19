<script setup lang="ts">
import { ref } from 'vue'
import AdaptiveQuiz from '../learning/AdaptiveQuiz.vue'
// 简单入口
const topicId = ref('general')
</script>

<template>
  <AdaptiveQuiz :knowledge-id="topicId" />
</template>
