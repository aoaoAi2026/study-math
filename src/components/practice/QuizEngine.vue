<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Exercise } from '@/types/exercise'
import { classifyError } from '@/services/exerciseEngine'
import { addWrongItem } from '@/services/wrongBookStore'
import { useUserStore } from '@/stores/userStore'
import ChoiceQuestion from './ChoiceQuestion.vue'
import FillQuestion from './FillQuestion.vue'
import InputQuestion from './InputQuestion.vue'
import ShapeIllustration from './ShapeIllustration.vue'

// 火柴棒可视化 - 根据字符返回 SVG
function matchSegment(ch: string): string {
  const segments: Record<string, string[]> = {
    '0': ['top', 'ul', 'ur', 'dl', 'dr', 'bot'],
    '1': ['ur', 'dr'],
    '2': ['top', 'ur', 'mid', 'dl', 'bot'],
    '3': ['top', 'ur', 'mid', 'dr', 'bot'],
    '4': ['ul', 'ur', 'mid', 'dr'],
    '5': ['top', 'ul', 'mid', 'dr', 'bot'],
    '6': ['top', 'ul', 'mid', 'dl', 'dr', 'bot'],
    '7': ['top', 'ur', 'dr'],
    '8': ['top', 'ul', 'ur', 'mid', 'dl', 'dr', 'bot'],
    '9': ['top', 'ul', 'ur', 'mid', 'dr', 'bot'],
    '+': ['mid', 'vbar'],
    '-': ['mid'],
    '=': ['eqTop', 'eqBot']
  }
  const segs = segments[ch] || []
  const wood = '#8B4513'
  const tip = '#D2691E'
  let svg = `<svg viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg" style="width:44px;height:72px;">`
  if (segs.includes('top')) svg += `<rect x="8" y="6" width="44" height="7" rx="3" fill="${wood}"/><circle cx="6" cy="9.5" r="3.5" fill="${tip}"/><circle cx="54" cy="9.5" r="3.5" fill="${tip}"/>`
  if (segs.includes('mid')) svg += `<rect x="8" y="46" width="44" height="7" rx="3" fill="${wood}"/><circle cx="6" cy="49.5" r="3.5" fill="${tip}"/><circle cx="54" cy="49.5" r="3.5" fill="${tip}"/>`
  if (segs.includes('bot')) svg += `<rect x="8" y="86" width="44" height="7" rx="3" fill="${wood}"/><circle cx="6" cy="89.5" r="3.5" fill="${tip}"/><circle cx="54" cy="89.5" r="3.5" fill="${tip}"/>`
  if (segs.includes('ul')) svg += `<rect x="3" y="10" width="7" height="36" rx="3" fill="${wood}"/><circle cx="6.5" cy="7" r="3.5" fill="${tip}"/><circle cx="6.5" cy="49" r="3.5" fill="${tip}"/>`
  if (segs.includes('ur')) svg += `<rect x="50" y="10" width="7" height="36" rx="3" fill="${wood}"/><circle cx="53.5" cy="7" r="3.5" fill="${tip}"/><circle cx="53.5" cy="49" r="3.5" fill="${tip}"/>`
  if (segs.includes('dl')) svg += `<rect x="3" y="54" width="7" height="36" rx="3" fill="${wood}"/><circle cx="6.5" cy="51" r="3.5" fill="${tip}"/><circle cx="6.5" cy="93" r="3.5" fill="${tip}"/>`
  if (segs.includes('dr')) svg += `<rect x="50" y="54" width="7" height="36" rx="3" fill="${wood}"/><circle cx="53.5" cy="51" r="3.5" fill="${tip}"/><circle cx="53.5" cy="93" r="3.5" fill="${tip}"/>`
  if (segs.includes('vbar')) svg += `<rect x="26" y="6" width="7" height="88" rx="3" fill="${wood}"/><circle cx="29.5" cy="3" r="3.5" fill="${tip}"/><circle cx="29.5" cy="97" r="3.5" fill="${tip}"/>`
  if (segs.includes('eqTop')) svg += `<rect x="5" y="30" width="50" height="7" rx="3" fill="${wood}"/><circle cx="3" cy="33.5" r="3.5" fill="${tip}"/><circle cx="57" cy="33.5" r="3.5" fill="${tip}"/>`
  if (segs.includes('eqBot')) svg += `<rect x="5" y="63" width="50" height="7" rx="3" fill="${wood}"/><circle cx="3" cy="66.5" r="3.5" fill="${tip}"/><circle cx="57" cy="66.5" r="3.5" fill="${tip}"/>`
  svg += '</svg>'
  return svg
}

