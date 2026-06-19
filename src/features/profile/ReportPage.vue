<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()

interface WeeklyData {
  studyDays: number
  questions: number
  accuracy: number
  duration: number
  modules: { name: string; mastery: number }[]
  topTopics: { name: string; mastery: number }[]
}

const STORAGE_KEY = 'study_report_data'

const defaultThisWeek: WeeklyData = {
  studyDays: 5, questions: 68, accuracy: 82, duration: 315,
  modules: [
    { name: '计算', mastery: 90 }, { name: '应用题', mastery: 72 },
    { name: '几何', mastery: 65 }, { name: '数论', mastery: 58 }, { name: '计数', mastery: 80 }
  ],
  topTopics: [
    { name: '四则运算', mastery: 95 }, { name: '鸡兔同笼', mastery: 88 },
    { name: '排列组合', mastery: 85 }, { name: '面积计算', mastery: 82 },
    { name: '整除特征', mastery: 78 }
  ]
}

const defaultLastWeek: WeeklyData = {
  studyDays: 4, questions: 52, accuracy: 76, duration: 260,
  modules: [
    { name: '计算', mastery: 85 }, { name: '应用题', mastery: 68 },
    { name: '几何', mastery: 60 }, { name: '数论', mastery: 55 }, { name: '计数', mastery: 75 }
  ],
  topTopics: [
    { name: '四则运算', mastery: 90 }, { name: '鸡兔同笼', mastery: 82 },
    { name: '排列组合', mastery: 78 }, { name: '面积计算', mastery: 75 },
    { name: '整除特征', mastery: 70 }
  ]
}

const thisWeek = ref<WeeklyData>(defaultThisWeek)
const lastWeek = ref<WeeklyData>(defaultLastWeek)

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.thisWeek) thisWeek.value = parsed.thisWeek
      if (parsed.lastWeek) lastWeek.value = parsed.lastWeek
    }
  } catch { /* ignore */ }
})

function diff(cur: number, prev: number): { value: number; up: boolean } {
  const d = cur - prev
  return { value: Math.abs(d), up: d >= 0 }
}

const changes = computed(() => ({
  studyDays: diff(thisWeek.value.studyDays, lastWeek.value.studyDays),
  questions: diff(thisWeek.value.questions, lastWeek.value.questions),
  accuracy: diff(thisWeek.value.accuracy, lastWeek.value.accuracy),
  duration: diff(thisWeek.value.duration, lastWeek.value.duration)
}))

const weakModules = computed(() =>
  [...thisWeek.value.modules].sort((a, b) => a.mastery - b.mastery).slice(0, 2)
)

const suggestions = computed(() =>
  weakModules.value.map(m => `${m.name}模块掌握度仅${m.mastery}%，建议每天额外练习10道${m.name}题目，重点复习错题本中的相关知识点。`)
)

