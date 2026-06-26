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

const selectedIndex = ref<number | null>(null)

const isAnswerIndex = computed(() => /^\d+$/.test(props.answer))

const correctAnswerText = computed(() => {
  if (isAnswerIndex.value) {
    const idx = parseInt(props.answer, 10)
    return props.options[idx] ?? ''
  }
  return props.answer
})

const correctIndex = computed(() => {
  if (isAnswerIndex.value) {
    return parseInt(props.answer, 10)
  }
  return props.options.indexOf(props.answer)
})

function selectOption(option: string, index: number) {
  if (props.showFeedback) return
  selectedIndex.value = index
  const isCorrect = isAnswerIndex.value
    ? parseInt(props.answer, 10) === index
    : option === props.answer
  emit('answer', {
    answer: option,
    isCorrect
  })
}

function getOptionClass(option: string, index: number) {
  const isSelected = selectedIndex.value === index
  const isCorrectOption = index === correctIndex.value || option === correctAnswerText.value

  if (!props.showFeedback) {
    return isSelected ? 'choice-question__option--selected' : ''
  }
  if (isCorrectOption) {
    return 'choice-question__option--correct'
  }
  if (isSelected && !isCorrectOption) {
    return 'choice-question__option--wrong'
  }
  return ''
}

const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F']
</script>

<template>
  <div class="choice-question">
    <div
      v-for="(option, index) in options"
      :key="index"
      class="choice-option"
      :class="getOptionClass(option, index)"
      @click="selectOption(option, index)"
    >
      <div class="choice-option__circle">
        <span class="choice-option__label">{{ optionLabels[index] }}</span>
        <span v-if="showFeedback && (index === correctIndex || option === correctAnswerText)" class="choice-option__icon">
          ✓
        </span>
        <span v-else-if="showFeedback && selectedIndex === index" class="choice-option__icon choice-option__icon--wrong">
          ✕
        </span>
      </div>
      <div class="choice-option__content">
        <span class="choice-option__text" v-html="option"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.choice-question {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.choice-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.choice-option::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08));
  opacity: 0;
  transition: opacity 0.25s;
}

.choice-option:hover:not(.choice-question__option--correct):not(.choice-question__option--wrong) {
  border-color: #a5b4fc;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.15);
}

.choice-option:hover::before {
  opacity: 1;
}

.choice-option--selected {
  border-color: #6366f1;
  background: linear-gradient(135deg, #eef2ff, #e0e7ff);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2);
}

.choice-option--selected::before {
  opacity: 1;
}

.choice-option--correct {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.15);
}

.choice-option--wrong {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.15);
}

.choice-option__circle {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 12px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s;
  position: relative;
  z-index: 1;
}

.choice-option--selected .choice-option__circle {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
}

.choice-option--correct .choice-option__circle {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
}

.choice-option--wrong .choice-option__circle {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
}

.choice-option__label {
  font-weight: 700;
  font-size: 1rem;
  color: #6b7280;
  transition: color 0.25s;
}

.choice-option--selected .choice-option__label,
.choice-option--correct .choice-option__label,
.choice-option--wrong .choice-option__label {
  display: none;
}

.choice-option__icon {
  font-size: 1.25rem;
  color: white;
  font-weight: bold;
}

.choice-option__icon--wrong {
  font-size: 1rem;
}

.choice-option__content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.choice-option__text {
  font-size: 1.0625rem;
  color: #374151;
  line-height: 1.5;
  font-weight: 500;
}

.choice-option--correct .choice-option__text {
  color: #065f46;
}

.choice-option--wrong .choice-option__text {
  color: #991b1b;
}
</style>
