<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  options: string[]
  answer: string
  showFeedback: boolean
}>()

const emit = defineEmits<{
  (e: 'answer', result: { answer: string; isCorrect: boolean }): void
}>()

const selected = ref<string | null>(null)

function selectOption(option: string) {
  if (props.showFeedback) return
  selected.value = option
  emit('answer', {
    answer: option,
    isCorrect: option === props.answer
  })
}

function getOptionClass(option: string) {
  if (!props.showFeedback) {
    return selected.value === option ? 'choice-question__option--selected' : ''
  }
  if (option === props.answer) {
    return 'choice-question__option--correct'
  }
  if (option === selected.value && option !== props.answer) {
    return 'choice-question__option--wrong'
  }
  return ''
}
</script>

<template>
  <div class="choice-question">
    <button
      v-for="(option, index) in options"
      :key="index"
      class="choice-question__option"
      :class="getOptionClass(option)"
      @click="selectOption(option)"
    >
      <span class="choice-question__letter">{{ ['A', 'B', 'C', 'D', 'E', 'F'][index] }}</span>
      <span class="choice-question__text" v-html="option"></span>
    </button>
  </div>
</template>

<style scoped>
.choice-question {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.choice-question__option {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--bg-hover);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  text-align: left;
  transition: all var(--transition-fast);
}

.choice-question__option:hover:not(:disabled) {
  border-color: var(--color-primary);
  background: rgba(99, 102, 241, 0.05);
}

.choice-question__option--selected {
  border-color: var(--color-primary);
  background: rgba(99, 102, 241, 0.1);
}

.choice-question__option--correct {
  border-color: var(--color-success);
  background: rgba(16, 185, 129, 0.1);
}

.choice-question__option--wrong {
  border-color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
}

.choice-question__letter {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  flex-shrink: 0;
}

.choice-question__option--selected .choice-question__letter {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.choice-question__option--correct .choice-question__letter {
  background: var(--color-success);
  border-color: var(--color-success);
  color: white;
}

.choice-question__option--wrong .choice-question__letter {
  background: var(--color-error);
  border-color: var(--color-error);
  color: white;
}

.choice-question__text {
  flex: 1;
  color: var(--text-primary);
  line-height: var(--leading-normal);
}
</style>
