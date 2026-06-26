<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface NumToken {
  id: number
  value: number
  used: boolean
}

interface Token {
  type: 'num' | 'op'
  value: string | number
  numId?: number
}

const numbers = ref<NumToken[]>([])
const expression = ref<Token[]>([])
const score = ref(0)
const level = ref(1)
const message = ref('')
const messageType = ref<'success' | 'error' | 'info'>('info')
const hint = ref('')

let tokenId = 0

function rand(n: number) {
  return Math.floor(Math.random() * n) + 1
}

function evalTokens(tokens: Token[]): number | null {
  const parts = tokens.map(t => String(t.value))
  if (parts.length === 0) return null
  // 简单的加减乘除计算器（含括号支持）
  const expr = parts.join('')
  if (!/^[0-9+\-*/()\s]+$/.test(expr)) return null
  try {
    // 用迭代方式计算：先处理括号，再处理乘除，最后处理加减
    return calculate(expr)
  } catch {
    return null
  }
}

function calculate(expr: string): number | null {
  // 递归下降解析器
  let pos = 0
  expr = expr.replace(/\s+/g, '')
  
  function parseExpr(): number | null {
    let left = parseTerm()
    if (left === null) return null
    while (pos < expr.length && (expr[pos] === '+' || expr[pos] === '-')) {
      const op = expr[pos++]
      const right = parseTerm()
      if (right === null) return null
      left = op === '+' ? left + right : left - right
    }
    return left
  }
  
  function parseTerm(): number | null {
    let left = parseFactor()
    if (left === null) return null
    while (pos < expr.length && (expr[pos] === '*' || expr[pos] === '/')) {
      const op = expr[pos++]
      const right = parseFactor()
      if (right === null) return null
      if (op === '*') left = left * right
      else { if (right === 0) return null; left = left / right }
    }
    return left
  }
  
  function parseFactor(): number | null {
    if (pos >= expr.length) return null
    if (expr[pos] === '(') {
      pos++
      const val = parseExpr()
      if (pos < expr.length && expr[pos] === ')') pos++
      return val
    }
    if (expr[pos] === '-') {
      pos++
      const val = parseFactor()
      return val === null ? null : -val
    }
    let num = 0
    let hasDigit = false
    while (pos < expr.length && /\d/.test(expr[pos])) {
      num = num * 10 + parseInt(expr[pos], 10)
      pos++
      hasDigit = true
    }
    return hasDigit ? num : null
  }
  
  const result = parseExpr()
  if (result === null || pos < expr.length) return null
  return result
}

function generateNumbers() {
  for (let attempt = 0; attempt < 200; attempt++) {
    const nums = [rand(13), rand(13), rand(13), rand(13)]
    if (findSolution(nums)) {
      numbers.value = nums.map((n, i) => ({ id: i, value: n, used: false }))
      return
    }
  }
  const fallback = [3, 4, 8, 4]
  numbers.value = fallback.map((n, i) => ({ id: i, value: n, used: false }))
}

function findSolution(nums: number[]): string | null {
  const ops = ['+', '-', '*', '/']
  const permute = (arr: number[]): number[][] => {
    if (arr.length <= 1) return [arr]
    const result: number[][] = []
    for (let i = 0; i < arr.length; i++) {
      const rest = [...arr.slice(0, i), ...arr.slice(i + 1)]
      permute(rest).forEach(p => result.push([arr[i], ...p]))
    }
    return result
  }
  const calc = (a: number, b: number, op: string): number | null => {
    switch (op) {
      case '+': return a + b
      case '-': return a - b
      case '*': return a * b
      case '/': return b !== 0 ? a / b : null
    }
    return null
  }
  for (const p of permute(nums)) {
    for (const o1 of ops) for (const o2 of ops) for (const o3 of ops) {
      const patterns = [
        { e: `((${p[0]}${o1}${p[1]})${o2}${p[2]})${o3}${p[3]}`, v: [p[0], p[1], o1, p[2], o2, p[3], o3] },
        { e: `(${p[0]}${o1}(${p[1]}${o2}${p[2]}))${o3}${p[3]}`, v: [p[1], p[2], o2, p[0], o1, p[3], o3] },
        { e: `(${p[0]}${o1}${p[1]})${o2}(${p[2]}${o3}${p[3]})`, v: [p[0], p[1], o1, p[2], p[3], o3, o2] },
        { e: `${p[0]}${o1}((${p[1]}${o2}${p[2]})${o3}${p[3]})`, v: [p[1], p[2], o2, p[3], o3, p[0], o1] },
        { e: `${p[0]}${o1}(${p[1]}${o2}(${p[2]}${o3}${p[3]}))`, v: [p[2], p[3], o3, p[1], o2, p[0], o1] }
      ]
      for (const pat of patterns) {
        const [a, b, oa, c, ob, d, oc] = pat.v as [number, number, string, number, string, number, string]
        const r1 = calc(a, b, oa); if (r1 === null) continue
        const r2 = calc(r1, c, ob); if (r2 === null) continue
        const r3 = calc(r2, d, oc)
        if (r3 !== null && Math.abs(r3 - 24) < 1e-9) return pat.e
      }
    }
  }
  return null
}

