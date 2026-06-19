<script setup lang="ts">
import { ref, computed } from 'vue'

interface ModuleScore { module: string; score: number; correct: number; total: number; weaknesses: string[] }

const MOCK: { totalScore: number; modules: ModuleScore[] } = {
  totalScore: 72,
  modules: [
    { module: '计算', score: 90, correct: 9, total: 10, weaknesses: ['分数乘除法'] },
    { module: '应用题', score: 65, correct: 6, total: 10, weaknesses: ['行程问题', '工程问题'] },
    { module: '几何', score: 80, correct: 8, total: 10, weaknesses: ['圆的面积'] },
    { module: '数论', score: 55, correct: 5, total: 10, weaknesses: ['整除特征', '质因数分解'] },
    { module: '计数', score: 70, correct: 7, total: 10, weaknesses: ['容斥原理'] },
  ],
}

const raw = ref<string | null>(null)
try { raw.value = localStorage.getItem('diagnostic_result') } catch { /* ignore */ }

const data = computed(() => {
  if (raw.value) try { return JSON.parse(raw.value) } catch { /* fall through */ }
  return MOCK
})

const grade = computed(() => {
  const s = data.value.totalScore
  if (s >= 90) return 'A'
  if (s >= 75) return 'B'
  if (s >= 60) return 'C'
  return 'D'
})

const gradeColor = computed(() => {
  const map: Record<string, string> = { A: 'var(--color-success)', B: 'var(--color-primary)', C: 'var(--color-warning)', D: 'var(--color-error)' }
  return map[grade.value] || 'var(--color-primary)'
})

const radarPoints = computed(() => {
  const mods = data.value.modules
  const n = 5
  const cx = 50, cy = 50, r = 38
  return mods.map((m: ModuleScore, i: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    const ratio = m.score / 100
    return `${cx + r * ratio * Math.cos(angle)},${cy + r * ratio * Math.sin(angle)}`
  }).join(' ')
})

const gridLines = computed(() => {
  const levels = [0.25, 0.5, 0.75, 1]
  const n = 5, cx = 50, cy = 50, r = 38
  return levels.map(level => {
    const pts = Array.from({ length: n }, (_, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2
      return `${cx + r * level * Math.cos(angle)},${cy + r * level * Math.sin(angle)}`
    }).join(' ')
    return pts
  })
})

