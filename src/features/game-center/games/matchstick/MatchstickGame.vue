<script setup lang="ts">
import { ref, computed } from 'vue'

interface Level {
  id: number
  display: string
  answer: string
  hint: string
  difficulty: 1 | 2 | 3
}

const LEVELS: Level[] = [
  { id: 1, display: '1 + 2 = 4', answer: '7-2=5', hint: '把加号的竖火柴移到数字 1 上', difficulty: 1 },
  { id: 2, display: '5 - 2 = 2', answer: '5-3=2', hint: '从第一个 2 中移动一根火柴，让它变成 3', difficulty: 1 },
  { id: 3, display: '3 - 3 = 6', answer: '3+3=6', hint: '给减号加一根竖火柴', difficulty: 1 },
  { id: 4, display: '6 + 5 = 4', answer: '6-5=1', hint: '把加号的竖火柴移到数字 4 上', difficulty: 2 },
  { id: 5, display: '8 - 1 = 6', answer: '9-1=8', hint: '让 8 和 6 互换身份', difficulty: 2 },
  { id: 6, display: '1 + 1 = 3', answer: '1+1=2', hint: '从 3 中拿走一根火柴，变成 2', difficulty: 1 },
  { id: 7, display: '9 - 5 = 12', answer: '9-5=4', hint: '移动 12 中的一根火柴让它变成 4', difficulty: 3 },
  { id: 8, display: '2 + 2 = 7', answer: '7-2=5', hint: '把加号的竖火柴移到第一个 2 上', difficulty: 2 },
  { id: 9, display: '4 + 3 = 8', answer: '4+3=7', hint: '从 8 中拿走一根火柴变成 7', difficulty: 2 },
  { id: 10, display: '5 + 5 = 9', answer: '5+4=9', hint: '把一个 5 改成 4', difficulty: 3 }
]

const currentLevelIndex = ref(0)
const userAnswer = ref('')
const showFeedback = ref(false)
const isCorrect = ref(false)
const showHint = ref(false)
const solvedLevels = ref<Set<number>>(new Set())
const gameCompleted = ref(false)

const currentLevel = computed(() => LEVELS[currentLevelIndex.value])
const progress = computed(() => (currentLevelIndex.value / LEVELS.length) * 100)

function normalize(str: string): string {
  return str.replace(/\s+/g, '')
}

function validateExpression(expr: string): boolean {
  if (!expr.includes('=')) return false
  const [left, right] = expr.split('=')
  if (!left || !right) return false
  if (!/^[0-9+\-=\s]+$/.test(expr)) return false
  try {
    const l = eval(left.replace(/\s+/g, ''))
    const r = eval(right.replace(/\s+/g, ''))
    return l === r && typeof l === 'number'
  } catch {
    return false
  }
}

function submitAnswer() {
  if (!userAnswer.value.trim()) return
  const a = normalize(userAnswer.value)
  const b = normalize(currentLevel.value.answer)
  isCorrect.value = a === b || validateExpression(userAnswer.value)
  if (isCorrect.value) {
    solvedLevels.value.add(currentLevel.value.id)
  }
  showFeedback.value = true
}

function nextLevel() {
  showFeedback.value = false
  showHint.value = false
  userAnswer.value = ''
  if (currentLevelIndex.value < LEVELS.length - 1) {
    currentLevelIndex.value++
  } else {
    gameCompleted.value = true
  }
}

function resetLevel() {
  userAnswer.value = ''
  showFeedback.value = false
  showHint.value = false
}

function restartGame() {
  currentLevelIndex.value = 0
  solvedLevels.value = new Set()
  gameCompleted.value = false
  resetLevel()
}

function gotoLevel(index: number) {
  if (index < 0 || index >= LEVELS.length) return
  currentLevelIndex.value = index
  resetLevel()
}

function handleKeydown(e: KeyboardEvent) {
  if (gameCompleted.value) return
  if (e.key === 'Enter' && !showFeedback.value) submitAnswer()
}
</script>

