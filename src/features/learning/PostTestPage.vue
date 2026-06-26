<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QuizEngine from '@/components/practice/QuizEngine.vue'
import type { Exercise, AnswerResult } from '@/types/exercise'
import { loadQuestionBank } from '@/services/questionBankLoader'
import { getTopicAbility, abilityLabel, abilityColor } from '@/services/userAbility'
import { addWrongItem } from '@/services/wrongBookStore'
import { classifyError } from '@/services/exerciseEngine'

const route = useRoute()
const router = useRouter()

const topicId = computed(() => (route.params.topicId as string) || (route.params.id as string))
const topicName = ref('课后测试')
const loading = ref(true)
const error = ref<string | null>(null)
const bank = ref<Awaited<ReturnType<typeof loadQuestionBank>> | null>(null)
const testStarted = ref(false)
const testCompleted = ref(false)
const userAnswers = ref<AnswerResult[]>([])
const timeUsed = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const topicAbility = computed(() => getTopicAbility(topicId.value))
const abilityText = computed(() => abilityLabel(topicAbility.value.ability))
const abilityColorVal = computed(() => abilityColor(topicAbility.value.ability))

const totalCount = computed(() => userAnswers.value.length)
const correctCount = computed(() => userAnswers.value.filter(r => r.isCorrect).length)
const accuracy = computed(() => totalCount.value > 0 ? Math.round(correctCount.value / totalCount.value * 100) : 0)

async function startTest() {
  try {
    const data = await loadQuestionBank(topicId.value)
    if (!data || !data.exercises || data.exercises.length === 0) {
      error.value = '该知识点暂无测试题目，稍后再试'
      loading.value = false
      return
    }
    bank.value = data
    topicName.value = data.title || '课后测试'
    loading.value = false
    testStarted.value = true
    timeUsed.value = 0
    timer = setInterval(() => {
      timeUsed.value++
    }, 1000)
  } catch (e) {
    console.error('[PostTest] 加载失败:', e)
    error.value = '题库加载失败，请稍后重试'
    loading.value = false
  }
}

function handleComplete(results: AnswerResult[]) {
  userAnswers.value = results
  // 批量保存错题（作为补充，QuizEngine 已在答题时自动保存）
  for (const r of results) {
    if (!r.isCorrect) {
      const ex = bank.value?.exercises?.find(e => e.id === r.exerciseId)
      if (ex) {
        const layer = r.errorLayer || classifyError(r.userAnswer, ex.answer, ex.stem)
        addWrongItem(ex, r.userAnswer, layer, 'post_test')
      }
    }
  }
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  testCompleted.value = true
}