const axisLines = computed(() => {
  const n = 5, cx = 50, cy = 50, r = 38
  return Array.from({ length: n }, (_, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    return `${cx},${cy} ${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
  })
})

const labelPositions = computed(() => {
  const mods = data.value.modules
  const n = 5, cx = 50, cy = 50, r = 50
  return mods.map((m: ModuleScore, i: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    return { label: m.module, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), score: m.score }
  })
})

const suggestions = computed(() =>
  data.value.modules
    .filter((m: ModuleScore) => m.score < 80)
    .sort((a: ModuleScore, b: ModuleScore) => a.score - b.score)
    .map((m: ModuleScore) => ({ module: m.module, tip: m.score < 60 ? `${m.module}基础薄弱，建议从课本基础概念开始复习，配合每日专项练习` : `${m.module}尚可提升，重点攻克${m.weaknesses.join('、')}等薄弱点` }))
)

const sortedModules = computed(() =>
  [...data.value.modules].sort((a, b) => a.score - b.score)
)

const hasData = computed(() => !!raw.value)
</script>

<template>
  <div class="report">
    <button class="report__back" onclick="history.back()">← 返回</button>

    <!-- 无数据占位 -->
    <div v-if="!hasData" class="report__empty">
      <div class="report__empty-icon">📊</div>
      <h2>暂无诊断结果</h2>
      <p>完成诊断测试后即可查看详细报告</p>
      <button class="report__btn report__btn--primary" onclick="location.hash='#/diagnosis'">去做诊断</button>
    </div>

    <!-- 报告内容 -->
    <template v-else>
      <!-- 综合评分 -->
      <div class="report__hero">
        <div class="report__grade" :style="{ background: gradeColor }">{{ grade }}</div>
        <div class="report__hero-info">
          <div class="report__score">{{ data.totalScore }}<small>/100</small></div>
          <div class="report__hero-label">综合评分</div>
        </div>
      </div>

      <!-- 五维雷达图 -->
      <div class="report__card">
        <h3 class="report__card-title">能力五维图</h3>
        <div class="report__radar">
          <svg viewBox="0 0 100 100" class="report__radar-svg">
            <polygon v-for="pts in gridLines" :key="pts" :points="pts" fill="none" stroke="var(--border-color)" stroke-width="0.3" />
            <line v-for="l in axisLines" :key="l" :x1="l.split(' ')[0].split(',')[0]" :y1="l.split(' ')[0].split(',')[1]" :x2="l.split(' ')[1].split(',')[0]" :y2="l.split(' ')[1].split(',')[1]" stroke="var(--border-color)" stroke-width="0.3" />
            <polygon :points="radarPoints" fill="rgba(var(--color-primary-rgb, 59,130,246), 0.2)" stroke="var(--color-primary)" stroke-width="0.8" />
            <circle v-for="p in radarPoints.split(' ')" :key="p" :cx="p.split(',')[0]" :cy="p.split(',')[1]" r="1.2" fill="var(--color-primary)" />
          </svg>
          <div class="report__radar-labels">
            <span v-for="pos in labelPositions" :key="pos.module" class="report__radar-label"
              :style="{ left: pos.x + '%', top: pos.y + '%' }">
              {{ pos.module }} {{ pos.score }}
            </span>
          </div>
        </div>
      </div>

      <!-- 各模块详情 -->
      <div class="report__card">
        <h3 class="report__card-title">模块详情</h3>
        <div class="report__modules">
          <div v-for="m in data.modules" :key="m.module" class="report__mod">
            <div class="report__mod-head">
              <span class="report__mod-name">{{ m.module }}</span>
              <span class="report__mod-score" :style="{ color: m.score >= 80 ? 'var(--color-success)' : m.score >= 60 ? 'var(--color-warning)' : 'var(--color-error)' }">{{ m.score }}%</span>
            </div>
            <div class="report__mod-bar"><div class="report__mod-fill" :style="{ width: m.score + '%' }"></div></div>
            <div class="report__mod-meta">正确 {{ m.correct }}/{{ m.total }} · 薄弱点：{{ m.weaknesses.join('、') || '无' }}</div>
          </div>
        </div>
      </div>

      <!-- 学习建议 -->
      <div class="report__card" v-if="suggestions.length">
        <h3 class="report__card-title">个性化学习建议</h3>
        <ul class="report__suggestions">
          <li v-for="s in suggestions" :key="s.module">
            <strong>{{ s.module }}</strong>：{{ s.tip }}
          </li>
        </ul>
      </div>

      <!-- 推荐学习路径 -->
      <div class="report__card report__card--path">
        <h3 class="report__card-title">推荐学习路径</h3>
        <ol class="report__path-list">
          <li v-for="(m, i) in sortedModules" :key="m.module">
            <span class="report__path-step">{{ i + 1 }}</span>
            <span>{{ m.module }}（{{ m.score }}分）— {{ m.weaknesses.join('、') || '保持优势' }}</span>
          </li>
        </ol>
      </div>

      <button class="report__btn report__btn--primary report__btn--full" onclick="location.hash='#/diagnosis'">重新诊断</button>
    </template>
  </div>
</template>

<style scoped>
.report { max-width: 640px; margin: 0 auto; padding: var(--space-4); }
.report__back { background: none; border: none; color: var(--text-secondary); font-size: var(--text-sm); cursor: pointer; margin-bottom: var(--space-4); }

/* 空状态 */
.report__empty { text-align: center; padding: var(--space-16) var(--space-4); }
.report__empty-icon { font-size: 3rem; margin-bottom: var(--space-4); }
.report__empty h2 { color: var(--text-primary); margin-bottom: var(--space-2); }
.report__empty p { color: var(--text-secondary); margin-bottom: var(--space-6); }

/* 按钮 */
.report__btn { padding: var(--space-3) var(--space-8); border-radius: var(--radius-full); font-size: var(--text-base); font-weight: 600; cursor: pointer; border: none; transition: var(--transition-fast); }
.report__btn--primary { background: var(--color-primary); color: var(--text-inverse); }
.report__btn--primary:hover { background: var(--color-primary-dark); }
.report__btn--full { width: 100%; margin-top: var(--space-4); }

/* 综合评分 */
.report__hero { display: flex; align-items: center; gap: var(--space-5); background: var(--bg-card); border-radius: var(--radius-xl); padding: var(--space-6); box-shadow: var(--shadow-md); border: 1px solid var(--border-color); margin-bottom: var(--space-4); }
.report__grade { width: 56px; height: 56px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; color: #fff; font-size: var(--text-2xl); font-weight: 800; flex-shrink: 0; }
.report__score { font-size: var(--text-3xl); font-weight: 800; color: var(--text-primary); }
.report__score small { font-size: var(--text-base); color: var(--text-secondary); font-weight: 400; }
.report__hero-label { color: var(--text-secondary); font-size: var(--text-sm); }

/* 卡片 */
.report__card { background: var(--bg-card); border-radius: var(--radius-xl); padding: var(--space-5); box-shadow: var(--shadow-md); border: 1px solid var(--border-color); margin-bottom: var(--space-4); }
.report__card-title { font-size: var(--text-lg); color: var(--text-primary); margin-bottom: var(--space-4); }

/* 雷达图 */
.report__radar { position: relative; width: 100%; max-width: 280px; margin: 0 auto; aspect-ratio: 1; }
.report__radar-svg { width: 100%; height: 100%; }
.report__radar-labels { position: absolute; inset: 0; }
.report__radar-label { position: absolute; transform: translate(-50%, -50%); font-size: 11px; color: var(--text-secondary); white-space: nowrap; font-weight: 600; }

/* 模块详情 */
.report__modules { display: flex; flex-direction: column; gap: var(--space-4); }
.report__mod-head { display: flex; justify-content: space-between; margin-bottom: var(--space-1); }
.report__mod-name { font-weight: 600; color: var(--text-primary); font-size: var(--text-sm); }
.report__mod-score { font-weight: 700; font-size: var(--text-sm); }
.report__mod-bar { height: 8px; background: var(--bg-active); border-radius: var(--radius-full); overflow: hidden; margin-bottom: var(--space-1); }
.report__mod-fill { height: 100%; background: var(--color-primary); border-radius: var(--radius-full); transition: width 0.6s ease; }
.report__mod-meta { font-size: var(--text-xs); color: var(--text-tertiary); }

/* 建议 */
.report__suggestions { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--space-3); }
.report__suggestions li { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); padding-left: var(--space-4); border-left: 3px solid var(--color-primary); }
.report__suggestions strong { color: var(--text-primary); }

/* 学习路径 */
.report__path-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--space-3); counter-reset: none; }
.report__path-list li { display: flex; align-items: center; gap: var(--space-3); font-size: var(--text-sm); color: var(--text-secondary); }
.report__path-step { width: 24px; height: 24px; border-radius: var(--radius-full); background: var(--color-primary); color: var(--text-inverse); display: flex; align-items: center; justify-content: center; font-size: var(--text-xs); font-weight: 700; flex-shrink: 0; }
</style>
