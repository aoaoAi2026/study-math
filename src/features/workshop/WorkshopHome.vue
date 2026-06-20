<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, computed } from 'vue'

type QuestionType = 'add-sub' | 'mul-div' | 'mixed' | 'compare'
type Difficulty = 'easy' | 'medium' | 'hard'

interface Question {
  id: number; expression: string; answer: number
  userAnswer: string; isCorrect?: boolean
}

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: 'add-sub', label: '加减法' }, { value: 'mul-div', label: '乘除法' },
  { value: 'mixed', label: '混合运算' }, { value: 'compare', label: '比较大小' }
]
const difficulties: { value: Difficulty; label: string; range: [number, number] }[] = [
  { value: 'easy', label: '简单', range: [1, 20] },
  { value: 'medium', label: '中等', range: [1, 100] },
  { value: 'hard', label: '困难', range: [1, 1000] }
]
const questionCounts = [5, 10, 15, 20]

const selectedType = ref<QuestionType>('add-sub')
const selectedDifficulty = ref<Difficulty>('easy')
const selectedCount = ref(10)
const questions = ref<Question[]>([])
const submitted = ref(false)
const score = ref(0)

const range = computed(() => difficulties.find(d => d.value === selectedDifficulty.value)!.range)
const wrongCount = computed(() => questions.value.filter(q => !q.isCorrect).length)

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateQuestion(id: number): Question {
  const [lo, hi] = range.value
  let a: number, b: number, answer: number, expression: string

  if (selectedType.value === 'compare') {
    a = randInt(lo, hi); b = randInt(lo, hi)
    answer = a > b ? 1 : a < b ? -1 : 0
    return { id, expression: `${a} ___ ${b}`, answer, userAnswer: '' }
  }

  const ops = selectedType.value === 'add-sub' ? ['+', '-']
    : selectedType.value === 'mul-div' ? ['\u00d7', '\u00f7']
    : ['+', '-', '\u00d7', '\u00f7']
  const op = ops[randInt(0, ops.length - 1)]

  if (op === '+') { a = randInt(lo, hi); b = randInt(lo, hi); answer = a + b }
  else if (op === '-') { a = randInt(lo, hi); b = randInt(lo, a); answer = a - b }
  else if (op === '\u00d7') {
    const mulHi = selectedDifficulty.value === 'hard' ? 30 : selectedDifficulty.value === 'medium' ? 12 : 9
    a = randInt(2, mulHi); b = randInt(2, mulHi); answer = a * b
  } else {
    b = randInt(2, selectedDifficulty.value === 'hard' ? 20 : 9)
    answer = randInt(1, selectedDifficulty.value === 'hard' ? 20 : 9); a = b * answer
  }
  return { id, expression: `${a} ${op} ${b} =`, answer, userAnswer: '' }
}

function generatePaper() {
  submitted.value = false; score.value = 0
  questions.value = Array.from({ length: selectedCount.value }, (_, i) => generateQuestion(i + 1))
}

function submitAnswers() {
  let correct = 0
  questions.value.forEach(q => {
    if (selectedType.value === 'compare') {
      q.isCorrect = (q.userAnswer === '>' && q.answer === 1)
        || (q.userAnswer === '<' && q.answer === -1) || (q.userAnswer === '=' && q.answer === 0)
    } else { q.isCorrect = Number(q.userAnswer) === q.answer }
    if (q.isCorrect) correct++
  })
  score.value = correct; submitted.value = true
}

function printPaper() {
  window.print()
}
</script>

<template>
  <AppLayout>
    <div class="workshop">
    <header class="workshop__header">
      <h1>出题工坊</h1>
      <p>自定义生成数学练习题，打印或在线作答</p>
    </header>

    <section class="workshop__config">
      <div class="config-group">
        <label>题型</label>
        <div class="option-pills">
          <button v-for="t in questionTypes" :key="t.value"
            :class="['pill', { active: selectedType === t.value }]"
            @click="selectedType = t.value">{{ t.label }}</button>
        </div>
      </div>
      <div class="config-group">
        <label>难度</label>
        <div class="option-pills">
          <button v-for="d in difficulties" :key="d.value"
            :class="['pill', { active: selectedDifficulty === d.value }]"
            @click="selectedDifficulty = d.value">{{ d.label }}（{{ d.range[0] }}-{{ d.range[1] }}）</button>
        </div>
      </div>
      <div class="config-group">
        <label>题数</label>
        <div class="option-pills">
          <button v-for="n in questionCounts" :key="n"
            :class="['pill', { active: selectedCount === n }]"
            @click="selectedCount = n">{{ n }}题</button>
        </div>
      </div>
      <button class="btn-generate" @click="generatePaper">生成试卷</button>
    </section>

    <section v-if="questions.length" class="workshop__paper">
      <div class="paper-actions">
        <button class="btn-action" @click="printPaper">打印试卷</button>
        <button v-if="!submitted" class="btn-action btn-submit" @click="submitAnswers">提交答案</button>
        <button v-else class="btn-action btn-submit" @click="generatePaper">重新生成</button>
      </div>
      <div v-if="submitted" class="result-bar">
        得分：<strong>{{ score }}</strong> / {{ questions.length }}
        <span v-if="wrongCount" class="wrong-hint">，错题 {{ wrongCount }} 道</span>
      </div>
      <div class="question-list">
        <div v-for="q in questions" :key="q.id"
          :class="['question-item', submitted && q.isCorrect ? 'correct' : '', submitted && !q.isCorrect ? 'wrong' : '']">
          <span class="q-num">{{ q.id }}.</span>
          <span class="q-expr">{{ q.expression }}</span>
          <input v-if="!submitted" v-model="q.userAnswer" class="q-input"
            :placeholder="selectedType === 'compare' ? '>/</=' : '答案'" @keyup.enter="submitAnswers" />
          <span v-else class="q-result">
            <template v-if="q.isCorrect">✓</template>
            <template v-else>✗ 正确答案：{{ q.answer }}</template>
          </span>
        </div>
      </div>
    </section>
    </div>
  </AppLayout>