const props = defineProps<{
  exercises: Exercise[]
  knowledgePoints?: string[]
}>()

const emit = defineEmits<{
  (e: 'complete', results: AnswerResult[]): void
  (e: 'wrong', exercise: Exercise, result: AnswerResult): void
}>()

export interface AnswerResult {
  exerciseId: string
  userAnswer: string
  isCorrect: boolean
  timeUsed: number
  errorLayer?: 'L1' | 'L2' | 'L3' | 'L4'
}

const userStore = useUserStore()
const currentIndex = ref(0)
const answers = ref<AnswerResult[]>([])
const startTime = ref(Date.now())
const showFeedback = ref(false)
const isCorrect = ref(false)
const hintIndex = ref(0)
const showHints = ref(false)

const currentExercise = computed(() => props.exercises[currentIndex.value])
const progress = computed(() => ((currentIndex.value + 1) / props.exercises.length) * 100)
const isLast = computed(() => currentIndex.value === props.exercises.length - 1)

// 判断是否为火柴棒题目（等式类，需要显示火柴棒布局）
const isMatchstickEquation = computed(() => {
  if (!currentExercise.value) return false
  const stem = currentExercise.value.stem || ''
  // 必须同时包含"火柴"和明确的等式模式（数字+运算符+等号+数字）
  if (!stem.includes('火柴')) return false
  // 匹配等式模式：如 "7 + 7 = 1"、"1+2=4"、"5-2=2"
  // 要求至少有一个运算符(+、-、×、÷、*)和等号，两侧都有数字
  const equationMatch = stem.match(/\d+\s*[+\-×÷*]\s*\d+\s*=\s*\d+/)
  if (equationMatch) return true
  // 或匹配 "XX=YY" 且在"移动火柴"语境下
  const simpleEqMatch = stem.match(/(?:使|让|让等式|等式).*\d+\s*[+\-×÷*]?\s*\d+\s*=\s*\d+/)
  return !!simpleEqMatch
})

// 从题干提取火柴等式（如 '7 + 7 = 1'）
const matchstickChars = computed(() => {
  if (!isMatchstickEquation.value || !currentExercise.value) return []
  const stem = currentExercise.value.stem || ''
  // 优先提取完整等式：数字 + 运算符 + 数字 = 数字
  const m = stem.match(/\d+\s*[+\-×÷*]\s*\d+\s*=\s*\d+/)
  if (m) {
    return m[0].replace(/[^\d+\-=]/g, '').split('')
  }
  return []
})

const matchstickHtml = computed(() => {
  if (!isMatchstickEquation.value) return ''
  const chars = matchstickChars.value
  if (chars.length === 0) return ''
  return chars.map(ch => `<span class="match-char">${matchSegment(ch)}</span>`).join('')
})

const correctAnswerText = computed(() => {
  const exercise = currentExercise.value
  if (!exercise) return ''
  const answer = exercise.answer
  if (exercise.type === 'choice' && /^\d+$/.test(answer)) {
    const idx = parseInt(answer, 10)
    if (exercise.options && idx >= 0 && idx < exercise.options.length) {
      return exercise.options[idx]
    }
  }
  return answer
})

const currentHints = computed(() => {
  if (!showHints.value) return []
  return (currentExercise.value?.hints ?? []).slice(0, hintIndex.value)
})

const hasMoreHints = computed(() => {
  const total = currentExercise.value?.hints?.length ?? 0
  return hintIndex.value < total
})

function showNextHint() {
  if (hasMoreHints.value) {
    showHints.value = true
    hintIndex.value++
  }
}