function useNumber(n: NumToken) {
  if (n.used) return
  const last = expression.value[expression.value.length - 1]
  if (last && last.type === 'num') return
  n.used = true
  tokenId++
  expression.value.push({ type: 'num', value: n.value, numId: n.id })
}

function useOperator(op: string) {
  const last = expression.value[expression.value.length - 1]
  if (!last || last.type === 'op') return
  expression.value.push({ type: 'op', value: op })
}

function useParen(p: string) {
  expression.value.push({ type: 'op', value: p })
}

function undo() {
  const t = expression.value.pop()
  if (!t) return
  if (t.type === 'num' && t.numId !== undefined) {
    const num = numbers.value.find(n => n.id === t.numId)
    if (num) num.used = false
  }
}

function clearExpr() {
  expression.value = []
  numbers.value.forEach(n => n.used = false)
  message.value = ''
  hint.value = ''
}

function checkAnswer() {
  const usedCount = numbers.value.filter(n => n.used).length
  if (usedCount !== 4) {
    message.value = '必须使用全部 4 个数字！'
    messageType.value = 'error'
    return
  }
  const result = evalTokens(expression.value)
  if (result === null) {
    message.value = '表达式无效'
    messageType.value = 'error'
    return
  }
  if (Math.abs(result - 24) < 1e-9) {
    message.value = `正确！= 24，+${10} 分`
    messageType.value = 'success'
    score.value += 10
    setTimeout(newProblem, 1200)
  } else {
    message.value = `结果是 ${result}，不是 24`
    messageType.value = 'error'
  }
}

function showHint() {
  const vals = numbers.value.map(n => n.value)
  const sol = findSolution(vals)
  hint.value = sol ? `提示：${sol} = 24` : '未找到解法'
  message.value = ''
}

function newProblem() {
  level.value++
  generateNumbers()
  expression.value = []
  message.value = ''
  hint.value = ''
}

const exprDisplay = computed(() => {
  return expression.value.map(t => String(t.value)).join(' ') || '请选择数字'
})

onMounted(() => {
  generateNumbers()
})
</script>

