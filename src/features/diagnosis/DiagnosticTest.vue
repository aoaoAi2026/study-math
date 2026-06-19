<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

type Phase = 'welcome' | 'testing' | 'result'
interface Question {
  id: number; module: string; text: string; options: string[]; answer: number
}

const questions: Question[] = [
  { id: 1, module: '计算', text: '125 × 8 = ?', options: ['900', '1000', '1100', '800'], answer: 1 },
  { id: 2, module: '计算', text: '3.6 + 2.45 = ?', options: ['5.05', '6.01', '5.15', '6.05'], answer: 0 },
  { id: 3, module: '应用题', text: '小明有 36 颗糖，分给 4 个朋友，每人几颗？', options: ['8', '9', '10', '7'], answer: 1 },
  { id: 4, module: '应用题', text: '一列火车 3 小时行驶 270 千米，时速是多少？', options: ['80', '85', '90', '95'], answer: 2 },
  { id: 5, module: '几何', text: '长 8cm、宽 5cm 的长方形面积是多少？', options: ['30cm²', '40cm²', '26cm²', '35cm²'], answer: 1 },
  { id: 6, module: '几何', text: '三角形三个内角之和是多少度？', options: ['90°', '180°', '270°', '360°'], answer: 1 },
  { id: 7, module: '数论', text: '下列哪个数是质数？', options: ['15', '21', '29', '33'], answer: 2 },
  { id: 8, module: '数论', text: '12 和 18 的最大公因数是多少？', options: ['3', '6', '9', '12'], answer: 1 },
  { id: 9, module: '计数', text: '从 1 到 20 有多少个偶数？', options: ['8', '9', '10', '11'], answer: 2 },
  { id: 10, module: '计数', text: '3 个人互相握手，一共握几次？', options: ['3', '4', '6', '9'], answer: 0 },
]

const phase = ref<Phase>('welcome')
const currentIdx = ref(0)
const answers = ref<Record<number, number>>({})
const elapsed = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const currentQ = computed(() => questions[currentIdx.value])
const progress = computed(() => ((currentIdx.value) / questions.length) * 100)
const totalCorrect = computed(() => questions.filter(q => answers.value[q.id] === q.answer).length)

const moduleScores = computed(() => {
  const modules = ['计算', '应用题', '几何', '数论', '计数'] as const
  return modules.map(m => {
    const qs = questions.filter(q => q.module === m)
    const correct = qs.filter(q => answers.value[q.id] === q.answer).length
    return { module: m, score: Math.round((correct / qs.length) * 100) }
  })
})

const recommendedPath = computed(() => {
  const avg = totalCorrect.value / questions.length
  if (avg >= 0.8) return { label: '竞赛提升', desc: '基础扎实，建议挑战更高难度的竞赛题型', color: 'var(--color-success)' }
  if (avg >= 0.5) return { label: '巩固提高', desc: '部分知识点薄弱，建议针对性强化训练', color: 'var(--color-warning)' }
  return { label: '基础夯实', desc: '建议从基础知识开始，逐步建立数学思维', color: 'var(--color-error)' }
})

function startTest() {
  phase.value = 'testing'
  elapsed.value = 0
  answers.value = {}
  currentIdx.value = 0
  timer = setInterval(() => elapsed.value++, 1000)
}

function selectOption(optIdx: number) {
  answers.value[currentQ.value.id] = optIdx
  if (currentIdx.value < questions.length - 1) {
    currentIdx.value++
  } else {
    finishTest()
  }
}

