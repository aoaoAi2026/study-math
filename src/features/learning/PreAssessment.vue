<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import QuizEngine, { type AnswerResult } from '@/components/practice/QuizEngine.vue'
import { findByKnowledge, EXERCISE_POOL, randomPick } from '@/stores/exerciseData'
import type { Exercise } from '@/types/exercise'

const route = useRoute()
const knowledgeId = computed(() => String(route.params.topicId || ''))

const allTopics: Record<string, string> = {
  'g1-addition-within-20': '20以内加减法', 'g1-word-problem-1st': '一年级应用题',
  'g1-counting-game': '趣味数数',
  'g2-multiplication-table': '乘法口诀',
  'g3-sum-multiple': '和倍问题', 'g3-diff-multiple': '差倍问题', 'g3-sum-diff': '和差问题',
  'g3-planting-trees': '植树问题', 'g3-chicken-rabbit': '鸡兔同笼',
  'g4-age-problem': '年龄问题', 'g4-area-perimeter': '面积与周长',
  'g5-profit-loss': '利润与亏损', 'g5-simple-equation': '简易方程',
  'g5-fraction-split': '分数的拆分', 'g5-fraction-add-sub': '分数加减法',
  'g5-number-theory': '数论初步', 'g5-geometry-model': '几何模型',
  'g6-travel-problem': '行程问题', 'g6-circle-area': '圆的周长与面积'
}

const topicTitle = computed(() => allTopics[knowledgeId.value] ?? knowledgeId.value)

const exercises = computed((): Exercise[] => {
  const pool = findByKnowledge(knowledgeId.value)
  return pool.length ? randomPick(pool, 5) : randomPick(EXERCISE_POOL, 5)
})

type Stage = 'intro' | 'quiz' | 'result'
const stage = ref<Stage>('intro')

const results = ref<AnswerResult[]>([])

const correctCount = computed(() => results.value.filter(r => r.isCorrect).length)
const totalCount = computed(() => results.value.length || 5)
const accuracy = computed(() => totalCount.value ? Math.round((correctCount.value / totalCount.value) * 100) : 0)
const wrongAnswers = computed(() => {
  return results.value.filter(r => !r.isCorrect).map(r => {
    const ex = exercises.value.find(e => e.id === r.exerciseId)
    return { result: r, exercise: ex }
  })
})

const level = computed(() => {
  if (accuracy.value >= 80) return 'high'
  if (accuracy.value >= 50) return 'mid'
  return 'low'
})

const recommendation = computed(() => {
  if (level.value === 'high') {
    return { icon: '🚀', title: '掌握良好，建议进阶', desc: '你已掌握基础内容，可跳过基础讲解，直接挑战进阶例题与综合练习。' }
  }
  if (level.value === 'mid') {
    return { icon: '📖', title: '基础尚可，继续学习', desc: '你对本专题有一定了解，但仍有易错点。建议按顺序学习课件，重点关注错题。' }
  }
  return { icon: '🌱', title: '建议从基础开始', desc: '本专题的基础知识需要加强。请从概念讲解入手，循序渐进地掌握每个要点。' }
})

function startQuiz() {
  stage.value = 'quiz'
}

function handleComplete(rs: AnswerResult[]) {
  results.value = rs
  stage.value = 'result'
}

function goBack() {
  if (stage.value === 'quiz' || stage.value === 'result') {
    stage.value = 'intro'
    results.value = []
    return
  }
  history.back()
}

function retake() {
  results.value = []
  stage.value = 'intro'
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '')
}
</script>