<template>
  <div class="tf-game">
    <header class="tf-header">
      <h1 class="tf-title">🎯 24 点</h1>
      <div class="tf-stats">
        <div class="tf-stat">
          <span>得分</span>
          <strong>{{ score }}</strong>
        </div>
        <div class="tf-stat">
          <span>关卡</span>
          <strong>{{ level }}</strong>
        </div>
      </div>
    </header>

    <div class="tf-panel">
      <div class="tf-problem">
        <div class="tf-problem-label">题目数字</div>
        <div class="tf-numbers">
          <button
            v-for="n in numbers"
            :key="n.id"
            class="tf-num-btn"
            :class="{ 'tf-num-btn--used': n.used }"
            :disabled="n.used"
            @click="useNumber(n)"
          >
            {{ n.value }}
          </button>
        </div>
      </div>

      <div class="tf-expr-box">
        <div class="tf-expr-label">当前表达式</div>
        <div class="tf-expr-display">{{ exprDisplay }}</div>
      </div>

      <div class="tf-ops">
        <button class="tf-op-btn" @click="useOperator('+')">+</button>
        <button class="tf-op-btn" @click="useOperator('-')">−</button>
        <button class="tf-op-btn" @click="useOperator('*')">×</button>
        <button class="tf-op-btn" @click="useOperator('/')">÷</button>
        <button class="tf-op-btn tf-op-btn--paren" @click="useParen('(')">(</button>
        <button class="tf-op-btn tf-op-btn--paren" @click="useParen(')')">)</button>
      </div>

      <p v-if="message" class="tf-msg" :class="`tf-msg--${messageType}`">{{ message }}</p>
      <p v-if="hint" class="tf-msg tf-msg--info">{{ hint }}</p>

      <div class="tf-actions">
        <button class="tf-btn tf-btn--secondary" @click="undo">撤销</button>
        <button class="tf-btn tf-btn--secondary" @click="clearExpr">清空</button>
        <button class="tf-btn tf-btn--primary" @click="checkAnswer">检查</button>
      </div>

      <div class="tf-actions">
        <button class="tf-btn tf-btn--hint" @click="showHint">💡 提示</button>
        <button class="tf-btn tf-btn--new" @click="newProblem">换一题</button>
      </div>
    </div>

    <div class="tf-used">
      <span>已用数字：</span>
      <span v-for="n in numbers" :key="n.id" class="tf-used-tag" :class="{ 'tf-used-tag--on': n.used }">
        {{ n.value }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.tf-game {
  max-width: 520px;
  margin: 0 auto;
  padding: var(--space-4);
}

.tf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.tf-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
}

.tf-stats {
  display: flex;
  gap: var(--space-4);
}

.tf-stat {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.tf-stat strong {
  display: block;
  font-size: var(--text-xl);
  color: var(--color-primary);
}

.tf-panel {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
}

.tf-problem-label,
.tf-expr-label {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin-bottom: var(--space-3);
}

.tf-numbers {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.tf-num-btn {
  aspect-ratio: 1;
  font-size: var(--text-3xl);
  font-weight: 700;
  background: var(--color-primary);
  color: var(--text-inverse);
  border-radius: var(--radius-lg);
  transition: transform var(--transition-fast);
}

.tf-num-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.tf-num-btn--used {
  background: var(--bg-hover);
  color: var(--text-tertiary);
}

.tf-expr-box {
  background: var(--bg-page);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  text-align: center;
}

.tf-expr-display {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--text-primary);
  font-family: var(--font-mono);
  min-height: 2.25rem;
}

.tf-ops {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}

.tf-op-btn {
  width: 44px;
  height: 44px;
  font-size: var(--text-xl);
  font-weight: 700;
  background: var(--bg-hover);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.tf-op-btn:hover {
  background: var(--color-primary);
  color: var(--text-inverse);
}

.tf-op-btn--paren {
  background: var(--bg-active);
}

.tf-msg {
  text-align: center;
  margin-bottom: var(--space-4);
  font-weight: 600;
  padding: var(--space-3);
  border-radius: var(--radius-md);
}

.tf-msg--success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.tf-msg--error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.tf-msg--info {
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-primary);
  font-family: var(--font-mono);
}

.tf-actions {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.tf-btn {
  flex: 1;
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  font-weight: 600;
  transition: transform var(--transition-fast);
}

.tf-btn:hover {
  transform: translateY(-1px);
}

.tf-btn--primary {
  background: var(--color-primary);
  color: var(--text-inverse);
}

.tf-btn--secondary {
  background: var(--bg-hover);
  color: var(--text-secondary);
}

.tf-btn--hint {
  background: var(--color-secondary);
  color: var(--text-inverse);
}

.tf-btn--new {
  background: var(--color-success);
  color: var(--text-inverse);
}

.tf-used {
  margin-top: var(--space-6);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.tf-used-tag {
  display: inline-block;
  padding: var(--space-1) var(--space-2);
  margin: 0 var(--space-1);
  background: var(--bg-hover);
  border-radius: var(--radius-sm);
  font-weight: 600;
  color: var(--text-tertiary);
}

.tf-used-tag--on {
  background: var(--color-primary);
  color: var(--text-inverse);
}
</style>
