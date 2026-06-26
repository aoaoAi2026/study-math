<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTimer } from '@/composables/useTimer'
import { useUserStore } from '@/stores/userStore'
import type { ChallengeRecord } from '@/types/challenge'

interface Question {
  id: number; type: 'choice' | 'fill'; text: string
  options?: string[]; answer: string; difficulty: number
}

type Phase = 'intro' | 'playing' | 'result'

const phase = ref<Phase>('intro')
const currentIndex = ref(0)
const questions = ref<Question[]>([])
const answers = ref<(string | null)[]>([])
const showFeedback = ref(false)
const history = ref<ChallengeRecord[]>([])
const userStore = useUserStore()

const today = new Date().toISOString().slice(0, 10)
const completedToday = computed(() => history.value.some(r => r.date === today))

const timer = useTimer({
  duration: 300,
  onComplete: () => finishChallenge()
})

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 }
}

function generateQuestions(): Question[] {
  const dateNum = today.replace(/-/g, '').split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const rand = seededRandom(dateNum)
  const result: Question[] = []
  const generators = [genAdd, genSub, genMul, genDiv, genMixed]
  for (let i = 0; i < 5; i++) {
    const q = generators[i](rand)
    result.push({ ...q, id: i })
  }
  return result
}

function genAdd(r: () => number): Question {
  const a = Math.floor(r() * 90) + 10, b = Math.floor(r() * 90) + 10
  const ans = a + b
  return makeChoice(`${a} + ${b} = ?`, ans, r)
}
function genSub(r: () => number): Question {
  const a = Math.floor(r() * 90) + 50, b = Math.floor(r() * 40) + 10
  return makeChoice(`${a} - ${b} = ?`, a - b, r)
}
function genMul(r: () => number): Question {
  const a = Math.floor(r() * 12) + 2, b = Math.floor(r() * 12) + 2
  return makeFill(`${a} × ${b} = ?`, String(a * b), r)
}
function genDiv(r: () => number): Question {
  const b = Math.floor(r() * 11) + 2, ans = Math.floor(r() * 12) + 2, a = b * ans
  return makeFill(`${a} ÷ ${b} = ?`, String(ans), r)
}
function genMixed(r: () => number): Question {
  const a = Math.floor(r() * 20) + 5, b = Math.floor(r() * 20) + 5, c = Math.floor(r() * 10) + 1
  const ans = a + b * c
  return makeChoice(`${a} + ${b} × ${c} = ?`, ans, r)
}

function makeChoice(text: string, answer: number, r: () => number): Question {
  const opts = new Set<number>([answer])
  while (opts.size < 4) {
    const off = Math.floor(r() * 10) - 5
    if (off !== 0) opts.add(answer + off)
  }
  return { id: 0, type: 'choice', text, options: [...opts].sort(() => r() - 0.5).map(String), answer: String(answer), difficulty: 1 }
}
function makeFill(text: string, answer: string, _r: () => number): Question {
  return { id: 0, type: 'fill', text, answer, difficulty: 2 }
}

const currentQ = computed(() => questions.value[currentIndex.value])
const score = computed(() => answers.value.filter((a, i) => a === questions.value[i]?.answer).length)
const expReward = computed(() => score.value * 10 + (timer.remaining.value > 120 ? 20 : 0))
const timeUsed = computed(() => 300 - timer.remaining.value)

function startChallenge() {
  questions.value = generateQuestions()
  answers.value = Array(5).fill(null)
  currentIndex.value = 0
  showFeedback.value = false
  phase.value = 'playing'
  timer.reset()
  timer.start()
}

function handleAnswer(result: { answer: string; isCorrect: boolean }) {
  answers.value[currentIndex.value] = result.answer
  showFeedback.value = true
}

function nextQuestion() {
  if (currentIndex.value < 4) {
    currentIndex.value++
    showFeedback.value = false
  } else {
    finishChallenge()
  }
}

function finishChallenge() {
  timer.stop()
  phase.value = 'result'
  const record: ChallengeRecord = {
    id: `daily-${today}`, type: 'daily', date: today,
    score: score.value, totalQuestions: 5, correctCount: score.value,
    timeUsed: timeUsed.value,
    details: questions.value.map((q, i) => ({ exerciseId: String(q.id), correct: answers.value[i] === q.answer }))
  }
  history.value.push(record)
  localStorage.setItem('daily-challenge-history', JSON.stringify(history.value))
  userStore.addExp(expReward.value)
}

function loadHistory() {
  try {
    const raw = localStorage.getItem('daily-challenge-history')
    if (raw) history.value = JSON.parse(raw)
  } catch { /* ignore */ }
}

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

onMounted(loadHistory)
</script>