function handleAnswer(result: { answer: string; isCorrect: boolean }) {
  const now = Date.now()
  const answerResult: AnswerResult = {
    exerciseId: currentExercise.value.id,
    userAnswer: result.answer,
    isCorrect: result.isCorrect,
    timeUsed: now - startTime.value
  }

  if (!result.isCorrect) {
    answerResult.errorLayer = classifyError(
      result.answer,
      currentExercise.value.answer,
      currentExercise.value.stem
    )
    // 自动保存到错题本
    addWrongItem(
      currentExercise.value,
      result.answer,
      answerResult.errorLayer,
      'practice'
    )
    emit('wrong', currentExercise.value, answerResult)
  } else {
    userStore.addExp(10)
    userStore.correctTotal++
  }

  answers.value.push(answerResult)
  isCorrect.value = result.isCorrect
  showFeedback.value = true
}

function nextQuestion() {
  showFeedback.value = false
  hintIndex.value = 0
  showHints.value = false
  if (isLast.value) {
    emit('complete', answers.value)
  } else {
    currentIndex.value++
    startTime.value = Date.now()
  }
}

function restart() {
  currentIndex.value = 0
  answers.value = []
  startTime.value = Date.now()
  showFeedback.value = false
  hintIndex.value = 0
  showHints.value = false
}

watch(currentIndex, () => {
  startTime.value = Date.now()
})

onMounted(() => {
  startTime.value = Date.now()
})
</script>