<template>
  <div class="mg">
      <div v-if="gameCompleted" class="mg__completed">
        <h1 class="mg__title">🎉 恭喜通关！</h1>
        <p class="mg__desc">你已完成全部 {{ LEVELS.length }} 个火柴棒谜题</p>
        <button class="mg__btn mg__btn--primary" @click="restartGame">重新开始</button>
      </div>

      <div v-else class="mg__main">
        <div class="mg__header">
          <h1 class="mg__title">🔥 火柴棒谜题</h1>
          <p class="mg__level">
            第 {{ currentLevelIndex + 1 }} / {{ LEVELS.length }} 关 ·
            <span class="mg__difficulty" :class="`mg__difficulty--${currentLevel.difficulty}`">
              {{ currentLevel.difficulty === 1 ? '简单' : currentLevel.difficulty === 2 ? '中等' : '挑战' }}
              {{ '⭐'.repeat(currentLevel.difficulty) }}
            </span>
          </p>
        </div>

        <div class="mg__progress">
          <div class="mg__progress-bar">
            <div class="mg__progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <span class="mg__progress-text">{{ solvedLevels.size }} / {{ LEVELS.length }}</span>
        </div>

        <div class="mg__nav">
          <button
            v-for="(lv, i) in LEVELS"
            :key="lv.id"
            class="mg__dot"
            :class="{
              'mg__dot--active': i === currentLevelIndex,
              'mg__dot--solved': solvedLevels.has(lv.id)
            }"
            @click="gotoLevel(i)"
          >
            {{ lv.id }}
          </button>
        </div>

        <div
          class="mg__problem"
          :class="{
            'mg__problem--correct': showFeedback && isCorrect,
            'mg__problem--wrong': showFeedback && !isCorrect
          }"
        >
          <p class="mg__task">移动一根火柴棒，使等式成立</p>
          <div class="mg__equation">{{ currentLevel.display }}</div>
          <input
            v-model="userAnswer"
            type="text"
            class="mg__input"
            placeholder="输入正确等式，如 7-2=4"
            :disabled="showFeedback"
            autocomplete="off"
            @keydown="handleKeydown"
          />
          <p v-if="showFeedback && !isCorrect" class="mg__feedback mg__feedback--wrong">
            ❌ 不对，再想想？
          </p>
          <p v-if="showFeedback && isCorrect" class="mg__feedback mg__feedback--correct">
            ✅ 正确！答案：{{ currentLevel.answer }}
          </p>
        </div>

        <div v-if="showHint" class="mg__hint">💡 {{ currentLevel.hint }}</div>

        <div class="mg__actions">
          <button class="mg__btn mg__btn--secondary" @click="showHint = !showHint">
            {{ showHint ? '隐藏' : '提示' }}
          </button>
          <button class="mg__btn mg__btn--secondary" @click="resetLevel">重置</button>
          <button
            v-if="!showFeedback"
            class="mg__btn mg__btn--primary"
            :disabled="!userAnswer.trim()"
            @click="submitAnswer"
          >
            提交
          </button>
          <button v-else class="mg__btn mg__btn--primary" @click="nextLevel">
            {{ currentLevelIndex < LEVELS.length - 1 ? '下一关' : '查看结果' }}
          </button>
        </div>
      </div>
  </div>
</template>

<style scoped>
.mg { max-width: 500px; margin: 0 auto; text-align: center; }
.mg__title { font-size: var(--text-2xl); margin-bottom: var(--space-2); }
.mg__header { margin-bottom: var(--space-4); }
.mg__level { color: var(--text-secondary); font-size: var(--text-sm); }
.mg__difficulty {
  display: inline-block; padding: 2px 8px; border-radius: var(--radius-md);
  margin-left: var(--space-2); font-size: var(--text-xs); font-weight: 600;
}
.mg__difficulty--1 { background: rgba(16, 185, 129, 0.15); color: var(--color-success); }
.mg__difficulty--2 { background: rgba(251, 191, 36, 0.15); color: var(--color-warning); }
.mg__difficulty--3 { background: rgba(239, 68, 68, 0.15); color: var(--color-error); }