<template>
  <div class="daily-challenge">
    <!-- Intro -->
    <div v-if="phase === 'intro'" class="dc-intro">
      <div class="dc-intro__hero">
        <div class="dc-intro__icon">🎯</div>
        <h1 class="dc-intro__title">每日挑战</h1>
        <p class="dc-intro__subtitle">Daily Challenge</p>
        <p class="dc-intro__desc">每天5道数学题，限时5分钟，赢取经验值奖励</p>
      </div>
      
      <div class="dc-intro__stats">
        <div class="dc-stat-card">
          <span class="dc-stat-icon">📝</span>
          <span class="dc-stat-number">5</span>
          <span class="dc-stat-label">道题目</span>
        </div>
        <div class="dc-stat-card">
          <span class="dc-stat-icon">⏱️</span>
          <span class="dc-stat-number">5</span>
          <span class="dc-stat-label">分钟</span>
        </div>
        <div class="dc-stat-card">
          <span class="dc-stat-icon">⭐</span>
          <span class="dc-stat-number">+50</span>
          <span class="dc-stat-label">经验值</span>
        </div>
      </div>

      <button 
        class="dc-btn dc-btn--primary" 
        :disabled="completedToday" 
        @click="startChallenge"
      >
        <span v-if="completedToday">✅ 今日已完成</span>
        <template v-else>
          <span>开始挑战</span>
          <span class="dc-btn-arrow">→</span>
        </template>
      </button>

      <div v-if="history.length" class="dc-intro__history">
        <div class="dc-history-header">
          <span class="dc-history-icon">📜</span>
          <h3>挑战记录</h3>
        </div>
        <div 
          v-for="r in history.slice(-5).reverse()" 
          :key="r.id" 
          class="dc-history-item"
        >
          <div class="dc-history-date">{{ r.date }}</div>
          <div class="dc-history-score">
            <span 
              class="dc-score-value"
              :class="{ 
                'score--excellent': r.correctCount >= 4,
                'score--good': r.correctCount === 3,
                'score--poor': r.correctCount < 3
              }"
            >
              {{ r.correctCount }}/{{ r.totalQuestions }}
            </span>
          </div>
          <div class="dc-history-time">{{ formatTime(r.timeUsed) }}</div>
        </div>
      </div>
    </div>

    <!-- Playing -->
    <div v-else-if="phase === 'playing' && currentQ" class="dc-play">
      <div class="dc-play__header">
        <div class="dc-play__progress">
          <span class="dc-progress-current">{{ currentIndex + 1 }}</span>
          <span class="dc-progress-divider">/</span>
          <span class="dc-progress-total">5</span>
        </div>
        <div 
          class="dc-play__timer" 
          :class="{ 
            'dc-play__timer--warn': timer.remaining.value <= 60,
            'dc-play__timer--danger': timer.remaining.value <= 30
          }"
        >
          <span class="dc-timer-icon">⏱️</span>
          <span class="dc-timer-value">{{ timer.formattedTime }}</span>
        </div>
      </div>

      <div class="dc-play__progress-bar">
        <div 
          class="dc-progress-fill" 
          :style="{ width: ((currentIndex + 1) / 5 * 100) + '%' }"
        ></div>
        <div 
          class="dc-progress-glow"
          :style="{ left: ((currentIndex + 1) / 5 * 100) + '%' }"
        ></div>
      </div>

      <div class="dc-play__card">
        <div class="dc-play__difficulty">
          <span 
            v-for="n in 3" 
            :key="n" 
            class="dc-play__star" 
            :class="{ active: n <= currentQ.difficulty }"
          >★</span>
        </div>
        <p class="dc-play__question">{{ currentQ.text }}</p>

        <!-- Choice -->
        <div v-if="currentQ.type === 'choice'" class="dc-choices">
          <button
            v-for="(opt, i) in currentQ.options" 
            :key="i"
            class="dc-choice"
            :class="{
              'dc-choice--selected': !showFeedback && answers[currentIndex] === opt,
              'dc-choice--correct': showFeedback && opt === currentQ.answer,
              'dc-choice--wrong': showFeedback && opt === answers[currentIndex] && opt !== currentQ.answer
            }"
            :disabled="showFeedback"
            @click="handleAnswer({ answer: opt, isCorrect: opt === currentQ.answer })"
          >
            <span class="dc-choice__letter">{{ 'ABCD'[i] }}</span>
            <span class="dc-choice__text">{{ opt }}</span>
          </button>
        </div>

        <!-- Fill -->
        <div v-else class="dc-fill">
          <input
            v-model="answers[currentIndex]"
            type="number" 
            class="dc-fill__input"
            :class="{
              'dc-fill__input--correct': showFeedback && answers[currentIndex] === currentQ.answer,
              'dc-fill__input--wrong': showFeedback && answers[currentIndex] !== currentQ.answer
            }"
            placeholder="?" 
            :disabled="showFeedback"
            @keyup.enter="answers[currentIndex] && handleAnswer({ answer: answers[currentIndex]!, isCorrect: answers[currentIndex] === currentQ.answer })"
          />
          <button 
            v-if="!showFeedback" 
            class="dc-btn dc-btn--primary dc-fill__btn"
            :disabled="!answers[currentIndex]?.trim()"
            @click="handleAnswer({ answer: answers[currentIndex]!, isCorrect: answers[currentIndex] === currentQ.answer })"
          >
            提交
          </button>
        </div>

        <div v-if="showFeedback" class="dc-play__feedback">
          <div 
            class="dc-feedback-box"
            :class="answers[currentIndex] === currentQ.answer ? 'dc-feedback--correct' : 'dc-feedback--wrong'"
          >
            <span class="dc-feedback-icon">
              {{ answers[currentIndex] === currentQ.answer ? '✅' : '❌' }}
            </span>
            <span class="dc-feedback-text">
              {{ answers[currentIndex] === currentQ.answer ? '回答正确!' : `正确答案: ${currentQ.answer}` }}
            </span>
          </div>
          <button class="dc-btn dc-btn--primary" @click="nextQuestion">
            {{ currentIndex < 4 ? '下一题 →' : '查看结果' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Result -->
    <div v-else-if="phase === 'result'" class="dc-result">
      <div class="dc-result__hero">
        <div class="dc-result__icon">
          {{ score >= 4 ? '🏆' : score >= 2 ? '👍' : '💪' }}
        </div>
        <h2 class="dc-result__title">
          {{ score >= 4 ? '表现出色!' : score >= 2 ? '继续加油!' : '再接再厉!' }}
        </h2>
      </div>

      <div class="dc-result__score">
        <span class="dc-score-label">最终得分</span>
        <span 
          class="dc-score-big"
          :class="{ 
            'dc-score--excellent': score >= 4,
            'dc-score--good': score >= 2 && score < 4,
            'dc-score--poor': score < 2
          }"
        >
          {{ score }}/5
        </span>
      </div>

      <div class="dc-result__stats">
        <div class="dc-stat-item">
          <span class="dc-stat-value">{{ Math.round(score / 5 * 100) }}%</span>
          <span class="dc-stat-label">正确率</span>
        </div>
        <div class="dc-stat-item">
          <span class="dc-stat-value">{{ formatTime(timeUsed) }}</span>
          <span class="dc-stat-label">用时</span>
        </div>
        <div class="dc-stat-item dc-stat-item--highlight">
          <span class="dc-stat-value">+{{ expReward }}</span>
          <span class="dc-stat-label">经验值</span>
        </div>
      </div>

      <button class="dc-btn dc-btn--primary" @click="phase = 'intro'">
        <span>🏠</span>
        <span>返回首页</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.daily-challenge {
  max-width: 500px;
  margin: 0 auto;
  padding: 24px 0;
}

/* Intro Styles */
.dc-intro {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}

.dc-intro__hero {
  margin-bottom: 32px;
}

.dc-intro__icon {
  font-size: 80px;
  margin-bottom: 16px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.dc-intro__title {
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, #00d4ff, #7c3aed, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.dc-intro__subtitle {
  font-size: 14px;
  color: var(--text-tertiary);
  letter-spacing: 6px;
  margin-bottom: 16px;
}

.dc-intro__desc {
  color: var(--text-secondary);
  font-size: 16px;
}

.dc-intro__stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 32px;
}

.dc-stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.dc-stat-icon {
  font-size: 24px;
}

.dc-stat-number {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
}

.dc-stat-label {
  font-size: 12px;
  color: var(--text-tertiary);
}

.dc-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dc-btn--primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: white;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
}

