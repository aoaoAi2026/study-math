<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
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
  return makeFill(`${a} \u00d7 ${b} = ?`, String(a * b), r)
}
function genDiv(r: () => number): Question {
  const b = Math.floor(r() * 11) + 2, ans = Math.floor(r() * 12) + 2, a = b * ans
  return makeFill(`${a} \u00f7 ${b} = ?`, String(ans), r)
}
function genMixed(r: () => number): Question {
  const a = Math.floor(r() * 20) + 5, b = Math.floor(r() * 20) + 5, c = Math.floor(r() * 10) + 1
  const ans = a + b * c
  return makeChoice(`${a} + ${b} \u00d7 ${c} = ?`, ans, r)
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
  <AppLayout>
    <div class="daily-challenge">
      <!-- Intro -->
      <div v-if="phase === 'intro'" class="dc-intro">
        <div class="dc-intro__icon">&#9889;</div>
        <h1 class="dc-intro__title">每日挑战</h1>
        <p class="dc-intro__desc">每天5道数学题，限时5分钟，赢取经验值奖励</p>
        <div class="dc-intro__rules">
          <div class="dc-intro__rule"><span class="dc-intro__rule-num">5</span>道题目</div>
          <div class="dc-intro__rule"><span class="dc-intro__rule-num">5</span>分钟限时</div>
          <div class="dc-intro__rule"><span class="dc-intro__rule-num">+50</span>经验值</div>
        </div>
        <button class="dc-btn dc-btn--primary" :disabled="completedToday" @click="startChallenge">
          {{ completedToday ? '今日已完成' : '开始挑战' }}
        </button>
        <div v-if="history.length" class="dc-intro__history">
          <h3>历史记录</h3>
          <div v-for="r in history.slice(-5).reverse()" :key="r.id" class="dc-history-item">
            <span class="dc-history-item__date">{{ r.date }}</span>
            <span class="dc-history-item__score">{{ r.correctCount }}/{{ r.totalQuestions }}</span>
            <span class="dc-history-item__time">{{ formatTime(r.timeUsed) }}</span>
          </div>
        </div>
      </div>

      <!-- Playing -->
      <div v-else-if="phase === 'playing' && currentQ" class="dc-play">
        <div class="dc-play__header">
          <div class="dc-play__progress">{{ currentIndex + 1 }} / 5</div>
          <div class="dc-play__timer" :class="{ 'dc-play__timer--warn': timer.remaining.value <= 60 }">
            {{ timer.formattedTime }}
          </div>
        </div>
        <div class="dc-play__bar">
          <div class="dc-play__bar-fill" :style="{ width: ((currentIndex + 1) / 5 * 100) + '%' }"></div>
        </div>
        <div class="dc-play__card">
          <div class="dc-play__difficulty">
            <span v-for="n in 3" :key="n" class="dc-play__star" :class="{ active: n <= currentQ.difficulty }">&#9733;</span>
          </div>
          <p class="dc-play__text">{{ currentQ.text }}</p>
          <!-- Choice -->
          <div v-if="currentQ.type === 'choice'" class="dc-choices">
            <button
              v-for="(opt, i) in currentQ.options" :key="i"
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
              <span>{{ opt }}</span>
            </button>
          </div>
          <!-- Fill -->
          <div v-else class="dc-fill">
            <input
              v-model="answers[currentIndex]"
              type="text" class="dc-fill__input"
              :class="{
                'dc-fill__input--correct': showFeedback && answers[currentIndex] === currentQ.answer,
                'dc-fill__input--wrong': showFeedback && answers[currentIndex] !== currentQ.answer
              }"
              placeholder="输入答案" :disabled="showFeedback"
              @keyup.enter="answers[currentIndex] && handleAnswer({ answer: answers[currentIndex]!, isCorrect: answers[currentIndex] === currentQ.answer })"
            />
            <button v-if="!showFeedback" class="dc-btn dc-btn--primary dc-fill__btn"
              :disabled="!answers[currentIndex]?.trim()"
              @click="handleAnswer({ answer: answers[currentIndex]!, isCorrect: answers[currentIndex] === currentQ.answer })">
              提交
            </button>
          </div>
          <div v-if="showFeedback" class="dc-play__feedback">
            <span :class="answers[currentIndex] === currentQ.answer ? 'dc-feedback--ok' : 'dc-feedback--fail'">
              {{ answers[currentIndex] === currentQ.answer ? '回答正确!' : `正确答案: ${currentQ.answer}` }}
            </span>
            <button class="dc-btn dc-btn--primary" @click="nextQuestion">
              {{ currentIndex < 4 ? '下一题' : '查看结果' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Result -->
      <div v-else-if="phase === 'result'" class="dc-result">
        <div class="dc-result__icon">{{ score >= 4 ? '&#127942;' : '&#128170;' }}</div>
        <h2 class="dc-result__title">{{ score >= 4 ? '表现出色!' : '继续加油!' }}</h2>
        <div class="dc-result__stats">
          <div class="dc-stat"><div class="dc-stat__value">{{ score }}/5</div><div class="dc-stat__label">正确题数</div></div>
          <div class="dc-stat"><div class="dc-stat__value">{{ Math.round(score / 5 * 100) }}%</div><div class="dc-stat__label">正确率</div></div>
          <div class="dc-stat"><div class="dc-stat__value">{{ formatTime(timeUsed) }}</div><div class="dc-stat__label">用时</div></div>
          <div class="dc-stat"><div class="dc-stat__value">+{{ expReward }}</div><div class="dc-stat__label">经验值</div></div>
        </div>
        <button class="dc-btn dc-btn--primary" @click="phase = 'intro'">返回</button>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.daily-challenge { max-width: 600px; margin: 0 auto; }

.dc-intro { text-align: center; padding: var(--space-8) var(--space-4); }
.dc-intro__icon { font-size: 3rem; margin-bottom: var(--space-4); }
.dc-intro__title { font-size: var(--text-3xl); color: var(--text-primary); margin-bottom: var(--space-2); }
.dc-intro__desc { color: var(--text-secondary); margin-bottom: var(--space-6); }
.dc-intro__rules { display: flex; justify-content: center; gap: var(--space-6); margin-bottom: var(--space-8); }
.dc-intro__rule { display: flex; flex-direction: column; align-items: center; gap: var(--space-1); color: var(--text-secondary); font-size: var(--text-sm); }
.dc-intro__rule-num { font-size: var(--text-2xl); font-weight: 700; color: var(--color-primary); }
.dc-intro__history { margin-top: var(--space-8); text-align: left; }
.dc-intro__history h3 { font-size: var(--text-lg); color: var(--text-primary); margin-bottom: var(--space-3); }
.dc-history-item { display: flex; justify-content: space-between; padding: var(--space-3) var(--space-4); background: var(--bg-card); border-radius: var(--radius-md); margin-bottom: var(--space-2); border: 1px solid var(--border-color); }
.dc-history-item__date { color: var(--text-secondary); }
.dc-history-item__score { font-weight: 600; color: var(--color-primary); }
.dc-history-item__time { color: var(--text-tertiary); font-size: var(--text-sm); }

.dc-play__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3); }
.dc-play__progress { font-weight: 600; color: var(--text-primary); }
.dc-play__timer { font-size: var(--text-lg); font-weight: 700; color: var(--color-primary); font-variant-numeric: tabular-nums; }
.dc-play__timer--warn { color: var(--color-error); animation: pulse 1s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
.dc-play__bar { height: 6px; background: var(--bg-hover); border-radius: var(--radius-full); margin-bottom: var(--space-6); overflow: hidden; }
.dc-play__bar-fill { height: 100%; background: var(--color-primary); border-radius: var(--radius-full); transition: width var(--transition-normal); }
.dc-play__card { background: var(--bg-card); border-radius: var(--radius-xl); padding: var(--space-6); box-shadow: var(--shadow-md); border: 1px solid var(--border-color); }
.dc-play__difficulty { margin-bottom: var(--space-3); }
.dc-play__star { color: var(--border-color); font-size: var(--text-sm); }
.dc-play__star.active { color: var(--color-secondary); }
.dc-play__text { font-size: var(--text-xl); font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-6); }

