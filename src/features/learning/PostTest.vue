<script setup lang="ts">
import { ref } from 'vue'
import AdaptiveQuiz from './AdaptiveQuiz.vue'
const id = ref('post')
</script>

<template>
  <AdaptiveQuiz :knowledge-id="id" title="掌握检测" />
</template>
