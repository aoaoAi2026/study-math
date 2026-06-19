<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  answer: string
  showFeedback: boolean
}>()

const emit = defineEmits<{
  (e: 'answer', result: { answer: string; isCorrect: boolean }): void
}>()

const inputValue = ref('')

function submit() {
  const normalizedInput = inputValue.value.trim().replace(/\s+/g, '')
  const normalizedAnswer = props.answer.trim().replace(/\s+/g, '')

  emit('answer', {
    answer: inputValue.value,
    isCorrect: normalizedInput === normalizedAnswer
  })
}
</script>

<template>
  <div class="fill-question">
    <div class="fill-question__input-wrapper">
      <input
        v-model="inputValue"
        type="text"
        class="fill-question__input"
        :class="{
          'fill-question__input--correct': showFeedback && inputValue.trim() === answer,
          'fill-question__input--wrong': showFeedback && inputValue.trim() !== answer
        }"
        placeholder="请输入答案"
        :disabled="showFeedback"
        @keyup.enter="submit"
      />
    </div>
    <button
      v-if="!showFeedback"
      class="fill-question__submit"
      :disabled="!inputValue.trim()"
      @click="submit"
    >
      提交答案
    </button>
  </div>
</template>

<style scoped>
.fill-question {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.fill-question__input-wrapper {
  position: relative;
}

.fill-question__input {
  width: 100%;
  padding: var(--space-4);
  font-size: var(--text-lg);
  text-align: center;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-hover);
  transition: all var(--transition-fast);
}

.fill-question__input:focus {
  border-color: var(--color-primary);
  background: var(--bg-card);
}

.fill-question__input--correct {
  border-color: var(--color-success);
  background: rgba(16, 185, 129, 0.1);
}

.fill-question__input--wrong {
  border-color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
}

.fill-question__submit {
  padding: var(--space-3) var(--space-4);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-lg);
  font-weight: 600;
}

.fill-question__submit:disabled {
  background: var(--bg-hover);
  color: var(--text-tertiary);
}
</style>