.dc-choices { display: flex; flex-direction: column; gap: var(--space-3); }
.dc-choice { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-4); background: var(--bg-hover); border: 2px solid var(--border-color); border-radius: var(--radius-lg); text-align: left; transition: all var(--transition-fast); cursor: pointer; color: var(--text-primary); }
.dc-choice:hover:not(:disabled) { border-color: var(--color-primary); }
.dc-choice--selected { border-color: var(--color-primary); background: rgba(99,102,241,0.08); }
.dc-choice--correct { border-color: var(--color-success); background: rgba(16,185,129,0.08); }
.dc-choice--wrong { border-color: var(--color-error); background: rgba(239,68,68,0.08); }
.dc-choice__letter { width: 28px; height: 28px; border-radius: var(--radius-full); border: 2px solid var(--border-color); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: var(--text-sm); color: var(--text-secondary); flex-shrink: 0; background: var(--bg-card); }
.dc-choice--selected .dc-choice__letter { background: var(--color-primary); border-color: var(--color-primary); color: #fff; }
.dc-choice--correct .dc-choice__letter { background: var(--color-success); border-color: var(--color-success); color: #fff; }
.dc-choice--wrong .dc-choice__letter { background: var(--color-error); border-color: var(--color-error); color: #fff; }

.dc-fill { display: flex; flex-direction: column; gap: var(--space-3); }
.dc-fill__input { width: 100%; padding: var(--space-4); font-size: var(--text-lg); text-align: center; border: 2px solid var(--border-color); border-radius: var(--radius-lg); background: var(--bg-hover); transition: all var(--transition-fast); color: var(--text-primary); }
.dc-fill__input:focus { border-color: var(--color-primary); background: var(--bg-card); outline: none; }
.dc-fill__input--correct { border-color: var(--color-success); background: rgba(16,185,129,0.08); }
.dc-fill__input--wrong { border-color: var(--color-error); background: rgba(239,68,68,0.08); }
.dc-fill__btn { align-self: center; }

.dc-play__feedback { margin-top: var(--space-6); text-align: center; display: flex; flex-direction: column; align-items: center; gap: var(--space-4); }
.dc-feedback--ok { color: var(--color-success); font-weight: 600; font-size: var(--text-lg); }
.dc-feedback--fail { color: var(--color-error); font-weight: 600; font-size: var(--text-lg); }

.dc-btn { padding: var(--space-3) var(--space-8); border-radius: var(--radius-lg); font-weight: 600; font-size: var(--text-base); border: none; cursor: pointer; transition: all var(--transition-fast); }
.dc-btn--primary { background: var(--color-primary); color: #fff; }
.dc-btn--primary:hover:not(:disabled) { background: var(--color-primary-dark); }
.dc-btn--primary:disabled { background: var(--bg-active); color: var(--text-tertiary); cursor: not-allowed; }

.dc-result { text-align: center; padding: var(--space-8) var(--space-4); }
.dc-result__icon { font-size: 3rem; margin-bottom: var(--space-4); }
.dc-result__title { font-size: var(--text-2xl); color: var(--text-primary); margin-bottom: var(--space-8); }
.dc-result__stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-4); margin-bottom: var(--space-8); }
.dc-stat { background: var(--bg-card); border-radius: var(--radius-lg); padding: var(--space-5); border: 1px solid var(--border-color); }
.dc-stat__value { font-size: var(--text-2xl); font-weight: 700; color: var(--color-primary); }
.dc-stat__label { font-size: var(--text-sm); color: var(--text-secondary); margin-top: var(--space-1); }
</style>