.dc-btn--primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(99, 102, 241, 0.6);
}

.dc-btn--primary:disabled {
  background: var(--bg-hover);
  color: var(--text-tertiary);
  cursor: not-allowed;
  box-shadow: none;
}

.dc-btn-arrow {
  transition: transform 0.3s ease;
}

.dc-btn:hover:not(:disabled) .dc-btn-arrow {
  transform: translateX(4px);
}

.dc-intro__history {
  margin-top: 32px;
  text-align: left;
}

.dc-history-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.dc-history-icon {
  font-size: 18px;
}

.dc-history-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.dc-history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--bg-card);
  border-radius: 12px;
  margin-bottom: 12px;
  border: 1px solid var(--border-color);
}

.dc-history-date {
  color: var(--text-secondary);
  font-size: 14px;
}

.dc-score-value {
  font-size: 18px;
  font-weight: 700;
}

.score--excellent { color: var(--color-success); }
.score--good { color: var(--color-info); }
.score--poor { color: var(--color-error); }

.dc-history-time {
  color: var(--text-tertiary);
  font-size: 14px;
}

/* Play Styles */
.dc-play {
  max-width: 500px;
  margin: 0 auto;
}

.dc-play__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dc-play__progress {
  display: flex;
  align-items: baseline;
}

