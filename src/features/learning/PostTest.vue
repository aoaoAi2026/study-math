<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import QuizEngine, { type AnswerResult } from '@/components/practice/QuizEngine.vue'
import { findByKnowledge, EXERCISE_POOL, randomPick } from '@/stores/exerciseData'
import type { Exercise } from '@/types/exercise'

const props = defineProps<{ knowledgeId: string }>()
const emit = defineEmits<{ (e: 'continue'): void }>()

const allTopics: Record<string, string> = {
  'g1-number': '认识数字', 'g1-add-sub': '20以内加减法', 'g1-shape': '认识图形',
  'g1-compare': '比多少', 'g1-queue': '排队问题', 'g1-match': '趣味搭配', 'g1-logic': '简单推理',
  'g2-table': '乘法口诀', 'g2-division': '表内除法', 'g2-angle': '角的初步认识',
  'g2-interval': '间隔问题', 'g2-age': '年龄问题', 'g2-move': '移多补少',
  'g2-number-arr': '数字谜', 'g2-count': '数数图形',
  'g3-multi-digit': '多位数乘除', 'g3-fraction': '分数初步', 'g3-area': '面积计算',
  'sum-multiple': '和倍问题', 'diff-multiple': '差倍问题', 'sum-diff': '和差问题',
  'g3-arithmetic': '等差数列', 'g3-plant': '植树问题', 'g3-cycle': '周期问题',
  'g3-square': '方阵问题',
  'g4-decimal': '小数运算', 'g4-angle-calc': '角的度量', 'g4-triangle': '三角形',
  'chicken-rabbit': '鸡兔同笼', 'profit-loss': '盈亏问题', 'g4-average': '平均数问题',
  'g4-meet': '相遇问题', 'g4-chase': '追及问题', 'g4-count-geo': '几何计数',
  'g4-define': '定义新运算',
  'g5-decimal-calc': '小数混合运算', 'g5-equation': '简易方程',
  'g5-area-poly': '多边形面积', 'g5-train': '火车过桥', 'g5-boat': '流水行船',
  'g5-work': '工程问题', 'fraction-split': '分数裂项', 'g5-ratio': '比和比例',
  'g5-circular': '圆与扇形', 'g5-pigeon': '抽屉原理', 'g5-inclusion': '容斥原理',
  'g6-percent': '百分数', 'g6-cylinder': '圆柱圆锥', 'g6-ratio-app': '比例应用',
  'travel-problem': '行程问题综合', 'g6-concentration': '浓度问题',
  'g6-economic': '经济问题', 'g6-combination': '组合计数',
  'g6-number-theory': '数论初步', 'g6-geometry': '几何变换'
}

const topicTitle = computed(() => allTopics[props.knowledgeId] ?? props.knowledgeId)
const STORAGE_KEY = () => `post-test-best:${props.knowledgeId}`

const exercises = computed((): Exercise[] => {
  const pool = findByKnowledge(props.knowledgeId)
  return pool.length ? randomPick(pool, 3) : randomPick(EXERCISE_POOL, 3)
})

type Stage = 'intro' | 'quiz' | 'result'
type MasteryLevel = 'none' | 'partial' | 'full'

const stage = ref<Stage>('intro')
const results = ref<AnswerResult[]>([])
const bestScore = ref<number | null>(null)

const correctCount = computed(() => results.value.filter(r => r.isCorrect).length)
const totalCount = computed(() => results.value.length || 3)
const accuracy = computed(() => (totalCount.value ? Math.round((correctCount.value / totalCount.value) * 100) : 0))

const masteryLevel = computed<MasteryLevel>(() => {
  if (accuracy.value >= 100) return 'full'
  if (accuracy.value >= 66) return 'partial'
  return 'none'
})

const masteryInfo = computed(() => {
  const map: Record<MasteryLevel, { label: string; icon: string; color: string; desc: string }> = {
    full: { label: '完全掌握', icon: '🏆', color: 'success', desc: '太棒了！你已完全掌握本知识点，可以继续学习后续内容。' },
    partial: { label: '初步掌握', icon: '📚', color: 'warning', desc: '有一定基础，但还不够稳固。建议再挑战一次，巩固薄弱点。' },
    none: { label: '尚未掌握', icon: '🌱', color: 'error', desc: '本知识点还需要加强。建议回顾相关讲解，再次挑战检测。' }
  }
  return map[masteryLevel.value]
})

const answerDetails = computed(() => {
  return results.value.map((r, i) => {
    const ex = exercises.value.find(e => e.id === r.exerciseId)
    return { index: i + 1, result: r, exercise: ex }
  })
})

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY())
    if (raw) bestScore.value = parseInt(raw, 10) || null
  } catch {}
})

function startQuiz() {
  results.value = []
  stage.value = 'quiz'
}

