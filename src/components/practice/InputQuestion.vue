<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  answer: string
  showFeedback: boolean
}>()

const emit = defineEmits<{
  (e: 'answer', result: { answer: string; isCorrect: boolean }): void
}>()

const inputValue = ref('')
const hasDecimal = ref(false)

function toggleSign() {
  if (inputValue.value.startsWith('-')) {
    inputValue.value = inputValue.value.slice(1)
  } else {
    inputValue.value = '-' + inputValue.value
  }
}

function toggleDecimal() {
  if (!inputValue.value.includes('.')) {
    inputValue.value += hasDecimal.value ? '' : '.'
    hasDecimal.value = true
  }
}

function appendDigit(digit: string) {
  inputValue.value += digit
}

function deleteLast() {
  const last = inputValue.value.slice(-1)
  if (last === '.') hasDecimal.value = false
  inputValue.value = inputValue.value.slice(0, -1)
}

function clear() {
  inputValue.value = ''
  hasDecimal.value = false
}

function submit() {
  const normalizedInput = inputValue.value.trim()
  const normalizedAnswer = props.answer.trim()

  const inputNum = parseFloat(normalizedInput)
  const answerNum = parseFloat(normalizedAnswer)

  const isCorrect = !isNaN(inputNum) && !isNaN(answerNum) && Math.abs(inputNum - answerNum) < 0.0001

  emit('answer', {
    answer: inputValue.value,
    isCorrect
  })
}

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
</script>

<template>
  <div class="input-question">
    <div class="input-question__display">
      <input
        v-model="inputValue"
        type="text"
        class="input-question__input"
        :class="{
          'input-question__input--correct': showFeedback && parseFloat(inputValue) === parseFloat(answer),
          'input-question__input--wrong': showFeedback && parseFloat(inputValue) !== parseFloat(answer)
        }"
        placeholder="0"
        :disabled="showFeedback"
        readonly
      />
    </div>

    <div v-if="!showFeedback" class="input-question__keypad">
      <div class="input-question__row">
        <button class="input-question__key input-question__key--operator" @click="toggleSign">
          ±
        </button>
        <button class="input-question__key input-question__key--operator" @click="toggleDecimal">
          .
        </button>
        <button class="input-question__key input-question__key--delete" @click="deleteLast">
          ⌫
        </button>
        <button class="input-question__key input-question__key--clear" @click="clear">
          C
        </button>
      </div>
      <div class="input-question__row">
        <button
          v-for="digit in digits"
          :key="digit"
          class="input-question__key"
          @click="appendDigit(digit)"
        >
          {{ digit }}
        </button>
      </div>
      <button
        class="input-question__submit"
        :disabled="!inputValue"
        @click="submit"
      >
        提交答案
      </button>
    </div>
  </div>
</template>

<style scoped>
.input-question__display {
  margin-bottom: var(--space-4);
}

.input-question__input {
  width: 100%;
  padding: var(--space-4);
  font-size: var(--text-2xl);
  text-align: right;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-hover);
  font-family: var(--font-mono);
}

.input-question__input--correct {
  border-color: var(--color-success);
  background: rgba(16, 185, 129, 0.1);
}

.input-question__input--wrong {
  border-color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
}

.input-question__keypad {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.input-question__row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-2);
}

.input-question__key {
  padding: var(--space-3);
  font-size: var(--text-lg);
  font-weight: 500;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.input-question__key:hover {
  background: var(--bg-hover);
}

.input-question__key--operator {
  background: var(--bg-hover);
  color: var(--color-primary);
}

.input-question__key--delete,
.input-question__key--clear {
  background: var(--bg-hover);
  color: var(--color-error);
}

.input-question__submit {
  padding: var(--space-3);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--text-lg);
  margin-top: var(--space-2);
}

.input-question__submit:disabled {
  background: var(--bg-hover);
  color: var(--text-tertiary);
}
</style>