function finishTest() {
  if (timer) { clearInterval(timer); timer = null }
  phase.value = 'result'
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m}分${sec}秒` : `${sec}秒`
}

function restart() {
  phase.value = 'welcome'
  currentIdx.value = 0
  answers.value = {}
  elapsed.value = 0
}

onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <AppLayout>
    <div class="diag">
      <!-- 欢迎页 -->
      <div v-if="phase === 'welcome'" class="diag__welcome">
        <div class="diag__icon">🔬</div>
        <h1 class="diag__title">智能诊断</h1>
        <p class="diag__desc">通过 10 道精选题目，快速评估你在计算、应用题、几何、数论、计数五大模块的能力水平</p>
        <ul class="diag__features">
          <li>涵盖 5 大数学模块</li>
          <li>约 5 分钟完成</li>
          <li>即时生成能力报告</li>
        </ul>
        <button class="diag__btn diag__btn--primary" @click="startTest">开始诊断</button>
      </div>

      <!-- 答题页 -->
      <div v-if="phase === 'testing'" class="diag__test">
        <div class="diag__header">
          <div class="diag__progress-wrap">
            <div class="diag__progress" :style="{ width: progress + '%' }"></div>
          </div>
          <div class="diag__meta">
            <span>第 {{ currentIdx + 1 }} / {{ questions.length }} 题</span>
            <span class="diag__timer">{{ formatTime(elapsed) }}</span>
          </div>
        </div>
        <div class="diag__card">
          <span class="diag__tag">{{ currentQ.module }}</span>
          <h2 class="diag__question">{{ currentQ.text }}</h2>
          <div class="diag__options">
            <button
              v-for="(opt, i) in currentQ.options" :key="i"
              class="diag__option"
              :class="{ 'diag__option--selected': answers[currentQ.id] === i }"
              @click="selectOption(i)"
            >
              <span class="diag__option-label">{{ String.fromCharCode(65 + i) }}</span>
              <span>{{ opt }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 结果页 -->
      <div v-if="phase === 'result'" class="diag__result">
        <h1 class="diag__title">诊断报告</h1>
        <div class="diag__score-card">
          <div class="diag__score-num">{{ totalCorrect }}<small>/{{ questions.length }}</small></div>
          <div class="diag__score-label">正确题数 · 用时 {{ formatTime(elapsed) }}</div>
        </div>

        <div class="diag__radar">
          <h3>各模块得分</h3>
          <div class="diag__bars">
            <div v-for="m in moduleScores" :key="m.module" class="diag__bar-row">
              <span class="diag__bar-label">{{ m.module }}</span>
              <div class="diag__bar-track">
                <div class="diag__bar-fill" :style="{ width: m.score + '%' }"></div>
              </div>
              <span class="diag__bar-val">{{ m.score }}%</span>
            </div>
          </div>
        </div>

        <div class="diag__path" :style="{ borderColor: recommendedPath.color }">
          <h3>推荐学习路径：<span :style="{ color: recommendedPath.color }">{{ recommendedPath.label }}</span></h3>
          <p>{{ recommendedPath.desc }}</p>
        </div>

        <button class="diag__btn diag__btn--primary" @click="restart">重新诊断</button>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.diag { max-width: 640px; margin: 0 auto; }

/* 欢迎页 */
.diag__welcome { text-align: center; padding: var(--space-12) var(--space-4); }
.diag__icon { font-size: 3rem; margin-bottom: var(--space-4); }
.diag__title { font-size: var(--text-3xl); color: var(--text-primary); margin-bottom: var(--space-3); }
.diag__desc { color: var(--text-secondary); line-height: var(--leading-relaxed); margin-bottom: var(--space-6); }
.diag__features { list-style: none; padding: 0; margin-bottom: var(--space-8); color: var(--text-secondary); }
.diag__features li { padding: var(--space-2) 0; }
.diag__features li::before { content: '✓ '; color: var(--color-success); font-weight: 700; }

/* 按钮 */
.diag__btn {
  padding: var(--space-3) var(--space-8); border-radius: var(--radius-full);
  font-size: var(--text-lg); font-weight: 600; cursor: pointer; border: none; transition: var(--transition-fast);
}
.diag__btn--primary { background: var(--color-primary); color: var(--text-inverse); }
.diag__btn--primary:hover { background: var(--color-primary-dark); }

/* 答题页 */
.diag__test { padding: var(--space-4) 0; }
.diag__header { margin-bottom: var(--space-6); }
.diag__progress-wrap {
  height: 6px; background: var(--bg-active); border-radius: var(--radius-full); overflow: hidden; margin-bottom: var(--space-2);
}
.diag__progress { height: 100%; background: var(--color-primary); border-radius: var(--radius-full); transition: width var(--transition-normal); }
.diag__meta { display: flex; justify-content: space-between; font-size: var(--text-sm); color: var(--text-secondary); }
.diag__timer { font-family: var(--font-mono); }

.diag__card {
  background: var(--bg-card); border-radius: var(--radius-xl); padding: var(--space-6);
  box-shadow: var(--shadow-md); border: 1px solid var(--border-color);
}
.diag__tag {
  display: inline-block; padding: var(--space-1) var(--space-3); border-radius: var(--radius-full);
  background: var(--color-primary); color: var(--text-inverse); font-size: var(--text-xs); font-weight: 600; margin-bottom: var(--space-4);
}
.diag__question { font-size: var(--text-xl); color: var(--text-primary); margin-bottom: var(--space-6); line-height: var(--leading-relaxed); }

.diag__options { display: flex; flex-direction: column; gap: var(--space-3); }
.diag__option {
  display: flex; align-items: center; gap: var(--space-3); padding: var(--space-4);
  border: 2px solid var(--border-color); border-radius: var(--radius-lg); background: var(--bg-card);
  cursor: pointer; font-size: var(--text-base); color: var(--text-primary); transition: var(--transition-fast); text-align: left;
}
.diag__option:hover { border-color: var(--color-primary-light); background: var(--bg-hover); }
.diag__option--selected { border-color: var(--color-primary); background: var(--color-primary); color: var(--text-inverse); }
.diag__option-label {
  width: 28px; height: 28px; border-radius: var(--radius-full); background: var(--bg-active);
  display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: var(--text-sm); flex-shrink: 0;
}
.diag__option--selected .diag__option-label { background: rgba(255,255,255,0.25); }

/* 结果页 */
.diag__result { padding: var(--space-4) 0; }
.diag__score-card {
  text-align: center; background: var(--bg-card); border-radius: var(--radius-xl);
  padding: var(--space-8); box-shadow: var(--shadow-md); border: 1px solid var(--border-color); margin-bottom: var(--space-6);
}
.diag__score-num { font-size: var(--text-4xl); font-weight: 800; color: var(--color-primary); }
.diag__score-num small { font-size: var(--text-xl); color: var(--text-secondary); font-weight: 400; }
.diag__score-label { color: var(--text-secondary); margin-top: var(--space-2); font-size: var(--text-sm); }

.diag__radar {
  background: var(--bg-card); border-radius: var(--radius-xl); padding: var(--space-6);
  box-shadow: var(--shadow-md); border: 1px solid var(--border-color); margin-bottom: var(--space-6);
}
.diag__radar h3 { font-size: var(--text-lg); color: var(--text-primary); margin-bottom: var(--space-4); }
.diag__bars { display: flex; flex-direction: column; gap: var(--space-3); }
.diag__bar-row { display: flex; align-items: center; gap: var(--space-3); }
.diag__bar-label { width: 48px; font-size: var(--text-sm); color: var(--text-secondary); flex-shrink: 0; }
.diag__bar-track { flex: 1; height: 10px; background: var(--bg-active); border-radius: var(--radius-full); overflow: hidden; }
.diag__bar-fill { height: 100%; background: var(--color-primary); border-radius: var(--radius-full); transition: width 0.6s ease; }
.diag__bar-val { width: 36px; font-size: var(--text-sm); color: var(--text-primary); font-weight: 600; text-align: right; }

.diag__path {
  background: var(--bg-card); border-radius: var(--radius-xl); padding: var(--space-6);
  box-shadow: var(--shadow-md); border-left: 4px solid; margin-bottom: var(--space-6);
}
.diag__path h3 { font-size: var(--text-lg); color: var(--text-primary); margin-bottom: var(--space-2); }
.diag__path p { color: var(--text-secondary); font-size: var(--text-sm); line-height: var(--leading-relaxed); }

.diag__result .diag__btn { width: 100%; }
</style>