.mg__progress { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4); }
.mg__progress-bar { flex: 1; height: 6px; background: var(--bg-hover); border-radius: var(--radius-full); overflow: hidden; }
.mg__progress-fill { height: 100%; background: var(--color-primary); transition: width var(--transition-fast); }
.mg__progress-text { font-size: var(--text-sm); color: var(--text-secondary); min-width: 50px; text-align: right; }

.mg__nav { display: flex; gap: var(--space-2); justify-content: center; margin-bottom: var(--space-5); flex-wrap: wrap; }
.mg__dot {
  width: 32px; height: 32px; border-radius: var(--radius-md);
  background: var(--bg-card); border: 2px solid var(--border-color);
  color: var(--text-secondary); font-weight: 600; font-size: var(--text-sm);
  transition: all var(--transition-fast);
}
.mg__dot:hover { border-color: var(--color-primary); color: var(--color-primary); }
.mg__dot--active { background: var(--color-primary); border-color: var(--color-primary); color: white; }
.mg__dot--solved:not(.mg__dot--active) {
  background: rgba(16, 185, 129, 0.12); border-color: var(--color-success); color: var(--color-success);
}

.mg__problem {
  background: var(--bg-card); border-radius: var(--radius-xl);
  padding: var(--space-8) var(--space-4); margin-bottom: var(--space-4);
  border: 2px solid transparent; transition: all var(--transition-fast);
}
.mg__problem--correct { background: rgba(16, 185, 129, 0.1); border-color: var(--color-success); }
.mg__problem--wrong { background: rgba(239, 68, 68, 0.1); border-color: var(--color-error); }

.mg__task { color: var(--text-secondary); margin-bottom: var(--space-4); font-size: var(--text-sm); }

.mg__equation {
  background: var(--bg-hover); border-radius: var(--radius-lg);
  padding: var(--space-4); margin-bottom: var(--space-4);
  font-size: var(--text-3xl); font-weight: 700;
  font-family: 'Courier New', monospace; letter-spacing: var(--space-1);
  color: var(--text-primary);
}

.mg__input {
  width: 100%; max-width: 260px; font-size: var(--text-xl); text-align: center;
  padding: var(--space-3); border: 2px solid var(--border-color);
  border-radius: var(--radius-lg); background: var(--bg-base); color: var(--text-primary);
  font-family: 'Courier New', monospace; transition: border-color var(--transition-fast);
}
.mg__input:focus { outline: none; border-color: var(--color-primary); }
.mg__input:disabled { opacity: 0.6; }

.mg__feedback { margin-top: var(--space-3); font-weight: 600; font-size: var(--text-base); }
.mg__feedback--correct { color: var(--color-success); }
.mg__feedback--wrong { color: var(--color-error); }

.mg__hint {
  background: rgba(251, 191, 36, 0.12); border: 1px solid var(--color-warning);
  color: var(--color-warning); padding: var(--space-3); border-radius: var(--radius-lg);
  margin-bottom: var(--space-4); font-size: var(--text-sm); text-align: left;
}

.mg__actions { display: flex; gap: var(--space-3); }
.mg__btn { flex: 1; padding: var(--space-3); border-radius: var(--radius-lg); font-weight: 600; transition: all var(--transition-fast); }
.mg__btn--primary { background: var(--color-primary); color: white; }
.mg__btn--primary:disabled { background: var(--bg-hover); color: var(--text-tertiary); cursor: not-allowed; }
.mg__btn--secondary { background: var(--bg-hover); color: var(--text-secondary); }

.mg__completed { text-align: center; padding: var(--space-8) 0; }
.mg__desc { color: var(--text-secondary); margin-bottom: var(--space-6); }
.mg__completed .mg__btn { margin-top: var(--space-6); max-width: 240px; margin-left: auto; margin-right: auto; display: block; }
</style>