function handleComplete(rs: AnswerResult[]) {
  results.value = rs
  if (accuracy.value > (bestScore.value ?? 0)) {
    bestScore.value = accuracy.value
    try { localStorage.setItem(STORAGE_KEY(), String(accuracy.value)) } catch {}
  }
  stage.value = 'result'
}

function retake() {
  stage.value = 'intro'
  results.value = []
}

function continueLearning() {
  emit('continue')
}

function goBack() {
  if (stage.value === 'quiz' || stage.value === 'result') {
    stage.value = 'intro'
    results.value = []
    return
  }
  history.back()
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '')
}
</script>

<template>
  <div class="pt">
    <button class="pt__back" @click="goBack">← 返回</button>

    <!-- 说明阶段 -->
    <section v-if="stage === 'intro'" class="pt__card pt__intro">
      <div class="pt__badge">掌握检测</div>
      <h1 class="pt__title">{{ topicTitle }}</h1>
      <p class="pt__desc">学完知识点后的小测验，帮你检验是否真正掌握了关键内容。</p>

      <ul class="pt__info">
        <li><span class="pt__info-icon">📝</span><span>共 <b>3 道题</b></span></li>
        <li><span class="pt__info-icon">♻️</span><span>可<b>多次尝试</b></span></li>
        <li><span class="pt__info-icon">⭐</span><span>记录<b>最佳成绩</b></span></li>
      </ul>

      <div v-if="bestScore !== null" class="pt__best">
        历史最佳成绩：<b>{{ bestScore }}%</b>
      </div>

      <button class="pt__start-btn" @click="startQuiz">开始检测</button>
    </section>

    <!-- 测验阶段 -->
    <section v-else-if="stage === 'quiz'" class="pt__quiz">
      <h2 class="pt__quiz-title">{{ topicTitle }} · 掌握检测</h2>
      <QuizEngine :exercises="exercises" @complete="handleComplete" />
    </section>

    <!-- 结果阶段 -->
    <section v-else class="pt__card pt__result">
      <div class="pt__result-head">
        <div class="pt__score" :class="`pt__score--${masteryLevel}`">{{ accuracy }}<span>%</span></div>
        <div class="pt__score-meta">
          <div class="pt__score-title">检测完成</div>
          <div class="pt__score-sub">答对 {{ correctCount }} / {{ totalCount }} 题</div>
        </div>
      </div>

      <div class="pt__mastery" :class="`pt__mastery--${masteryInfo.color}`">
        <div class="pt__mastery-icon">{{ masteryInfo.icon }}</div>
        <div class="pt__mastery-body">
          <div class="pt__mastery-title">掌握等级：{{ masteryInfo.label }}</div>
          <div class="pt__mastery-desc">{{ masteryInfo.desc }}</div>
        </div>
      </div>

      <div class="pt__details">
        <div class="pt__details-title">📋 答题详情</div>
        <div
          v-for="item in answerDetails"
          :key="item.result.exerciseId"
          class="pt__details-item"
          :class="{ 'pt__details-item--correct': item.result.isCorrect, 'pt__details-item--wrong': !item.result.isCorrect }"
        >
          <div class="pt__details-num">第 {{ item.index }} 题 {{ item.result.isCorrect ? '✅' : '❌' }}</div>
          <div class="pt__details-stem">{{ item.exercise ? stripHtml(item.exercise.stem) : '' }}</div>
          <div class="pt__details-answers">
            <div class="pt__details-cell">
              <span class="pt__details-label">你的答案</span>
              <span class="pt__details-value" :class="item.result.isCorrect ? 'pt__details-value--correct' : 'pt__details-value--wrong'">
                {{ item.result.userAnswer || '（未作答）' }}
              </span>
            </div>
            <div class="pt__details-cell">
              <span class="pt__details-label">正确答案</span>
              <span class="pt__details-value pt__details-value--correct">{{ item.exercise?.answer }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="bestScore !== null" class="pt__best">
        最佳成绩：<b>{{ bestScore }}%</b>
      </div>

      <div class="pt__result-actions">
        <button class="pt__btn pt__btn--ghost" @click="retake">🔄 再次挑战</button>
        <button class="pt__btn pt__btn--primary" @click="continueLearning">继续学习 →</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.pt {
  max-width: 700px;
  margin: 0 auto;
  padding: var(--space-4);
  color: var(--text-primary);
}

.pt__back {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  cursor: pointer;
  display: block;
  margin-bottom: var(--space-4);
}
.pt__back:hover { color: var(--color-primary); }

.pt__card {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-8) var(--space-6);
  box-shadow: var(--shadow-md);
}