<template>
  <div class="quiz-engine">
    <div class="quiz-engine__progress">
      <div class="quiz-engine__progress-bar">
        <div class="quiz-engine__progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="quiz-engine__progress-text">
        {{ currentIndex + 1 }} / {{ exercises.length }}
      </div>
    </div>

    <div class="quiz-engine__question">
      <div class="quiz-engine__meta">
        <span class="quiz-engine__diff" :class="`quiz-engine__diff--${currentExercise.difficulty}`">
          {{ '★'.repeat(currentExercise.difficulty) }}
        </span>
        <span class="quiz-engine__time">
          ⏱️ {{ Math.round((Date.now() - startTime) / 1000) }}s
        </span>
      </div>

      <div class="quiz-engine__stem" v-html="currentExercise.stem"></div>

      <!-- 火柴棒可视化（仅等式类火柴棒题显示） -->
      <div v-if="isMatchstickEquation && matchstickHtml" class="quiz-engine__matchstick">
        <div class="quiz-engine__matchstick-box">
          <div class="quiz-engine__matchstick-row" v-html="matchstickHtml"></div>
          <div class="quiz-engine__matchstick-hint">⬆ 用火柴棒摆出的等式，移动一根使其成立</div>
        </div>
      </div>

      <ShapeIllustration
        v-if="currentExercise.image && !isMatchstickEquation"
        :shape="currentExercise.image"
        :size="200"
      />

      <div v-if="!showFeedback && currentExercise.hints && currentExercise.hints.length > 0" class="quiz-engine__hints">
        <div v-for="(hint, idx) in currentHints" :key="idx" class="quiz-engine__hint-item">
          <span class="quiz-engine__hint-bulb">💡</span>
          <span class="quiz-engine__hint-text">{{ hint }}</span>
        </div>
        <button v-if="hasMoreHints" class="quiz-engine__hint-btn" @click="showNextHint">
          需要提示 ({{ hintIndex }}/{{ currentExercise.hints.length }})
        </button>
      </div>

      <ChoiceQuestion
        v-if="currentExercise.type === 'choice'"
        :options="currentExercise.options!"
        :answer="currentExercise.answer"
        :show-feedback="showFeedback"
        @answer="handleAnswer"
      />

      <FillQuestion
        v-else-if="currentExercise.type === 'fill'"
        :answer="currentExercise.answer"
        :show-feedback="showFeedback"
        @answer="handleAnswer"
      />

      <InputQuestion
        v-else-if="currentExercise.type === 'input'"
        :answer="currentExercise.answer"
        :show-feedback="showFeedback"
        @answer="handleAnswer"
      />
    </div>

    <div v-if="showFeedback" class="quiz-engine__feedback" :class="{ 'quiz-engine__feedback--correct': isCorrect, 'quiz-engine__feedback--wrong': !isCorrect }">
      <div class="quiz-engine__feedback-icon">
        {{ isCorrect ? '🎉' : '🤔' }}
      </div>
      <div class="quiz-engine__feedback-text">
        {{ isCorrect ? '回答正确！' : '再想想看...' }}
      </div>

      <div v-if="!isCorrect" class="quiz-engine__solution">
        <div class="quiz-engine__solution-label">正确答案</div>
        <div class="quiz-engine__solution-answer">{{ correctAnswerText }}</div>
      </div>

      <div v-if="currentExercise.solution && currentExercise.solution.length > 0" class="quiz-engine__solution-steps">
        <div class="quiz-engine__solution-steps-title">解题步骤</div>
        <div
          v-for="(step, idx) in currentExercise.solution"
          :key="idx"
          class="quiz-engine__solution-step"
        >
          <span class="quiz-engine__solution-step-num">{{ idx + 1 }}</span>
          <div class="quiz-engine__solution-step-body">
            <div class="quiz-engine__solution-step-desc">{{ step.description }}</div>
            <div v-if="step.expression" class="quiz-engine__solution-step-expr">{{ step.expression }}</div>
            <div v-if="step.why" class="quiz-engine__solution-step-why">💡 {{ step.why }}</div>
          </div>
        </div>
      </div>

      <div v-if="!isCorrect && currentExercise.commonMistakes && currentExercise.commonMistakes.length > 0" class="quiz-engine__mistakes">
        <div class="quiz-engine__mistakes-title">常见误区</div>
        <div
          v-for="(mistake, idx) in currentExercise.commonMistakes"
          :key="idx"
          class="quiz-engine__mistake-item"
        >
          <div class="quiz-engine__mistake-header">
            <span class="quiz-engine__mistake-layer">{{ mistake.errorLayer }}</span>
            <span class="quiz-engine__mistake-mistake">⚠️ {{ mistake.mistake }}</span>
          </div>
          <div class="quiz-engine__mistake-row">
            <span class="quiz-engine__mistake-label">错误原因：</span>
            <span class="quiz-engine__mistake-value">{{ mistake.reason }}</span>
          </div>
          <div class="quiz-engine__mistake-row">
            <span class="quiz-engine__mistake-label">纠正方法：</span>
            <span class="quiz-engine__mistake-value">{{ mistake.correction }}</span>
          </div>
        </div>
      </div>

      <button class="quiz-engine__next-btn" @click="nextQuestion">
        {{ isLast ? '查看结果' : '下一题' }} →
      </button>
    </div>

    <div class="quiz-engine__actions">
      <button class="quiz-engine__action" @click="restart">
        🔄 重新开始
      </button>
    </div>
  </div>
</template>

<style scoped>
.quiz-engine {
  max-width: 680px;
  margin: 0 auto;
}

/* 进度条 */
.quiz-engine__progress {
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}

.quiz-engine__progress-bar {
  height: 8px;
  background: linear-gradient(90deg, #e5e7eb, #d1d5db);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.75rem;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);
}

.quiz-engine__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 8px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.4);
}