<template>
  <div class="pa">
    <button class="pa__back" @click="goBack">← 返回</button>

    <!-- 说明阶段 -->
    <section v-if="stage === 'intro'" class="pa__card pa__intro">
      <div class="pa__badge">前置检测</div>
      <h1 class="pa__title">{{ topicTitle }}</h1>
      <p class="pa__desc">本检测将评估你对当前知识点的掌握程度，帮助安排更合适的学习路径。</p>

      <ul class="pa__info">
        <li><span class="pa__info-icon">📝</span><span>共 <b>5 道题</b></span></li>
        <li><span class="pa__info-icon">⏱️</span><span>大约 <b>5 分钟</b></span></li>
        <li><span class="pa__info-icon">🎯</span><span>自适应难度</span></li>
      </ul>

      <button class="pa__start-btn" @click="startQuiz">开始检测</button>
    </section>

    <!-- 测验阶段 -->
    <section v-else-if="stage === 'quiz'" class="pa__quiz">
      <h2 class="pa__quiz-title">{{ topicTitle }} · 前置检测</h2>
      <QuizEngine :exercises="exercises" @complete="handleComplete" />
    </section>

    <!-- 结果阶段 -->
    <section v-else class="pa__card pa__result">
      <div class="pa__result-head">
        <div class="pa__score" :class="`pa__score--${level}`">{{ accuracy }}<span>%</span></div>
        <div class="pa__score-meta">
          <div class="pa__score-title">检测完成</div>
          <div class="pa__score-sub">答对 {{ correctCount }} / {{ totalCount }} 题</div>
        </div>
      </div>

      <div class="pa__reco" :class="`pa__reco--${level}`">
        <div class="pa__reco-icon">{{ recommendation.icon }}</div>
        <div class="pa__reco-body">
          <div class="pa__reco-title">{{ recommendation.title }}</div>
          <div class="pa__reco-desc">{{ recommendation.desc }}</div>
        </div>
      </div>

      <div v-if="wrongAnswers.length" class="pa__wrong">
        <div class="pa__wrong-title">📋 错题回顾</div>
        <div
          v-for="(item, idx) in wrongAnswers"
          :key="item.result.exerciseId"
          class="pa__wrong-item"
        >
          <div class="pa__wrong-num">第 {{ idx + 1 }} 题</div>
          <div class="pa__wrong-stem">{{ item.exercise ? stripHtml(item.exercise.stem) : '' }}</div>
          <div class="pa__wrong-answers">
            <div class="pa__wrong-cell">
              <span class="pa__wrong-label">你的答案</span>
              <span class="pa__wrong-value pa__wrong-value--wrong">{{ item.result.userAnswer || '（未作答）' }}</span>
            </div>
            <div class="pa__wrong-cell">
              <span class="pa__wrong-label">正确答案</span>
              <span class="pa__wrong-value pa__wrong-value--correct">{{ item.exercise?.answer }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="pa__result-actions">
        <button class="pa__btn pa__btn--ghost" @click="retake">🔄 重新检测</button>
        <button class="pa__btn pa__btn--primary" @click="goBack">← 返回专题</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.pa {
  max-width: 700px;
  margin: 0 auto;
  padding: var(--space-4);
  color: var(--text-primary);
}

.pa__back {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  cursor: pointer;
  display: block;
  margin-bottom: var(--space-4);
}
.pa__back:hover { color: var(--color-primary); }

.pa__card {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-8) var(--space-6);
  box-shadow: var(--shadow-md);
}

/* 说明阶段 */
.pa__intro { text-align: center; }
.pa__badge {
  display: inline-block;
  padding: var(--space-1) var(--space-4);
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-primary);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 500;
  margin-bottom: var(--space-4);
}
.pa__title {
  font-size: var(--text-3xl);
  margin: 0 0 var(--space-3);
  color: var(--text-primary);
}
.pa__desc {
  color: var(--text-secondary);
  font-size: var(--text-base);
  margin: 0 auto var(--space-6);
  max-width: 480px;
  line-height: 1.6;
}

