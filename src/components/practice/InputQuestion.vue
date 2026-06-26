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
    <!-- 显示区域 -->
    <div class="calc-display" :class="{
      'calc-display--correct': showFeedback && parseFloat(inputValue) === parseFloat(answer),
      'calc-display--wrong': showFeedback && inputValue && parseFloat(inputValue) !== parseFloat(answer)
    }">
      <div class="calc-display__label">你的答案</div>
      <div class="calc-display__value">
        <span v-if="!inputValue" class="calc-display__placeholder">0</span>
        <span v-else>{{ inputValue }}</span>
      </div>
    </div>

    <div v-if="!showFeedback" class="calc-keypad">
      <!-- 第一行：符号键 -->
      <div class="calc-row">
        <button class="calc-key calc-key--special" @click="toggleSign">
          <span class="calc-key__text">±</span>
        </button>
        <button class="calc-key calc-key--special" @click="toggleDecimal">
          <span class="calc-key__text">.</span>
        </button>
        <button class="calc-key calc-key--delete" @click="deleteLast">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
            <line x1="18" y1="9" x2="12" y2="15" />
            <line x1="12" y1="9" x2="18" y2="15" />
          </svg>
        </button>
        <button class="calc-key calc-key--clear" @click="clear">
          <span class="calc-key__text">C</span>
        </button>
      </div>

      <!-- 数字键 1-9 -->
      <div class="calc-row">
        <button
          v-for="digit in digits.slice(0, 9)"
          :key="digit"
          class="calc-key"
          @click="appendDigit(digit)"
        >
          <span class="calc-key__text">{{ digit }}</span>
        </button>
      </div>

      <!-- 底部：0 和提交 -->
      <div class="calc-row calc-row--bottom">
        <button class="calc-key calc-key--zero" @click="appendDigit('0')">
          <span class="calc-key__text">0</span>
        </button>
        <button
          class="calc-key calc-key--submit"
          :disabled="!inputValue"
          @click="submit"
        >
          <span>确认</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 正确答案提示 -->
    <div v-if="showFeedback && inputValue && parseFloat(inputValue) !== parseFloat(answer)" class="calc-correct">
      <span class="calc-correct__label">正确答案：</span>
      <span class="calc-correct__value">{{ answer }}</span>
    </div>
  </div>
</template>

<style scoped>
.input-question {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 显示区域 */
.calc-display {
  background: linear-gradient(135deg, #1f2937, #111827);
  border-radius: 20px;
  padding: 1.5rem;
  text-align: right;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.calc-display--correct {
  background: linear-gradient(135deg, #065f46, #047857);
}

.calc-display--wrong {
  background: linear-gradient(135deg, #991b1b, #b91c1c);
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

.calc-display__label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.calc-display__value {
  font-size: 2.5rem;
  font-weight: 600;
  color: #ffffff;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  min-height: 3rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.calc-display__placeholder {
  color: rgba(255, 255, 255, 0.3);
}

/* 按键区域 */
.calc-keypad {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 0.5rem;
  background: #f3f4f6;
  border-radius: 20px;
}

.calc-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.625rem;
}

.calc-row--bottom {
  grid-template-columns: 1fr 2fr;
}

.calc-key {
  height: 56px;
  border: none;
  border-radius: 14px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
}

.calc-key:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.calc-key:active {
  transform: scale(0.98);
}

.calc-key__text {
  font-size: 1.375rem;
  font-weight: 600;
  color: #374151;
}

.calc-key--special {
  background: linear-gradient(135deg, #e5e7eb, #d1d5db);
}

.calc-key--special .calc-key__text {
  color: #4b5563;
}

.calc-key--delete {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
}

.calc-key--delete svg {
  width: 24px;
  height: 24px;
  color: #d97706;
}

.calc-key--clear {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
}

.calc-key--clear .calc-key__text {
  color: #dc2626;
  font-weight: 700;
}

.calc-key--zero {
  grid-column: span 1;
}

.calc-key--submit {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  gap: 0.5rem;
}

.calc-key--submit .calc-key__text,
.calc-key--submit span {
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
}

.calc-key--submit svg {
  width: 20px;
  height: 20px;
  color: #ffffff;
}

.calc-key--submit:disabled {
  background: #e5e7eb;
  opacity: 0.7;
}

.calc-key--submit:disabled .calc-key__text,
.calc-key--submit:disabled span,
.calc-key--submit:disabled svg {
  color: #9ca3af;
}

/* 正确答案提示 */
.calc-correct {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border-radius: 14px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.calc-correct__label {
  color: #065f46;
  font-size: 0.875rem;
}

.calc-correct__value {
  color: #059669;
  font-size: 1.25rem;
  font-weight: 700;
}
</style>
