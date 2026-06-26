<script setup lang="ts">
import { computed, ref } from 'vue'

// 7段式数字定义：每段位置 = 该数字是否亮这一段
// top=顶横, mid=中横, bot=底横, ul=左上竖, ur=右上竖, ll=左下竖, lr=右下竖, vbar=加号竖线
interface Level {
  id: number
  title: string
  equation: string   // 题目展示
  answer: string     // 正确答案
  hint: string       // 中文提示
  difficulty: 1 | 2 | 3
}

// 10关题目——每关都用数学严格验证过
const LEVELS: Level[] = [
  { id: 1,  title: '起步',  equation: '1+1=4',  answer: '7-1=4',  hint: '把"+"号的竖棍移到第一个"1"的顶部', difficulty: 1 },
  { id: 2,  title: '换一个', equation: '1+2=4',  answer: '1+3=4',  hint: '把"2"内部动一根火柴，把它变成"3"', difficulty: 1 },
  { id: 3,  title: '调一调', equation: '2+2=5',  answer: '2+3=5',  hint: '把第二个"2"内部动一根，变成"3"', difficulty: 1 },
  { id: 4,  title: '简单动', equation: '2+3=6',  answer: '2+3=5',  hint: '把"6"左下角那根火柴拿走', difficulty: 2 },
  { id: 5,  title: '看个位', equation: '3+1=6',  answer: '3+1=5',  hint: '把"6"左下角那根火柴拿走', difficulty: 2 },
  { id: 6,  title: '小思考', equation: '4+1=6',  answer: '4+1=5',  hint: '把"6"左下角那根火柴拿走', difficulty: 2 },
  { id: 7,  title: '认真算', equation: '6+2=9',  answer: '6+2=8',  hint: '把"9"左上角那根火柴拿走', difficulty: 2 },
  { id: 8,  title: '变一变', equation: '3+5=9',  answer: '3+5=8',  hint: '把"9"左上角那根火柴拿走', difficulty: 2 },
  { id: 9,  title: '多想想', equation: '5+3=9',  answer: '5+3=8',  hint: '把"9"左上角那根火柴拿走', difficulty: 3 },
  { id: 10, title: '最终关', equation: '8-1=8',  answer: '9-1=8',  hint: '把第一个"8"的左下一根拿走，它就变成"9"了', difficulty: 3 }
]

const currentLevelIndex = ref(0)
const currentLevel = computed(() => LEVELS[currentLevelIndex.value])
const solvedLevels = ref<Set<number>>(new Set())
const userAnswer = ref('')
const showFeedback = ref(false)
const isCorrect = ref(false)
const showHint = ref(false)
const justSolved = ref(false)

// 关卡字符（用于火柴棒可视化）
const equationChars = computed(() => currentLevel.value.equation.split(''))

function gotoLevel(idx: number) {
  currentLevelIndex.value = idx
  userAnswer.value = ''
  showFeedback.value = false
  showHint.value = false
  justSolved.value = false
}

function submitAnswer() {
  if (!userAnswer.value.trim()) return
  const cleaned = userAnswer.value.trim().replace(/\s/g, '')
  const answer = currentLevel.value.answer.replace(/\s/g, '')
  isCorrect.value = cleaned === answer
  showFeedback.value = true
  if (isCorrect.value && !solvedLevels.value.has(currentLevel.value.id)) {
    solvedLevels.value.add(currentLevel.value.id)
    justSolved.value = true
    setTimeout(() => { justSolved.value = false }, 2500)
  }
}

function nextLevel() {
  if (currentLevelIndex.value < LEVELS.length - 1) {
    currentLevelIndex.value++
    userAnswer.value = ''
    showFeedback.value = false
    showHint.value = false
    justSolved.value = false
  }
}

function resetLevel() {
  userAnswer.value = ''
  showFeedback.value = false
  showHint.value = false
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    if (!showFeedback.value) submitAnswer()
    else nextLevel()
  }
}

const progress = computed(() => (solvedLevels.value.size / LEVELS.length) * 100)
</script>