.pa__info {
  list-style: none;
  padding: var(--space-4);
  margin: 0 auto var(--space-8);
  background: var(--bg-hover);
  border-radius: var(--radius-lg);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-2);
  max-width: 520px;
}
.pa__info li {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
.pa__info-icon { font-size: 20px; }
.pa__info b { color: var(--text-primary); font-weight: 600; }

.pa__start-btn {
  padding: var(--space-4) var(--space-12);
  background: var(--color-primary);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--text-lg);
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
  transition: all 0.15s;
}
.pa__start-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

/* 测验阶段 */
.pa__quiz-title {
  text-align: center;
  font-size: var(--text-xl);
  margin: 0 0 var(--space-6);
  color: var(--text-primary);
}

/* 结果阶段 */
.pa__result-head {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--bg-hover);
  margin-bottom: var(--space-6);
}
.pa__score {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  font-weight: 700;
  flex-shrink: 0;
  color: var(--color-primary);
  background: rgba(99, 102, 241, 0.1);
}
.pa__score span { font-size: var(--text-lg); margin-left: 2px; }
.pa__score--high { color: var(--color-success); background: rgba(16, 185, 129, 0.12); }
.pa__score--mid { color: var(--color-warning); background: rgba(245, 158, 11, 0.15); }
.pa__score--low { color: #ef4444; background: rgba(239, 68, 68, 0.12); }

.pa__score-title {
  font-size: var(--text-xl);
  font-weight: 600;
  margin-bottom: var(--space-1);
}
.pa__score-sub { color: var(--text-secondary); font-size: var(--text-sm); }

.pa__reco {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-5);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-6);
  background: rgba(99, 102, 241, 0.06);
  border-left: 4px solid var(--color-primary);
}
.pa__reco--high { background: rgba(16, 185, 129, 0.08); border-left-color: var(--color-success); }
.pa__reco--mid { background: rgba(245, 158, 11, 0.1); border-left-color: var(--color-warning); }
.pa__reco--low { background: rgba(239, 68, 68, 0.08); border-left-color: #ef4444; }

.pa__reco-icon { font-size: 32px; line-height: 1; }
.pa__reco-title { font-size: var(--text-lg); font-weight: 600; margin-bottom: var(--space-1); }
.pa__reco-desc { color: var(--text-secondary); font-size: var(--text-sm); line-height: 1.6; }

.pa__wrong { margin-bottom: var(--space-6); }
.pa__wrong-title {
  font-size: var(--text-base);
  font-weight: 600;
  margin-bottom: var(--space-3);
}
.pa__wrong-item {
  background: var(--bg-hover);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-3);
}
.pa__wrong-num {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin-bottom: var(--space-2);
}
.pa__wrong-stem {
  font-size: var(--text-base);
  color: var(--text-primary);
  line-height: 1.5;
  margin-bottom: var(--space-3);
}
.pa__wrong-answers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}
.pa__wrong-cell {
  background: var(--bg-card);
  padding: var(--space-3);
  border-radius: var(--radius-lg);
}
.pa__wrong-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-bottom: var(--space-1);
}
.pa__wrong-value { font-weight: 600; font-size: var(--text-base); }
.pa__wrong-value--wrong { color: #ef4444; }
.pa__wrong-value--correct { color: var(--color-success); }

.pa__result-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  flex-wrap: wrap;
}
.pa__btn {
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-full);
  font-size: var(--text-base);
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
}
.pa__btn--primary {
  background: var(--color-primary);
  color: var(--text-inverse);
}
.pa__btn--primary:hover { background: var(--color-primary-dark); }
.pa__btn--ghost {
  background: var(--bg-hover);
  color: var(--text-primary);
}
.pa__btn--ghost:hover { background: var(--border-color, #e2e8f0); }

@media (max-width: 640px) {
  .pa__card { padding: var(--space-6) var(--space-4); }
  .pa__info { grid-template-columns: 1fr; }
  .pa__info li { flex-direction: row; justify-content: center; }
  .pa__result-head { flex-direction: column; text-align: center; }
  .pa__wrong-answers { grid-template-columns: 1fr; }
}
</style>