.dc-progress-current {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-primary);
}

.dc-progress-divider {
  color: var(--text-tertiary);
  margin: 0 4px;
}

.dc-progress-total {
  font-size: 16px;
  color: var(--text-tertiary);
}

.dc-play__timer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--bg-card);
  border-radius: 30px;
  border: 1px solid var(--border-color);
}

.dc-timer-icon {
  font-size: 16px;
}

.dc-timer-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-success);
  font-variant-numeric: tabular-nums;
}

.dc-play__timer--warn .dc-timer-value {
  color: var(--color-warning);
}

.dc-play__timer--danger .dc-timer-value {
  color: var(--color-error);
  animation: shake 0.5s infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.dc-play__progress-bar {
  position: relative;
  height: 8px;
  background: var(--bg-hover);
  border-radius: 4px;
  margin-bottom: 24px;
  overflow: visible;
}

.dc-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  border-radius: 4px;
  transition: width 0.3s ease;
}

.dc-progress-glow {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: var(--color-primary);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--color-primary), 0 0 20px var(--color-primary);
  transition: left 0.3s ease;
}

.dc-play__card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow-md);
}

.dc-play__difficulty {
  margin-bottom: 16px;
}

.dc-play__star {
  color: var(--bg-hover);
  font-size: 16px;
}

.dc-play__star.active {
  color: var(--color-warning);
}

.dc-play__question {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 24px;
}

.dc-choices {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dc-choice {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: var(--bg-hover);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.dc-choice:hover:not(:disabled) {
  border-color: rgba(99, 102, 241, 0.5);
  background: rgba(99, 102, 241, 0.05);
}

.dc-choice--selected {
  border-color: var(--color-primary);
  background: rgba(99, 102, 241, 0.1);
}

.dc-choice--correct {
  border-color: var(--color-success);
  background: rgba(34, 197, 94, 0.1);
}

.dc-choice--wrong {
  border-color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
}

.dc-choice__letter {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  background: var(--bg-hover);
}

.dc-choice--selected .dc-choice__letter {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.dc-choice--correct .dc-choice__letter {
  background: var(--color-success);
  border-color: var(--color-success);
  color: white;
}

.dc-choice--wrong .dc-choice__letter {
  background: var(--color-error);
  border-color: var(--color-error);
  color: white;
}

.dc-choice__text {
  font-size: 18px;
}

.dc-fill {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.dc-fill__input {
  width: 200px;
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  padding: 16px;
  background: var(--bg-hover);
  border: 3px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  outline: none;
  transition: all 0.2s ease;
}

.dc-fill__input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
}

.dc-fill__input--correct {
  border-color: var(--color-success);
  background: rgba(34, 197, 94, 0.1);
}

.dc-fill__input--wrong {
  border-color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
}

.dc-fill__input::placeholder {
  color: var(--text-tertiary);
}

.dc-fill__btn {
  width: 200px;
}

.dc-play__feedback {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.dc-feedback-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  border-radius: 30px;
}

.dc-feedback--correct {
  background: rgba(34, 197, 94, 0.15);
}

.dc-feedback--wrong {
  background: rgba(239, 68, 68, 0.15);
}

.dc-feedback-icon {
  font-size: 20px;
}

.dc-feedback-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

/* Result Styles */
.dc-result {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}

.dc-result__hero {
  margin-bottom: 24px;
}

.dc-result__icon {
  font-size: 80px;
  margin-bottom: 16px;
}

.dc-result__title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
}

.dc-result__score {
  margin-bottom: 32px;
}

.dc-score-label {
  display: block;
  font-size: 14px;
  color: var(--text-tertiary);
  margin-bottom: 8px;
}

.dc-score-big {
  font-size: 72px;
  font-weight: 800;
}

.dc-score--excellent {
  color: var(--color-success);
  text-shadow: 0 0 30px rgba(34, 197, 94, 0.5);
}

.dc-score--good {
  color: var(--color-info);
  text-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
}

.dc-score--poor {
  color: var(--color-error);
  text-shadow: 0 0 30px rgba(239, 68, 68, 0.5);
}

.dc-result__stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 32px;
}

.dc-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: var(--bg-card);
  border-radius: 12px;
  min-width: 90px;
  border: 1px solid var(--border-color);
}

.dc-stat-item--highlight {
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.dc-stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.dc-stat-label {
  font-size: 12px;
  color: var(--text-tertiary);
}
</style>