function handleWrong(exercise: Exercise, result: AnswerResult) {
  // 错题由 QuizEngine 自动保存，这里仅记录
  console.log('[PostTest] 错题:', exercise.id, result.userAnswer)
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}分${s}秒`
}

onMounted(async () => {
  await startTest()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function restart() {
  testStarted.value = false
  testCompleted.value = false
  userAnswers.value = []
  startTest()
}

function backToTopic() {
  router.push(`/learning/${topicId.value}`)
}

function goToWrongBook() {
  router.push('/profile/wrong-book')
}
</script>

<template>
  <div class="post-test">

    <!-- 加载中 -->
    <div v-if="loading" class="loading-box">
      <div class="spinner" aria-hidden="true" />
      <p>正在加载题库...</p>
    </div>

    <!-- 加载失败 -->
    <div v-else-if="error" class="error-box">
      <div class="error-icon">⚠️</div>
      <h2>{{ error }}</h2>
      <div class="error-actions">
        <button class="btn" @click="startTest">重试</button>
        <button class="btn btn--ghost" @click="backToTopic">返回知识点</button>
      </div>
    </div>

    <!-- 测试未开始（其实会自动开始） -->
    <div v-else-if="!testStarted && !testCompleted" class="intro-card">
      <div class="intro-icon">🎯</div>
      <h2>{{ topicName }} 课后测试</h2>
      <p>通过 5-10 道精选题目，检测你对这个知识点的掌握程度</p>
      <button class="btn btn--primary" @click="startTest">开始测试</button>
    </div>

    <!-- 测试进行中 -->
    <div v-else-if="testStarted && !testCompleted" class="quiz-wrapper">
      <div class="quiz-header">
        <div class="quiz-header__meta">
          <span class="quiz-header__title">📚 {{ topicName }}</span>
          <span class="quiz-header__badge">课后测试</span>
        </div>
        <div class="quiz-header__ability">
          <span class="quiz-header__ability-label">当前水平</span>
          <span class="quiz-header__ability-value" :style="{ color: abilityColorVal }">{{ abilityText }}</span>
        </div>
      </div>

      <QuizEngine
        v-if="bank && bank.exercises && bank.exercises.length > 0"
        :exercises="bank.exercises.slice(0, Math.min(8, bank.exercises.length))"
        :knowledge-points="[topicId]"
        @complete="handleComplete"
        @wrong="handleWrong"
      />
    </div>

    <!-- 测试完成 -->
    <div v-else-if="testCompleted" class="result-card">
      <div class="result-icon">{{ accuracy >= 80 ? '🏆' : accuracy >= 60 ? '👍' : '💪' }}</div>
      <h2 class="result-title">
        {{ accuracy >= 80 ? '非常棒！' : accuracy >= 60 ? '不错哦！' : '继续加油！' }}
      </h2>
      <p class="result-subtitle">{{ topicName }} 测试完成</p>

      <div class="result-stats">
        <div class="stat-item">
          <div class="stat-value" style="color: var(--color-primary)">{{ correctCount }} / {{ totalCount }}</div>
          <div class="stat-label">答对题数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" style="color: var(--color-success)">{{ accuracy }}%</div>
          <div class="stat-label">正确率</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" style="color: var(--color-warning)">{{ formatTime(timeUsed) }}</div>
          <div class="stat-label">用时</div>
        </div>
      </div>

      <div class="result-feedback">
        <div v-if="accuracy >= 80" class="feedback-text">
          💡 这个知识点你掌握得很好！可以挑战更难的题目，或者去看看其他知识点。
        </div>
        <div v-else-if="accuracy >= 60" class="feedback-text">
          💡 你已经掌握了基础知识，但还有一些细节需要注意。建议重做一轮错题，或者回顾一下例题。
        </div>
        <div v-else class="feedback-text">
          💡 这个知识点还需要多练习。建议先回顾一下知识点讲解，从最简单的题目开始，循序渐进。
        </div>
      </div>

      <div class="result-actions">
        <button class="btn btn--primary" @click="restart">🔄 再练一轮</button>
        <button class="btn btn--secondary" @click="goToWrongBook">📝 查看错题</button>
        <button class="btn btn--ghost" @click="backToTopic">📖 返回学习</button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.post-test {
  max-width: var(--content-max-width, 900px);
  margin: 0 auto;
  padding: 24px 16px 60px;
}

.loading-box, .error-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  gap: 16px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border-color, #e5e7eb);
  border-top-color: var(--color-primary, #FF8C42);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon { font-size: 48px; }
.error-box h2 { color: var(--text-primary, #1f2937); font-size: 20px; margin: 0; }

.error-actions, .result-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 24px;
}

.btn {
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}

.btn--primary {
  background: linear-gradient(135deg, #FF8C42 0%, #F37522 100%);
  color: #fff;
  box-shadow: 0 4px 14px rgba(255, 140, 66, 0.35);
}

.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 140, 66, 0.45);
}

.btn--secondary {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: #fff;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
}

.btn--secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
}

.btn--ghost {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn--ghost:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.intro-card {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 40px 24px;
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.intro-icon { font-size: 56px; margin-bottom: 16px; }
.intro-card h2 { color: var(--text-primary); margin: 0 0 12px; font-size: 24px; }
.intro-card p { color: var(--text-secondary); margin: 0 0 24px; }

.quiz-wrapper {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border-color, #e5e7eb);
}

.quiz-header__meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quiz-header__title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary, #1f2937);
}

.quiz-header__badge {
  padding: 4px 12px;
  background: linear-gradient(135deg, #FF8C42, #F37522);
  color: #fff;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

.quiz-header__ability {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quiz-header__ability-label {
  font-size: 12px;
  color: var(--text-secondary, #4b5563);
}

.quiz-header__ability-value {
  font-size: 13px;
  font-weight: 700;
}

.result-card {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 40px 24px;
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.result-icon { font-size: 64px; margin-bottom: 16px; animation: bounce 1s ease; }
.result-title { color: var(--text-primary); font-size: 28px; margin: 0 0 8px; font-weight: 800; }
.result-subtitle { color: var(--text-secondary); margin: 0 0 32px; }

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.result-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.stat-item {
  background: var(--bg-card, #fff);
  border: 2px solid var(--border-color, #e5e7eb);
  border-radius: 16px;
  padding: 16px 12px;
}

.stat-value {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary, #4b5563);
}

.result-feedback {
  background: linear-gradient(135deg, #FFF1E6, #FFE4D2);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 32px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.feedback-text {
  color: var(--text-primary, #1f2937);
  font-size: 14px;
  line-height: 1.6;
}

@media (max-width: 640px) {
  .post-test { padding: 16px 12px 40px; }
  .quiz-header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .result-stats { grid-template-columns: 1fr; }
}
</style>