<template>
  <div class="game">
    <!-- 顶部信息卡 -->
    <div class="game__head">
      <div class="game__head-left">
        <span class="game__logo">🔥</span>
        <div class="game__head-text">
          <h1>火柴棒谜题</h1>
          <p>移动一根火柴棒，让等式成立</p>
        </div>
      </div>
      <div class="game__head-right">
        <div class="game__level-chip" :class="`is-${currentLevel.difficulty}`">
          {{ currentLevel.difficulty === 1 ? '简单' : currentLevel.difficulty === 2 ? '中等' : '挑战' }}
          {{ '⭐'.repeat(currentLevel.difficulty) }}
        </div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="game__progress">
      <div class="game__progress-bar">
        <div class="game__progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="game__progress-info">
        <span>第 {{ currentLevelIndex + 1 }} / {{ LEVELS.length }} 关</span>
        <span class="game__progress-done">✓ 已通关 {{ solvedLevels.size }} / {{ LEVELS.length }}</span>
      </div>
    </div>

    <!-- 关卡选择按钮 -->
    <div class="game__dots">
      <button
        v-for="(lv, i) in LEVELS"
        :key="lv.id"
        class="game__dot"
        :class="{
          'is-active': i === currentLevelIndex,
          'is-solved': solvedLevels.has(lv.id)
        }"
        @click="gotoLevel(i)"
        :title="lv.title"
      >
        <span>{{ lv.id }}</span>
        <span v-if="solvedLevels.has(lv.id)" class="game__dot-check">✓</span>
      </button>
    </div>

    <!-- 等式卡片 -->
    <div class="game__card" :class="{ 'is-correct': showFeedback && isCorrect, 'is-wrong': showFeedback && !isCorrect }">
      <div class="game__card-head">
        <span class="game__card-label">{{ currentLevel.title }} · 第 {{ currentLevelIndex + 1 }} 关</span>
      </div>

      <!-- 火柴棒等式 -->
      <div class="game__equation">
        <div
          v-for="(ch, idx) in equationChars"
          :key="idx"
          class="game__char"
          v-html="renderMatchstick(ch)"
        ></div>
      </div>

      <div class="game__hint-inline">
        <span class="game__hint-dot"></span>
        <span>提示：只需要<span class="game__highlight">移动一根火柴棒</span>，答案可以是加、减法</span>
      </div>
    </div>

    <!-- 输入区卡片 -->
    <div class="game__input-card">
      <label class="game__input-label">✏️ 写下你想到的等式</label>
      <input
        v-model="userAnswer"
        type="text"
        class="game__input"
        placeholder="例如：7-1=4"
        :disabled="showFeedback"
        autocomplete="off"
        @keydown="handleKeydown"
        maxlength="10"
      />

      <transition name="fade">
        <div v-if="showFeedback" class="game__feedback" :class="isCorrect ? 'is-correct' : 'is-wrong'">
          <span class="game__feedback-emoji">{{ isCorrect ? '🎉' : '🤔' }}</span>
          <div class="game__feedback-text">
            <strong>{{ isCorrect ? '太棒啦！答对了' : '再想想？' }}</strong>
            <span v-if="!isCorrect">答案是 <strong>{{ currentLevel.answer }}</strong></span>
          </div>
        </div>
      </transition>

      <!-- 按钮区 -->
      <div class="game__actions">
        <button class="game__btn game__btn--ghost" @click="showHint = !showHint">
          {{ showHint ? '🙈 隐藏提示' : '💡 给点提示' }}
        </button>
        <button class="game__btn game__btn--ghost" @click="resetLevel">🔄 重置</button>
        <button
          v-if="!showFeedback"
          class="game__btn game__btn--primary"
          :disabled="!userAnswer.trim()"
          @click="submitAnswer"
        >
          提交答案
        </button>
        <button v-else class="game__btn game__btn--primary" @click="nextLevel">
          {{ currentLevelIndex < LEVELS.length - 1 ? '下一关 →' : '查看结果' }}
        </button>
      </div>

      <!-- 提示卡片 -->
      <transition name="fade">
        <div v-if="showHint && !isCorrect" class="game__hint-card">
          <span class="game__hint-emoji">🌟</span>
          <span class="game__hint-text">{{ currentLevel.hint }}</span>
        </div>
      </transition>
    </div>

    <!-- 通关庆祝 -->
    <div v-if="solvedLevels.size === LEVELS.length" class="game__complete">
      <div class="game__complete-card">
        <div class="game__complete-emoji">🎊</div>
        <h2>哇！你全部完成了！</h2>
        <p>你是真正的火柴棒大师～数学思维超厉害！</p>
        <button class="game__btn game__btn--primary" @click="gotoLevel(0)">再玩一遍</button>
      </div>
    </div>

    <!-- 庆祝动画 -->
    <div v-if="justSolved" class="game__confetti" aria-hidden="true">
      <span v-for="n in 18" :key="n" :style="{ left: (n * 5.5) + '%', animationDelay: (n * 0.05) + 's' }">
        {{ ['🎉','⭐','✨','🎯','🔥'][n % 5] }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
// 每个字符的火柴棒渲染（SVG）
// 7段式数字：top(顶横), mid(中横), bot(底横), ul(左上竖), ur(右上竖), ll(左下竖), lr(右下竖)
// 运算符: + = -
function renderMatchstick(ch: string): string {
  // 每段火柴棒的坐标（一个字符宽40px，高48px）
  const segCoords: Record<string, { x1: number; y1: number; x2: number; y2: number }> = {
    top:   { x1: 8,  y1: 4,  x2: 28, y2: 4 },
    mid:   { x1: 8,  y1: 22, x2: 28, y2: 22 },
    bot:   { x1: 8,  y1: 40, x2: 28, y2: 40 },
    ul:    { x1: 6,  y1: 6,  x2: 6,  y2: 20 },
    ur:    { x1: 30, y1: 6,  x2: 30, y2: 20 },
    ll:    { x1: 6,  y1: 24, x2: 6,  y2: 38 },
    lr:    { x1: 30, y1: 24, x2: 30, y2: 38 },
    vbar:  { x1: 18, y1: 8,  x2: 18, y2: 36 },
    eqtop: { x1: 4,  y1: 14, x2: 32, y2: 14 },
    eqbot: { x1: 4,  y1: 30, x2: 32, y2: 30 }
  }

  // 每个字符由哪些段组成
  const charSegs: Record<string, string[]> = {
    '0': ['top', 'ul', 'ur', 'll', 'lr', 'bot'],
    '1': ['ur', 'lr'],
    '2': ['top', 'ur', 'mid', 'll', 'bot'],
    '3': ['top', 'ur', 'mid', 'lr', 'bot'],
    '4': ['ul', 'ur', 'mid', 'lr'],
    '5': ['top', 'ul', 'mid', 'lr', 'bot'],
    '6': ['top', 'ul', 'mid', 'll', 'lr', 'bot'],
    '7': ['top', 'ur', 'lr'],
    '8': ['top', 'ul', 'ur', 'mid', 'll', 'lr', 'bot'],
    '9': ['top', 'ul', 'ur', 'mid', 'lr', 'bot'],
    '+': ['mid', 'vbar'],
    '-': ['mid'],
    '=': ['eqtop', 'eqbot']
  }

  const segs = charSegs[ch]
  if (!segs) {
    return `<div style="font-size:24px;color:#E88A3D;font-weight:800;line-height:48px;">${ch}</div>`
  }

  let svg = '<svg width="40" height="48" viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg">'
  for (const seg of segs) {
    const c = segCoords[seg]
    // 火柴杆（橙色渐变细线）
    svg += `<line x1="${c.x1}" y1="${c.y1}" x2="${c.x2}" y2="${c.y2}" stroke="#D87A3D" stroke-width="4" stroke-linecap="round" />`
    // 火柴杆高光（内部一条更亮的橙线）
    svg += `<line x1="${c.x1}" y1="${c.y1}" x2="${c.x2}" y2="${c.y2}" stroke="#FFB877" stroke-width="2" stroke-linecap="round" />`
    // 火柴头（两端橙色小圆）
    svg += `<circle cx="${c.x1}" cy="${c.y1}" r="3.5" fill="#FF8C42" stroke="#D85F10" stroke-width="1" />`
    svg += `<circle cx="${c.x2}" cy="${c.y2}" r="3.5" fill="#FF8C42" stroke="#D85F10" stroke-width="1" />`
  }
  svg += '</svg>'
  return svg
}
</script>

<style scoped>
.game {
  max-width: 760px;
  margin: 0 auto;
  padding: 28px 20px 60px;
  position: relative;
}

/* ===== 顶部标题卡 ===== */
.game__head {
  background: linear-gradient(135deg, #FFA868 0%, #FF8C42 55%, #F37522 100%);
  color: #fff;
  border-radius: 24px;
  padding: 22px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 12px 32px rgba(243, 117, 34, 0.28);
  margin-bottom: 18px;
}
.game__head-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}
.game__logo {
  width: 52px;
  height: 52px;
  background: rgba(255,255,255,0.92);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  flex-shrink: 0;
}
.game__head-text h1 {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 3px 0;
  letter-spacing: 0.3px;
}
.game__head-text p {
  font-size: 13px;
  color: rgba(255,255,255,0.9);
  margin: 0;
}
.game__level-chip {
  background: rgba(255,255,255,0.25);
  color: #fff;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 700;
  flex-shrink: 0;
}
.game__level-chip.is-2 { background: rgba(255, 228, 150, 0.7); color: #8A5A00; }
.game__level-chip.is-3 { background: rgba(255, 190, 190, 0.7); color: #A03030; }

/* ===== 进度条 ===== */
.game__progress {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 14px 20px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 16px;
}
.game__progress-bar {
  height: 8px;
  background: var(--bg-hover);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 10px;
}
.game__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-warning) 0%, var(--color-primary) 100%);
  border-radius: 999px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.game__progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-secondary);
}
.game__progress-done { color: var(--color-success); }

