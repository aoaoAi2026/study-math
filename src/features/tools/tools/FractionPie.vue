<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

const mode = ref<'single' | 'compare' | 'add'>('single')

interface PieState {
  slices: number
  filled: Set<number>
}

function makePie(initialSlices: number, initialFilled: number) {
  const state = reactive<PieState>({
    slices: initialSlices,
    filled: new Set(Array.from({ length: initialFilled }, (_, i) => i))
  })
  function toggle(i: number) {
    if (state.filled.has(i)) {
      const next = new Set(state.filled)
      next.delete(i)
      state.filled = next
    } else {
      const next = new Set(state.filled)
      next.add(i)
      state.filled = next
    }
  }
  function reset() {
    state.filled = new Set()
  }
  function isFilled(i: number) {
    return state.filled.has(i)
  }
  function filledCount() {
    return state.filled.size
  }
  return { state, toggle, reset, isFilled, filledCount }
}

const pieA = makePie(8, 3)
const pieB = makePie(8, 5)
const pieAddL = makePie(4, 1)
const pieAddR = makePie(4, 1)

function polar(r: number, angle: number, cx = 150, cy = 150): [number, number] {
  const rad = (angle - 90) * Math.PI / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

function slicePath(sliceIdx: number, total: number, r = 130): string {
  if (total <= 1) return ''
  const step = 360 / total
  const a1 = sliceIdx * step
  const a2 = a1 + step
  const [x1, y1] = polar(r, a1)
  const [x2, y2] = polar(r, a2)
  const large = step > 180 ? 1 : 0
  return `M 150 150 L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
}

function fractionRepr(n: number, d: number): string {
  if (n === 0) return '0'
  if (n === d) return '1'
  return `${n}/${d}`
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

function simplify(n: number, d: number) {
  if (n === 0) return { num: 0, den: 1, display: '0' }
  if (n === d) return { num: 1, den: 1, display: '1' }
  const g = gcd(n, d)
  return { num: n / g, den: d / g, display: `${n / g}/${d / g}` }
}

function slicesArray(n: number) {
  return Array.from({ length: n }, (_, i) => i)
}

const compareSymbol = computed(() => {
  const a = pieA.filledCount() / pieA.state.slices
  const b = pieB.filledCount() / pieB.state.slices
  if (a > b) return '>'
  if (a < b) return '<'
  return '='
})

const compareResult = computed(() => {
  const a = fractionRepr(pieA.filledCount(), pieA.state.slices)
  const b = fractionRepr(pieB.filledCount(), pieB.state.slices)
  return `${a} ${compareSymbol.value} ${b}`
})

const addResult = computed(() => {
  const nL = pieAddL.filledCount()
  const dL = pieAddL.state.slices
  const nR = pieAddR.filledCount()
  const dR = pieAddR.state.slices
  const common = (dL * dR) / gcd(dL, dR)
  const num = nL * (common / dL) + nR * (common / dR)
  const simp = simplify(num, common)
  return {
    raw: `${fractionRepr(nL, dL)} + ${fractionRepr(nR, dR)} = ${num}/${common}`,
    simplified: simp.display,
    canSimplify: simp.num !== num || simp.den !== common
  }
})

function resetAll() {
  pieA.reset(); pieB.reset()
  pieAddL.reset(); pieAddR.reset()
}

const SLICE_RANGE = Array.from({ length: 11 }, (_, i) => i + 2)
</script>

<template>
  <div class="fp">
    <header class="fp__head">
      <h1>🍕 分数披萨</h1>
      <p class="fp__muted">点击披萨切片涂色，理解分数的比较与运算</p>
    </header>

    <nav class="fp__tabs">
      <button :class="['fp__tab', { active: mode === 'single' }]" @click="mode = 'single'">🎯 基础</button>
      <button :class="['fp__tab', { active: mode === 'compare' }]" @click="mode = 'compare'">⚖️ 比较</button>
      <button :class="['fp__tab', { active: mode === 'add' }]" @click="mode = 'add'">➕ 加法</button>
    </nav>

    <div v-if="mode === 'single'" class="fp__panel">
      <div class="fp__controls">
        <span class="fp__label">份数：</span>
        <div class="fp__chips">
          <button
            v-for="n in SLICE_RANGE" :key="n"
            :class="['fp__chip', { active: pieA.state.slices === n }]"
            @click="pieA.state.slices = n"
          >{{ n }}</button>
        </div>
      </div>
      <div class="fp__card">
        <svg viewBox="0 0 300 300" class="fp__pie" @contextmenu.prevent>
          <circle cx="150" cy="150" r="130" class="fp__crust" />
          <g v-for="i in slicesArray(pieA.state.slices)" :key="i">
            <path
              :d="slicePath(i, pieA.state.slices)"
              :class="['fp__slice', { active: pieA.isFilled(i) }]"
              @click="pieA.toggle(i)"
            />
          </g>
        </svg>
        <div class="fp__fraction">
          <span class="fp__fraction-num">{{ pieA.filledCount() }}</span>
          <span class="fp__fraction-bar" />
          <span class="fp__fraction-den">{{ pieA.state.slices }}</span>
        </div>
      </div>
    </div>

    <div v-else-if="mode === 'compare'" class="fp__panel">
      <div class="fp__dual">
        <div class="fp__card">
          <div class="fp__mini-chips">
            <button
              v-for="n in SLICE_RANGE" :key="n"
              :class="['fp__chip', { active: pieA.state.slices === n }]"
              @click="pieA.state.slices = n"
            >{{ n }}</button>
          </div>
          <svg viewBox="0 0 300 300" class="fp__pie fp__pie--sm">
            <circle cx="150" cy="150" r="130" class="fp__crust" />
            <g v-for="i in slicesArray(pieA.state.slices)" :key="i">
              <path
                :d="slicePath(i, pieA.state.slices)"
                :class="['fp__slice', { active: pieA.isFilled(i) }]"
                @click="pieA.toggle(i)"
              />
            </g>
          </svg>
          <div class="fp__fraction fp__fraction--sm">
            <span>{{ pieA.filledCount() }}</span>
            <span class="fp__fraction-bar" />
            <span>{{ pieA.state.slices }}</span>
          </div>
        </div>

        <div class="fp__symbol">{{ compareSymbol }}</div>

        <div class="fp__card">
          <div class="fp__mini-chips">
            <button
              v-for="n in SLICE_RANGE" :key="n"
              :class="['fp__chip', { active: pieB.state.slices === n }]"
              @click="pieB.state.slices = n"
            >{{ n }}</button>
          </div>
          <svg viewBox="0 0 300 300" class="fp__pie fp__pie--sm">
            <circle cx="150" cy="150" r="130" class="fp__crust" />
            <g v-for="i in slicesArray(pieB.state.slices)" :key="i">
              <path
                :d="slicePath(i, pieB.state.slices)"
                :class="['fp__slice', { active: pieB.isFilled(i) }]"
                @click="pieB.toggle(i)"
              />
            </g>
          </svg>
          <div class="fp__fraction fp__fraction--sm">
            <span>{{ pieB.filledCount() }}</span>
            <span class="fp__fraction-bar" />
            <span>{{ pieB.state.slices }}</span>
          </div>
        </div>
      </div>
      <div class="fp__result">{{ compareResult }}</div>
    </div>

    <div v-else-if="mode === 'add'" class="fp__panel">
      <div class="fp__dual">
        <div class="fp__card">
          <div class="fp__mini-chips">
            <button
              v-for="n in SLICE_RANGE" :key="n"
              :class="['fp__chip', { active: pieAddL.state.slices === n }]"
              @click="pieAddL.state.slices = n"
            >{{ n }}</button>
          </div>
          <svg viewBox="0 0 300 300" class="fp__pie fp__pie--sm">
            <circle cx="150" cy="150" r="130" class="fp__crust" />
            <g v-for="i in slicesArray(pieAddL.state.slices)" :key="i">
              <path
                :d="slicePath(i, pieAddL.state.slices)"
                :class="['fp__slice', { active: pieAddL.isFilled(i) }]"
                @click="pieAddL.toggle(i)"
              />
            </g>
          </svg>
          <div class="fp__fraction fp__fraction--sm">
            <span>{{ pieAddL.filledCount() }}</span>
            <span class="fp__fraction-bar" />
            <span>{{ pieAddL.state.slices }}</span>
          </div>
        </div>

        <div class="fp__symbol">+</div>

        <div class="fp__card">
          <div class="fp__mini-chips">
            <button
              v-for="n in SLICE_RANGE" :key="n"
              :class="['fp__chip', { active: pieAddR.state.slices === n }]"
              @click="pieAddR.state.slices = n"
            >{{ n }}</button>
          </div>
          <svg viewBox="0 0 300 300" class="fp__pie fp__pie--sm">
            <circle cx="150" cy="150" r="130" class="fp__crust" />
            <g v-for="i in slicesArray(pieAddR.state.slices)" :key="i">
              <path
                :d="slicePath(i, pieAddR.state.slices)"
                :class="['fp__slice', { active: pieAddR.isFilled(i) }]"
                @click="pieAddR.toggle(i)"
              />
            </g>
          </svg>
          <div class="fp__fraction fp__fraction--sm">
            <span>{{ pieAddR.filledCount() }}</span>
            <span class="fp__fraction-bar" />
            <span>{{ pieAddR.state.slices }}</span>
          </div>
        </div>
      </div>
      <div class="fp__result">
        <div class="fp__result-main">{{ addResult.raw }}</div>
        <div v-if="addResult.canSimplify" class="fp__result-sub">
          化简 = <strong>{{ addResult.simplified }}</strong>
        </div>
      </div>
    </div>

    <footer class="fp__foot">
      <button class="fp__btn fp__btn--ghost" @click="resetAll">🔄 重置</button>
    </footer>
  </div>
</template>

<style scoped>
.fp {
  --fp-primary: var(--color-primary, #4f7df8);
  --fp-success: var(--color-success, #10b981);
  --fp-bg: var(--bg-card, #ffffff);
  --fp-border: var(--border-color, #e5e7eb);
  --fp-text: var(--text-primary, #111827);
  --fp-muted: var(--text-secondary, #6b7280);

  padding: var(--space-4);
  max-width: 900px;
  margin: 0 auto;
}

.fp__head {
  text-align: center;
  margin-bottom: var(--space-6);
}
.fp__head h1 {
  font-size: var(--text-2xl);
  color: var(--fp-text);
  margin: 0 0 var(--space-2);
}
.fp__muted {
  color: var(--fp-muted);
  margin: 0;
  font-size: var(--text-sm);
}

.fp__tabs {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}
.fp__tab {
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-lg);
  border: 2px solid var(--fp-border);
  background: var(--fp-bg);
  color: var(--fp-text);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.fp__tab.active {
  background: var(--fp-primary);
  border-color: var(--fp-primary);
  color: white;
}

.fp__panel {
  background: var(--fp-bg);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  border: 2px solid var(--fp-border);
}

.fp__controls {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
  flex-wrap: wrap;
}
.fp__label {
  font-weight: 500;
  color: var(--fp-text);
}
.fp__chips, .fp__mini-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.fp__mini-chips {
  margin-bottom: var(--space-3);
  justify-content: center;
}
.fp__chip {
  min-width: 34px;
  padding: 6px 10px;
  border-radius: var(--radius-full);
  background: var(--bg-hover, #f3f4f6);
  border: 2px solid transparent;
  color: var(--fp-text);
  font-weight: 500;
  cursor: pointer;
  font-size: var(--text-sm);
  transition: all 0.15s;
}
.fp__chip.active {
  background: var(--fp-primary);
  color: white;
  border-color: var(--fp-primary);
}

.fp__card {
  text-align: center;
  flex: 1;
}

.fp__pie {
  width: 100%;
  max-width: 320px;
  height: auto;
  margin: 0 auto;
  display: block;
}
.fp__pie--sm {
  max-width: 240px;
}
.fp__crust {
  fill: var(--fp-bg);
  stroke: var(--fp-border);
  stroke-width: 2;
}
.fp__slice {
  fill: var(--bg-hover, #f3f4f6);
  stroke: var(--fp-border);
  stroke-width: 1.5;
  cursor: pointer;
  transition: fill 0.15s;
}
.fp__slice:hover {
  fill: var(--color-primary-light, #dbeafe);
}
.fp__slice.active {
  fill: var(--fp-primary);
  stroke: var(--fp-primary);
}

.fp__fraction {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin-top: var(--space-3);
  font-size: var(--text-2xl);
  color: var(--fp-text);
  font-weight: 700;
}
.fp__fraction--sm {
  font-size: var(--text-xl);
}
.fp__fraction-bar {
  width: 40px;
  height: 3px;
  background: var(--fp-text);
  margin: 4px 0;
  border-radius: 2px;
}

.fp__dual {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-5);
  flex-wrap: wrap;
}

.fp__symbol {
  font-size: 48px;
  font-weight: 700;
  color: var(--fp-primary);
  padding: 0 var(--space-3);
}

.fp__result {
  text-align: center;
  margin-top: var(--space-5);
  padding: var(--space-4);
  background: var(--bg-hover, #f3f4f6);
  border-radius: var(--radius-lg);
  font-size: var(--text-xl);
  color: var(--fp-text);
  font-weight: 600;
}
.fp__result-sub {
  margin-top: var(--space-2);
  font-size: var(--text-base);
  color: var(--fp-success);
}

.fp__foot {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.fp__btn {
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  border: none;
  background: var(--fp-primary);
  color: white;
  font-weight: 500;
  cursor: pointer;
  font-size: var(--text-base);
}
.fp__btn--ghost {
  background: transparent;
  color: var(--fp-text);
  border: 2px solid var(--fp-border);
}

@media (max-width: 640px) {
  .fp__dual {
    flex-direction: column;
  }
  .fp__symbol {
    font-size: 36px;
  }
}
</style>
