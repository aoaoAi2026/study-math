<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

type SupportMode = 'fool' | 'understand' | 'extend'

interface ModuleScore { name: string; pct: number }
interface WeakPoint { topic: string; wrongCount: number; accuracy: number }

const supportMode = ref<SupportMode>('fool')
const todayMinutes = ref(0)
const weekQuestions = ref(0)
const streakDays = ref(0)
const modules = ref<ModuleScore[]>([])
const weakPoints = ref<WeakPoint[]>([])

const defaultData = {
  todayMinutes: 45, weekQuestions: 128, streakDays: 7,
  modules: [
    { name: '计算', pct: 85 }, { name: '应用题', pct: 62 },
    { name: '几何', pct: 70 }, { name: '数论', pct: 48 }, { name: '计数', pct: 55 }
  ],
  weakPoints: [
    { topic: '和倍问题', wrongCount: 8, accuracy: 40 },
    { topic: '鸡兔同笼', wrongCount: 6, accuracy: 45 },
    { topic: '质数判断', wrongCount: 5, accuracy: 50 }
  ]
}

function loadData() {
  const raw = localStorage.getItem('parent_coaching_data')
  const d = raw ? JSON.parse(raw) : defaultData
  todayMinutes.value = d.todayMinutes
  weekQuestions.value = d.weekQuestions
  streakDays.value = d.streakDays
  modules.value = d.modules
  weakPoints.value = d.weakPoints
}

const advice = computed(() =>
  weakPoints.value.map(w =>
    `建议复习${w.topic}，最近正确率仅${w.accuracy}%，错误${w.wrongCount}次`
  )
)

const modeConfig: Record<SupportMode, { label: string; desc: string }> = {
  fool:      { label: '傻瓜模式', desc: '提供详细辅导脚本，手把手教您如何讲解每道题' },
  understand:{ label: '理解模式', desc: '给出关键提示和思路引导，让孩子自主思考' },
  extend:     { label: '拓展模式', desc: '推荐挑战题和变式训练，突破思维天花板' }
}

function barColor(pct: number) {
  if (pct >= 75) return 'var(--color-success, #22c55e)'
  if (pct >= 50) return 'var(--color-warning, #f59e0b)'
  return 'var(--color-danger, #ef4444)'
}

onMounted(loadData)
</script>