.quiz-engine__progress-text {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

/* 题目容器 */
.quiz-engine__question {
  background: var(--bg-card);
  border-radius: 24px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

/* 题目元信息 */
.quiz-engine__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.quiz-engine__diff {
  display: flex;
  gap: 2px;
}

.quiz-engine__diff::before {
  content: '';
}

.quiz-engine__diff--1 { color: #10b981; }
.quiz-engine__diff--2 { color: #3b82f6; }
.quiz-engine__diff--3 { color: #f59e0b; }
.quiz-engine__diff--4 { color: #ef4444; }
.quiz-engine__diff--5 { color: #8b5cf6; }

.quiz-engine__time {
  font-size: 0.875rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* 题干 */
.quiz-engine__stem {
  font-size: 1.25rem;
  color: #111827;
  line-height: 1.7;
  margin-bottom: 2rem;
  font-weight: 500;
}

/* 火柴棒 */
.quiz-engine__matchstick {
  margin: 1.5rem 0;
}

.quiz-engine__matchstick-box {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 16px;
  padding: 1.5rem 1rem;
  border: 2px dashed #d97706;
}

.quiz-engine__matchstick-row {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.quiz-engine__matchstick-hint {
  margin-top: 1rem;
  text-align: center;
  color: #92400e;
  font-size: 0.875rem;
  font-style: italic;
}

/* 提示区域 */
.quiz-engine__hints {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.quiz-engine__hint-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: linear-gradient(135deg, #eef2ff, #e0e7ff);
  border-left: 4px solid #6366f1;
  padding: 1rem 1.25rem;
  border-radius: 0 12px 12px 0;
  margin-bottom: 0.75rem;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

.quiz-engine__hint-bulb {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.quiz-engine__hint-text {
  font-size: 0.9375rem;
  color: #4b5563;
  line-height: 1.6;
}

.quiz-engine__hint-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: transparent;
  border: 2px dashed #a5b4fc;
  color: #6366f1;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.quiz-engine__hint-btn:hover {
  background: rgba(99, 102, 241, 0.05);
  border-color: #6366f1;
}

/* 反馈区域 */
.quiz-engine__feedback {
  background: var(--bg-card);
  border-radius: 24px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 2px solid var(--color-warning);
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.quiz-engine__feedback--correct {
  border-color: var(--color-success);
  background: var(--bg-card);
}

.quiz-engine__feedback--wrong {
  border-color: var(--color-warning);
  background: var(--bg-card);
}

.quiz-engine__feedback-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.quiz-engine__feedback-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

/* 答案区域 */
.quiz-engine__solution {
  background: var(--bg-hover);
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
  text-align: center;
}

.quiz-engine__solution-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.quiz-engine__solution-answer {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-success);
}

/* 解析步骤 */
.quiz-engine__solution-steps {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
  text-align: left;
  border: 1px solid var(--border-color);
}

.quiz-engine__solution-steps-title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quiz-engine__solution-steps-title::before {
  content: '📝';
}

.quiz-engine__solution-step {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid #f3f4f6;
}

.quiz-engine__solution-step:first-of-type {
  border-top: none;
  padding-top: 0;
}

.quiz-engine__solution-step-num {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.quiz-engine__solution-step-body {
  flex: 1;
  min-width: 0;
}

.quiz-engine__solution-step-desc {
  font-size: 1rem;
  color: #374151;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.quiz-engine__solution-step-expr {
  font-family: 'SF Mono', 'Monaco', monospace;
  font-size: 0.9375rem;
  color: #6366f1;
  background: #eef2ff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  display: inline-block;
}

.quiz-engine__solution-step-why {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;
}

/* 常见错误 */
.quiz-engine__mistakes {
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  border: 1px solid #fcd34d;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
  text-align: left;
}

.quiz-engine__mistakes-title {
  font-size: 1rem;
  font-weight: 700;
  color: #b45309;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quiz-engine__mistake-item {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
}

.quiz-engine__mistake-item:last-child {
  margin-bottom: 0;
}

.quiz-engine__mistake-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.quiz-engine__mistake-layer {
  display: inline-block;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  flex-shrink: 0;
}

.quiz-engine__mistake-mistake {
  font-size: 0.875rem;
  color: #92400e;
  font-weight: 600;
}

.quiz-engine__mistake-row {
  font-size: 0.875rem;
  color: #78716c;
  line-height: 1.5;
  margin-top: 0.25rem;
  display: flex;
  gap: 0.25rem;
}

.quiz-engine__mistake-label {
  color: #a8a29e;
  flex-shrink: 0;
}

.quiz-engine__mistake-value {
  color: #57534e;
}

/* 下一题按钮 */
.quiz-engine__next-btn {
  width: 100%;
  padding: 1.125rem 2rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1.0625rem;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.quiz-engine__next-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(99, 102, 241, 0.4);
}

/* 底部操作 */
.quiz-engine__actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.quiz-engine__action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #f3f4f6;
  color: #6b7280;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.quiz-engine__action:hover {
  background: #e5e7eb;
  color: #4b5563;
}
</style>