function fmtDuration(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h${m}m` : `${m}min`
}

function barColor(mastery: number) {
  if (mastery >= 80) return 'var(--color-success)'
  if (mastery >= 60) return 'var(--color-warning)'
  return 'var(--color-error)'
}

function goBack() { router.back() }
</script>

<template>
  <AppLayout>
    <div class="report-page">
      <div class="page-header">
        <button class="back-btn" @click="goBack">&larr; 返回</button>
        <h1 class="page-title">学习报告</h1>
        <p class="page-subtitle">每周学习进度与掌握趋势</p>
      </div>

      <!-- 周报概览 -->
      <section class="card overview-grid">
        <div class="ov-item" v-for="(label, key) in { studyDays: '学习天数', questions: '完成题目', accuracy: '正确率', duration: '学习时长' }" :key="key">
          <span class="ov-value">
            {{ key === 'accuracy' ? thisWeek[key as keyof WeeklyData] + '%' : key === 'duration' ? fmtDuration(thisWeek[key as keyof WeeklyData] as number) : thisWeek[key as keyof WeeklyData] }}
            <span class="ov-change" :class="{ up: changes[key as keyof typeof changes].up, down: !changes[key as keyof typeof changes].up }">
              {{ changes[key as keyof typeof changes].up ? '↑' : '↓' }}{{ changes[key as keyof typeof changes].value }}
            </span>
          </span>
          <span class="ov-label">{{ label }}</span>
        </div>
      </section>

      <!-- 模块掌握度 -->
      <section class="card">
        <h2 class="section-title">模块掌握度</h2>
        <div class="module-list">
          <div class="module-row" v-for="mod in thisWeek.modules" :key="mod.name">
            <span class="mod-name">{{ mod.name }}</span>
            <div class="mod-bar-bg">
              <div class="mod-bar-fill" :style="{ width: mod.mastery + '%', background: barColor(mod.mastery) }"></div>
            </div>
            <span class="mod-pct">{{ mod.mastery }}%</span>
          </div>
        </div>
      </section>

      <!-- 本周进步 -->
      <section class="card">
        <h2 class="section-title">本周进步</h2>
        <div class="progress-list">
          <div class="prog-item" v-for="mod in thisWeek.modules" :key="mod.name">
            <span class="prog-name">{{ mod.name }}</span>
            <span class="prog-val" :class="{ up: true }">
              {{ (() => { const d = mod.mastery - (lastWeek.modules.find(m => m.name === mod.name)?.mastery ?? 0); return d >= 0 ? `↑${d}%` : `↓${Math.abs(d)}%` })() }}
            </span>
          </div>
        </div>
      </section>

      <!-- 学习建议 -->
      <section class="card">
        <h2 class="section-title">学习建议</h2>
        <ul class="suggest-list">
          <li class="suggest-item" v-for="(s, i) in suggestions" :key="i">
            <span class="suggest-icon">💡</span>
            <span class="suggest-text">{{ s }}</span>
          </li>
        </ul>
      </section>

      <!-- 知识点排行 -->
      <section class="card">
        <h2 class="section-title">知识点掌握排行</h2>
        <ol class="rank-list">
          <li class="rank-item" v-for="(t, i) in thisWeek.topTopics" :key="t.name">
            <span class="rank-num" :class="'rank-' + (i + 1)">{{ i + 1 }}</span>
            <span class="rank-name">{{ t.name }}</span>
            <span class="rank-bar-bg">
              <span class="rank-bar-fill" :style="{ width: t.mastery + '%', background: barColor(t.mastery) }"></span>
            </span>
            <span class="rank-pct">{{ t.mastery }}%</span>
          </li>
        </ol>
      </section>
    </div>
  </AppLayout>
</template>

<style scoped>
.report-page {
  max-width: 700px;
  margin: 0 auto;
  padding: var(--space-4);
}
.page-header { margin-bottom: var(--space-6); }
.back-btn {
  background: none; border: none; color: var(--text-secondary);
  font-size: var(--text-sm); cursor: pointer; margin-bottom: var(--space-2);
}
.page-title {
  font-size: var(--text-3xl); color: var(--text-primary); margin-bottom: var(--space-1);
}
.page-subtitle { color: var(--text-secondary); font-size: var(--text-sm); }
.card {
  background: var(--bg-card); border-radius: var(--radius-xl);
  padding: var(--space-6); margin-bottom: var(--space-4);
  box-shadow: var(--shadow-sm);
}
.section-title {
  font-size: var(--text-lg); color: var(--text-primary); margin-bottom: var(--space-4);
}
/* 概览 */
.overview-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-4); }
.ov-item { text-align: center; padding: var(--space-3); background: var(--bg-hover); border-radius: var(--radius-lg); }
.ov-value { display: block; font-size: var(--text-2xl); font-weight: 700; color: var(--color-primary); }
.ov-change { font-size: var(--text-xs); font-weight: 600; margin-left: 4px; }
.ov-change.up { color: var(--color-success); }
.ov-change.down { color: var(--color-error); }
.ov-label { font-size: var(--text-xs); color: var(--text-secondary); margin-top: var(--space-1); display: block; }
/* 模块 */
.module-list { display: flex; flex-direction: column; gap: var(--space-3); }
.module-row { display: flex; align-items: center; gap: var(--space-3); }
.mod-name { width: 48px; font-size: var(--text-sm); color: var(--text-secondary); flex-shrink: 0; }
.mod-bar-bg { flex: 1; height: 10px; background: var(--bg-hover); border-radius: var(--radius-full); overflow: hidden; }
.mod-bar-fill { height: 100%; border-radius: var(--radius-full); transition: width 0.6s ease; }
.mod-pct { width: 36px; text-align: right; font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); }
/* 进步 */
.progress-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-3); }
.prog-item { display: flex; justify-content: space-between; padding: var(--space-2) var(--space-3); background: var(--bg-hover); border-radius: var(--radius-md); }
.prog-name { font-size: var(--text-sm); color: var(--text-secondary); }
.prog-val { font-size: var(--text-sm); font-weight: 600; }
.prog-val.up { color: var(--color-success); }
.prog-val.down { color: var(--color-error); }
/* 建议 */
.suggest-list { display: flex; flex-direction: column; gap: var(--space-3); }
.suggest-item { display: flex; gap: var(--space-2); align-items: flex-start; font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); }
.suggest-icon { flex-shrink: 0; }
/* 排行 */
.rank-list { display: flex; flex-direction: column; gap: var(--space-3); }
.rank-item { display: flex; align-items: center; gap: var(--space-2); }
.rank-num {
  width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: var(--text-xs); font-weight: 700; color: var(--text-inverse); flex-shrink: 0;
}
.rank-1 { background: linear-gradient(135deg, #f59e0b, #fbbf24); }
.rank-2 { background: linear-gradient(135deg, #94a3b8, #cbd5e1); }
.rank-3 { background: linear-gradient(135deg, #cd7f32, #daa520); }
.rank-4, .rank-5 { background: var(--bg-active); color: var(--text-secondary); }
.rank-name { width: 64px; font-size: var(--text-sm); color: var(--text-primary); flex-shrink: 0; }
.rank-bar-bg { flex: 1; height: 8px; background: var(--bg-hover); border-radius: var(--radius-full); overflow: hidden; }
.rank-bar-fill { height: 100%; border-radius: var(--radius-full); transition: width 0.6s ease; }
.rank-pct { width: 36px; text-align: right; font-size: var(--text-xs); font-weight: 600; color: var(--text-secondary); }
</style>