/* 说明阶段 */
.pt__intro { text-align: center; }
.pt__badge {
  display: inline-block;
  padding: var(--space-1) var(--space-4);
  background: rgba(16, 185, 129, 0.12);
  color: var(--color-success);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 500;
  margin-bottom: var(--space-4);
}
.pt__title {
  font-size: var(--text-3xl);
  margin: 0 0 var(--space-3);
  color: var(--text-primary);
}
.pt__desc {
  color: var(--text-secondary);
  font-size: var(--text-base);
  margin: 0 auto var(--space-6);
  max-width: 480px;
  line-height: 1.6;
}

.pt__info {
  list-style: none;
  padding: var(--space-4);
  margin: 0 auto var(--space-6);
  background: var(--bg-hover);
  border-radius: var(--radius-lg);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-2);
  max-width: 520px;
}
.pt__info li {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
.pt__info-icon { font-size: 20px; }
.pt__info b { color: var(--text-primary); font-weight: 600; }

.pt__best {
  margin: 0 auto var(--space-6);
  padding: var(--space-3) var(--space-4);
  background: rgba(99, 102, 241, 0.08);
  color: var(--color-primary);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  max-width: fit-content;
}

.pt__start-btn {
  padding: var(--space-4) var(--space-12);
  background: var(--color-success);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--text-lg);
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
  transition: all 0.15s;
}
.pt__start-btn:hover {
  background: #059669;
  transform: translateY(-1px);
}

/* 测验阶段 */
.pt__quiz-title {
  text-align: center;
  font-size: var(--text-xl);
  margin: 0 0 var(--space-6);
  color: var(--text-primary);
}

/* 结果阶段 */
.pt__result-head {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--bg-hover);
  margin-bottom: var(--space-6);
}
.pt__score {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  font-weight: 700;
  flex-shrink: 0;
}
.pt__score span { font-size: var(--text-lg); margin-left: 2px; }
.pt__score--full { color: var(--color-success); background: rgba(16, 185, 129, 0.12); }
.pt__score--partial { color: var(--color-warning); background: rgba(245, 158, 11, 0.15); }
.pt__score--none { color: var(--color-error); background: rgba(239, 68, 68, 0.12); }

.pt__score-title {
  font-size: var(--text-xl);
  font-weight: 600;
  margin-bottom: var(--space-1);
}
.pt__score-sub { color: var(--text-secondary); font-size: var(--text-sm); }

.pt__mastery {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-5);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-6);
  background: rgba(99, 102, 241, 0.06);
  border-left: 4px solid var(--color-primary);
}
.pt__mastery--success { background: rgba(16, 185, 129, 0.08); border-left-color: var(--color-success); }
.pt__mastery--warning { background: rgba(245, 158, 11, 0.1); border-left-color: var(--color-warning); }
.pt__mastery--error { background: rgba(239, 68, 68, 0.08); border-left-color: var(--color-error); }

.pt__mastery-icon { font-size: 32px; line-height: 1; }
.pt__mastery-title { font-size: var(--text-lg); font-weight: 600; margin-bottom: var(--space-1); }
.pt__mastery-desc { color: var(--text-secondary); font-size: var(--text-sm); line-height: 1.6; }

.pt__details { margin-bottom: var(--space-6); }
.pt__details-title {
  font-size: var(--text-base);
  font-weight: 600;
  margin-bottom: var(--space-3);
}
.pt__details-item {
  background: var(--bg-hover);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-3);
  border-left: 3px solid transparent;
}
.pt__details-item--correct { border-left-color: var(--color-success); }
.pt__details-item--wrong { border-left-color: var(--color-error); }
.pt__details-num {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin-bottom: var(--space-2);
}
.pt__details-stem {
  font-size: var(--text-base);
  color: var(--text-primary);
  line-height: 1.5;
  margin-bottom: var(--space-3);
}
.pt__details-answers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}
.pt__details-cell {
  background: var(--bg-card);
  padding: var(--space-3);
  border-radius: var(--radius-lg);
}
.pt__details-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-bottom: var(--space-1);
}
.pt__details-value { font-weight: 600; font-size: var(--text-base); }
.pt__details-value--correct { color: var(--color-success); }
.pt__details-value--wrong { color: var(--color-error); }

.pt__result-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  flex-wrap: wrap;
}
.pt__btn {
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-full);
  font-size: var(--text-base);
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
}
.pt__btn--primary {
  background: var(--color-primary);
  color: var(--text-inverse);
}
.pt__btn--primary:hover { background: var(--color-primary-dark); }
.pt__btn--ghost {
  background: var(--bg-hover);
  color: var(--text-primary);
}
.pt__btn--ghost:hover { background: var(--border-color, #e2e8f0); }

@media (max-width: 640px) {
  .pt__card { padding: var(--space-6) var(--space-4); }
  .pt__info { grid-template-columns: 1fr; }
  .pt__info li { flex-direction: row; justify-content: center; }
  .pt__result-head { flex-direction: column; text-align: center; }
  .pt__details-answers { grid-template-columns: 1fr; }
}
</style>