</template>

<style scoped>
.workshop { max-width: var(--content-max-width); margin: 0 auto; padding: var(--space-6); }
.workshop__header { text-align: center; margin-bottom: var(--space-8); }
.workshop__header h1 { font-size: var(--text-3xl); color: var(--text-primary); margin-bottom: var(--space-1); }
.workshop__header p { color: var(--text-secondary); font-size: var(--text-sm); }

.workshop__config, .workshop__paper {
  background: var(--bg-card); border-radius: var(--radius-xl);
  padding: var(--space-6); box-shadow: var(--shadow-md); margin-bottom: var(--space-6);
}
.config-group { margin-bottom: var(--space-5); }
.config-group label { display: block; font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-2); }
.option-pills { display: flex; flex-wrap: wrap; gap: var(--space-2); }

.pill {
  padding: var(--space-2) var(--space-4); border: 1px solid var(--border-color);
  border-radius: var(--radius-full); background: var(--bg-card);
  color: var(--text-secondary); font-size: var(--text-sm); cursor: pointer;
  transition: all var(--transition-fast);
}
.pill:hover { border-color: var(--color-primary-light); color: var(--color-primary); }
.pill.active { background: var(--color-primary); color: var(--text-inverse); border-color: var(--color-primary); }

.btn-generate {
  width: 100%; padding: var(--space-3) 0; border: none; border-radius: var(--radius-lg);
  background: var(--color-primary); color: var(--text-inverse); font-size: var(--text-base);
  font-weight: 600; cursor: pointer; margin-top: var(--space-2);
}
.btn-generate:hover { background: var(--color-primary-dark); }

.paper-actions { display: flex; gap: var(--space-3); margin-bottom: var(--space-5); }
.btn-action {
  padding: var(--space-2) var(--space-5); border: 1px solid var(--border-color);
  border-radius: var(--radius-lg); background: var(--bg-card); color: var(--text-primary);
  font-size: var(--text-sm); cursor: pointer;
}
.btn-action:hover { background: var(--bg-hover); }
.btn-submit { background: var(--color-success); color: var(--text-inverse); border-color: var(--color-success); }

.result-bar {
  padding: var(--space-3) var(--space-4); background: var(--bg-hover);
  border-radius: var(--radius-md); margin-bottom: var(--space-5); color: var(--text-primary);
}
.result-bar strong { color: var(--color-primary); font-size: var(--text-xl); }
.wrong-hint { color: var(--color-error); }

.question-list { display: flex; flex-direction: column; gap: var(--space-3); }
.question-item {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) var(--space-4); border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}
.question-item.correct { background: rgba(16,185,129,.08); border-color: var(--color-success); }
.question-item.wrong { background: rgba(239,68,68,.08); border-color: var(--color-error); }

.q-num { min-width: 2rem; font-weight: 600; color: var(--text-secondary); font-size: var(--text-sm); }
.q-expr { font-size: var(--text-lg); font-family: var(--font-mono); color: var(--text-primary); white-space: nowrap; }
.q-input {
  width: 80px; padding: var(--space-2) var(--space-3); border: 1px solid var(--border-color);
  border-radius: var(--radius-md); font-size: var(--text-base); text-align: center;
  color: var(--text-primary); background: var(--bg-card);
}
.q-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(99,102,241,.2); }
.q-result { font-size: var(--text-sm); font-weight: 600; }
.question-item.correct .q-result { color: var(--color-success); }
.question-item.wrong .q-result { color: var(--color-error); }

@media print {
  .workshop__config, .paper-actions, .result-bar, .q-input, .q-result { display: none !important; }
  .question-item { border: none; padding: 8px 0; }
  .q-expr::after { content: '______'; margin-left: 8px; }
}
</style>