<template>
  <div class="dashboard">
    <button class="dashboard__back" onclick="history.back()">← 返回</button>
    <h1 class="dashboard__title">家长辅导仪表盘</h1>

    <!-- 学习概览 -->
    <section class="dashboard__card">
      <h2>孩子学习概览</h2>
      <div class="dashboard__stats">
        <div class="dashboard__stat">
          <span class="dashboard__stat-value">{{ todayMinutes }}<small>min</small></span>
          <span class="dashboard__stat-label">今日学习时长</span>
        </div>
        <div class="dashboard__stat">
          <span class="dashboard__stat-value">{{ weekQuestions }}</span>
          <span class="dashboard__stat-label">本周完成题目</span>
        </div>
        <div class="dashboard__stat">
          <span class="dashboard__stat-value">{{ streakDays }}<small>天</small></span>
          <span class="dashboard__stat-label">连续学习</span>
        </div>
      </div>
    </section>

    <!-- 知识掌握度 -->
    <section class="dashboard__card">
      <h2>知识掌握度</h2>
      <div class="dashboard__module" v-for="m in modules" :key="m.name">
        <span class="dashboard__module-name">{{ m.name }}</span>
        <div class="dashboard__bar">
          <div class="dashboard__bar-fill" :style="{ width: m.pct + '%', background: barColor(m.pct) }"></div>
        </div>
        <span class="dashboard__module-pct">{{ m.pct }}%</span>
      </div>
    </section>

    <!-- 薄弱环节 -->
    <section class="dashboard__card">
      <h2>薄弱环节 TOP3</h2>
      <div class="dashboard__weak" v-for="(w, i) in weakPoints" :key="w.topic">
        <span class="dashboard__weak-rank">{{ i + 1 }}</span>
        <div class="dashboard__weak-info">
          <strong>{{ w.topic }}</strong>
          <span>错 {{ w.wrongCount }} 次 · 正确率 {{ w.accuracy }}%</span>
        </div>
      </div>
    </section>

    <!-- 辅导建议 -->
    <section class="dashboard__card">
      <h2>辅导建议</h2>
      <p class="dashboard__advice" v-for="a in advice" :key="a">{{ a }}</p>
    </section>

    <!-- 支持模式切换 -->
    <section class="dashboard__card">
      <h2>辅导模式</h2>
      <div class="dashboard__modes">
        <button
          v-for="(cfg, key) in modeConfig" :key="key"
          class="dashboard__mode-btn"
          :class="{ 'dashboard__mode-btn--active': supportMode === key }"
          @click="supportMode = key as SupportMode"
        >{{ cfg.label }}</button>
      </div>
      <p class="dashboard__mode-desc">{{ modeConfig[supportMode].desc }}</p>
      <div class="dashboard__mode-content">
        <template v-if="supportMode === 'fool'">
          <p v-for="w in weakPoints" :key="'f'+w.topic">
            <strong>{{ w.topic }}</strong>：先画线段图帮孩子理解题意，再分步引导列式。例如："小明有5个苹果，小红比小明多3个，小红有几个？" → 画两条线段，让孩子指出"多3个"在哪里。
          </p>
        </template>
        <template v-else-if="supportMode === 'understand'">
          <p v-for="w in weakPoints" :key="'u'+w.topic">
            <strong>{{ w.topic }}</strong>：提示孩子思考"已知什么、求什么、用什么方法"，鼓励用自己的话复述解题思路。
          </p>
        </template>
        <template v-else>
          <p v-for="w in weakPoints" :key="'e'+w.topic">
            <strong>{{ w.topic }}</strong>：尝试变式训练——改变数字、交换已知与未知条件，或引入多步复合问题，锻炼举一反三能力。
          </p>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-4);
}
.dashboard__back {
  background: none;
  border: none;
  color: var(--text-tertiary, #6B7785);
  font-size: var(--text-sm, 14px);
  cursor: pointer;
  margin-bottom: var(--space-2);
}
.dashboard__title {
  font-size: var(--text-2xl, 24px);
  color: var(--text-primary, #2C3E50);
  margin-bottom: var(--space-6);
}
.dashboard__card {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-xl, 18px);
  padding: var(--space-5, 20px);
  margin-bottom: var(--space-5, 20px);
  box-shadow: var(--shadow-sm, 0 2px 10px rgba(0,0,0,.05));
}
.dashboard__card h2 {
  font-size: var(--text-lg, 18px);
  color: var(--text-primary, #2C3E50);
  margin: 0 0 var(--space-4, 16px);
}
.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4, 16px);
}
.dashboard__stat {
  text-align: center;
  padding: var(--space-3, 12px);
  background: var(--bg-hover, #f7f8fa);
  border-radius: var(--radius-lg, 12px);
}
.dashboard__stat-value {
  display: block;
  font-size: var(--text-2xl, 24px);
  font-weight: 700;
  color: var(--color-primary, #6366f1);
}
.dashboard__stat-value small {
  font-size: var(--text-xs, 12px);
  font-weight: 400;
  margin-left: 2px;
}
.dashboard__stat-label {
  font-size: var(--text-xs, 12px);
  color: var(--text-tertiary, #6B7785);
}
.dashboard__module {
  display: flex;
  align-items: center;
  gap: var(--space-3, 12px);
  margin-bottom: var(--space-3, 12px);
}
.dashboard__module:last-child { margin-bottom: 0; }
.dashboard__module-name {
  width: 60px;
  font-size: var(--text-sm, 14px);
  font-weight: 500;
  color: var(--text-primary, #2C3E50);
}
.dashboard__bar {
  flex: 1;
  height: 10px;
  background: var(--bg-hover, #f7f8fa);
  border-radius: var(--radius-full, 999px);
  overflow: hidden;
}
.dashboard__bar-fill {
  height: 100%;
  border-radius: var(--radius-full, 999px);
  transition: width var(--transition-normal, .3s);
}
.dashboard__module-pct {
  width: 40px;
  text-align: right;
  font-size: var(--text-sm, 14px);
  font-weight: 600;
  color: var(--text-secondary, #555);
}
.dashboard__weak {
  display: flex;
  align-items: center;
  gap: var(--space-3, 12px);
  padding: var(--space-3, 12px);
  background: var(--bg-hover, #f7f8fa);
  border-radius: var(--radius-lg, 12px);
  margin-bottom: var(--space-2, 8px);
}
.dashboard__weak:last-child { margin-bottom: 0; }
.dashboard__weak-rank {
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 50%;
  background: var(--color-primary, #6366f1);
  color: #fff;
  font-size: var(--text-sm, 14px);
  font-weight: 700;
  flex-shrink: 0;
}
.dashboard__weak-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: var(--text-sm, 14px);
  color: var(--text-secondary, #555);
}
.dashboard__weak-info strong { color: var(--text-primary, #2C3E50); }
.dashboard__advice {
  font-size: var(--text-sm, 14px);
  color: var(--text-secondary, #555);
  padding: var(--space-2, 8px) 0;
  border-bottom: 1px dashed var(--bg-hover, #f7f8fa);
  margin: 0;
}
.dashboard__advice:last-child { border-bottom: none; }
.dashboard__modes {
  display: flex;
  gap: var(--space-2, 8px);
  margin-bottom: var(--space-3, 12px);
}
.dashboard__mode-btn {
  flex: 1;
  padding: var(--space-2, 8px) var(--space-3, 12px);
  border: 2px solid var(--bg-hover, #f7f8fa);
  border-radius: var(--radius-lg, 12px);
  background: var(--bg-card, #fff);
  font-size: var(--text-sm, 14px);
  font-weight: 500;
  color: var(--text-secondary, #555);
  cursor: pointer;
  transition: all var(--transition-fast, .15s);
}
.dashboard__mode-btn--active {
  border-color: var(--color-primary, #6366f1);
  color: var(--color-primary, #6366f1);
  background: rgba(99,102,241,.06);
}
.dashboard__mode-desc {
  font-size: var(--text-xs, 12px);
  color: var(--text-tertiary, #6B7785);
  margin: 0 0 var(--space-3, 12px);
}
.dashboard__mode-content p {
  font-size: var(--text-sm, 14px);
  color: var(--text-secondary, #555);
  line-height: 1.6;
  padding: var(--space-3, 12px);
  background: var(--bg-hover, #f7f8fa);
  border-radius: var(--radius-lg, 12px);
  margin: 0 0 var(--space-2, 8px);
}
.dashboard__mode-content p:last-child { margin-bottom: 0; }
@media (max-width: 640px) {
  .dashboard__stats { grid-template-columns: 1fr; }
}
</style>
