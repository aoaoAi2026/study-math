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
    <div class="fill-input-wrapper">
      <div class="fill-input-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </div>
      <input
        v-model="inputValue"
        type="text"
        class="fill-input"
        :class="{
          'fill-input--correct': showFeedback && inputValue.trim() === answer,
          'fill-input--wrong': showFeedback && inputValue.trim() !== answer
        }"
        placeholder="在这里输入答案"
        :disabled="showFeedback"
        @keyup.enter="submit"
      />
      <span v-if="showFeedback && inputValue.trim() === answer" class="fill-input-status fill-input-status--correct">
        ✓
      </span>
      <span v-else-if="showFeedback && inputValue.trim() !== answer" class="fill-input-status fill-input-status--wrong">
        ✕
      </span>
    </div>
    <button
      v-if="!showFeedback"
      class="fill-submit-btn"
      :disabled="!inputValue.trim()"
      @click="submit"
    >
      <span>确认答案</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </button>
    <div v-if="showFeedback && inputValue.trim() !== answer" class="fill-correct-answer">
      <span class="fill-correct-label">正确答案：</span>
      <span class="fill-correct-value">{{ answer }}</span>
    </div>
  </div>
</template>

<style scoped>
.fill-question {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.fill-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.fill-input-icon {
  position: absolute;
  left: 1.25rem;
  width: 24px;
  height: 24px;
  color: #9ca3af;
  pointer-events: none;
}

.fill-input {
  width: 100%;
  padding: 1.25rem 3.5rem;
  font-size: 1.25rem;
  text-align: center;
  border: 2px solid #e5e7eb;
  border-radius: 20px;
  background: #ffffff;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.fill-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15), 0 4px 16px rgba(99, 102, 241, 0.1);
}

.fill-input--correct {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
}

.fill-input--correct:focus {
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15), 0 4px 16px rgba(16, 185, 129, 0.1);
}

.fill-input--wrong {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  animation: shake 0.5s ease-in-out;
}

.fill-input--wrong:focus {
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15), 0 4px 16px rgba(239, 68, 68, 0.1);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}

.fill-input-status {
  position: absolute;
  right: 1.25rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  color: white;
}

.fill-input-status--correct {
  background: linear-gradient(135deg, #10b981, #059669);
}

.fill-input-status--wrong {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.fill-submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.0625rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.fill-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.fill-submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.fill-submit-btn:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  box-shadow: none;
  cursor: not-allowed;
}

.fill-submit-btn svg {
  width: 20px;
  height: 20px;
}

.fill-correct-answer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border-radius: 12px;
}

.fill-correct-label {
  color: #065f46;
  font-size: 0.875rem;
}

.fill-correct-value {
  color: #059669;
  font-size: 1.125rem;
  font-weight: 700;
}
</style>