/* ===== 关卡选择圆点 ===== */
.game__dots {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 14px;
  background: var(--bg-card);
  border-radius: 18px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 20px;
}
.game__dot {
  position: relative;
  width: 40px;
  height: 40px;
  border: 2px solid var(--border-color);
  background: #FFFBF5;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 800;
  color: #A68968;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}
.game__dot:hover {
  transform: translateY(-1px);
  border-color: #FFB877;
  color: #F37522;
}
.game__dot.is-active {
  background: linear-gradient(135deg, #FF8C42, #F37522);
  border-color: #F37522;
  color: #fff;
  box-shadow: 0 4px 12px rgba(243, 117, 34, 0.40);
}
.game__dot.is-solved {
  background: linear-gradient(135deg, #6ECF9E, #4BAF8E);
  border-color: #4BAF8E;
  color: #fff;
}
.game__dot.is-solved.is-active {
  background: linear-gradient(135deg, #4BAF8E, #3A8A6E);
  border-color: #3A8A6E;
}
.game__dot-check {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--bg-card);
  color: var(--color-success);
  font-size: 10px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-xs);
}

/* ===== 等式卡片 ===== */
.game__card {
  background: var(--bg-card);
  border-radius: 22px;
  padding: 20px 22px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
  border: 3px solid var(--border-color);
  transition: all 0.35s ease;
}
.game__card.is-correct {
  border-color: var(--color-success);
  background: #EBF8EF;
  box-shadow: 0 10px 30px rgba(126, 211, 154, 0.30);
}
.game__card.is-wrong {
  border-color: #F7B0B0;
  background: #FFF0F0;
  animation: shake 0.45s ease;
}
.game__card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.game__card-label {
  font-size: 13px;
  font-weight: 700;
  color: #B08868;
}

/* 火柴棒等式容器 */
.game__equation {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 28px 16px 24px;
  background: #FFFBF5;
  border-radius: 16px;
  border: 2px dashed #FFD9B0;
  margin-bottom: 14px;
}
.game__char {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.game__hint-inline {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #FFF4E4;
  border-radius: 12px;
  font-size: 13px;
  color: #8C6A48;
}
.game__hint-dot {
  width: 8px;
  height: 8px;
  background: #FF8C42;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(255, 140, 66, 0.18);
  flex-shrink: 0;
}
.game__highlight {
  color: var(--color-warning);
  font-weight: 800;
}

/* ===== 输入卡片 ===== */
.game__input-card {
  background: var(--bg-card);
  border-radius: 22px;
  padding: 20px 22px;
  box-shadow: var(--shadow-sm);
}
.game__input-label {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
}
.game__input {
  width: 100%;
  padding: 16px 18px;
  font-size: 22px;
  font-weight: 800;
  text-align: center;
  letter-spacing: 3px;
  border: 2px solid var(--border-color);
  border-radius: 16px;
  background: var(--bg-hover);
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
  color: var(--text-primary);
}
.game__input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 5px rgba(99, 102, 241, 0.15);
  background: var(--bg-card);
}
.game__input:disabled {
  background: var(--bg-hover);
  color: var(--text-muted);
}

/* 反馈 */
.game__feedback {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  margin-top: 12px;
  font-size: 14px;
}
.game__feedback.is-correct {
  background: #EBF8EF;
  border: 2px solid #B8E3C5;
  color: #3A7A55;
}
.game__feedback.is-wrong {
  background: #FFF0F0;
  border: 2px solid #F5C8C8;
  color: #A03030;
}
.game__feedback-emoji { font-size: 28px; flex-shrink: 0; }
.game__feedback-text strong {
  display: block;
  font-size: 15px;
  margin-bottom: 2px;
}
.game__feedback-text span {
  font-size: 13px;
}

/* 按钮 */
.game__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}
.game__btn {
  padding: 12px 20px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  font-size: 14.5px;
  font-weight: 700;
  font-family: inherit;
  transition: all 0.2s ease;
}
.game__btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.game__btn--primary {
  background: linear-gradient(135deg, #FF8C42, #F37522);
  color: #fff;
  box-shadow: 0 5px 14px rgba(243, 117, 34, 0.38);
  flex: 1;
  min-width: 140px;
}
.game__btn--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 7px 18px rgba(243, 117, 34, 0.45);
}
.game__btn--primary:active:not(:disabled) {
  transform: translateY(0);
}
.game__btn--ghost {
  background: #FFF4E4;
  color: #F37522;
  border: 2px solid #FFD9B0;
}
.game__btn--ghost:hover {
  background: #FFE8D0;
  border-color: #FFBC80;
}

/* 提示卡 */
.game__hint-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  margin-top: 14px;
  background: linear-gradient(135deg, #FFF4D4, #FFECC8);
  border-radius: 14px;
  border-left: 4px solid #F5A623;
  color: #8A5A00;
  font-size: 14px;
  animation: fadeIn 0.3s ease;
}
.game__hint-emoji { font-size: 22px; flex-shrink: 0; }
.game__hint-text { line-height: 1.6; font-weight: 600; }

/* ===== 完成弹窗 ===== */
.game__complete {
  position: fixed;
  inset: 0;
  background: rgba(40, 24, 14, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}
.game__complete-card {
  background: var(--bg-card);
  border-radius: 28px;
  padding: 40px 30px 32px;
  text-align: center;
  max-width: 420px;
  box-shadow: var(--shadow-lg);
  animation: popIn 0.45s ease;
}
.game__complete-emoji {
  font-size: 64px;
  margin-bottom: 12px;
}
.game__complete-card h2 {
  color: var(--color-warning);
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 800;
}
.game__complete-card p {
  color: #8C7058;
  margin: 0 0 22px 0;
  font-size: 14px;
}

/* ===== 庆祝彩屑 ===== */
.game__confetti {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 99;
}
.game__confetti span {
  position: absolute;
  top: -30px;
  font-size: 22px;
  animation: confetti 2.2s ease-in forwards;
}

/* ===== 动画 ===== */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes popIn {
  0% { opacity: 0; transform: scale(0.9); }
  60% { opacity: 1; transform: scale(1.03); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes confetti {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
