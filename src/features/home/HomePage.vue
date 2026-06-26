<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useLearningStore } from '@/stores/learningStore'

const router = useRouter()
const userStore = useUserStore()
const learningStore = useLearningStore()

onMounted(() => {
  userStore.init()
  learningStore.init()
})

// 问候语
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return { text: '夜深了', emoji: '🌙' }
  if (h < 11) return { text: '早上好', emoji: '☀️' }
  if (h < 14) return { text: '中午好', emoji: '🍱' }
  if (h < 18) return { text: '下午好', emoji: '🌳' }
  if (h < 21) return { text: '晚上好', emoji: '🌆' }
  return { text: '夜深了', emoji: '🌙' }
})

// 等级信息
const levelInfo = computed(() => {
  const level = userStore.level || 1
  const nextExp = level * 100
  const exp = userStore.experience || 0
  const pct = Math.min(100, Math.round((exp % nextExp) / nextExp * 100))
  return { level, exp, nextExp, pct }
})

// 功能大卡片
const featureCards = [
  {
    to: '/learning',
    title: '知识点学习',
    desc: '1-6年级数学知识点精讲，跟着例题一步步学',
    icon: '📚',
    emoji: '✨',
    tag: '基础',
    color: 'orange',
    rotate: '-1.5deg'
  },
  {
    to: '/question-bank',
    title: '题库练习',
    desc: '147个题库 2700+道题目 随时刷题巩固',
    icon: '📝',
    emoji: '💯',
    tag: '题库',
    color: 'purple',
    rotate: '1deg'
  },
  {
    to: '/games',
    title: '数学小游戏',
    desc: '火柴棒、24点、数独…把数学变成游戏',
    icon: '🎮',
    emoji: '🎲',
    tag: '趣味',
    color: 'pink',
    rotate: '1.2deg'
  },
  {
    to: '/challenge/daily',
    title: '每日挑战',
    desc: '每天3道精选小题，轻松积累数学能力',
    icon: '⚡',
    emoji: '🏆',
    tag: '挑战',
    color: 'yellow',
    rotate: '0.8deg'
  },
  {
    to: '/map',
    title: '知识地图',
    desc: '可视化学习进度，看看你征服了哪些知识岛',
    icon: '🗺️',
    emoji: '🧭',
    tag: '进度',
    color: 'blue',
    rotate: '-1deg'
  },
  {
    to: '/exam',
    title: '考试中心',
    desc: '模拟真实考试，检验学习成果',
    icon: '📋',
    emoji: '🎯',
    tag: '考试',
    color: 'red',
    rotate: '0.5deg'
  }
]

const toolCards = [
  { to: '/parent-dashboard', title: '家长看板', icon: '👨‍👩‍👧', color: 'green' },
  { to: '/diagnosis', title: '能力诊断', icon: '🔍', color: 'purple' },
  { to: '/profile', title: '我的账户', icon: '🦉', color: 'teal' }
]

// 学习数据
const stats = computed(() => [
  { label: '学习天数', value: userStore.checkInDays || 0, icon: '📅', color: 'orange' },
  { label: '答对题数', value: userStore.correctTotal || 0, icon: '✅', color: 'green' },
  { label: '已学知识点', value: (userStore.completedTopics?.length || 0), icon: '📚', color: 'blue' },
  { label: '当前等级', value: 'Lv.' + (userStore.level || 1), icon: '⭐', color: 'yellow' }
])

// 气泡装饰 - 静态，避免 SSR
const bubbles = ref([
  { left: '5%', top: '10%', size: 32, delay: '0s', icon: '🔢' },
  { left: '88%', top: '20%', size: 28, delay: '0.6s', icon: '📐' },
  { left: '12%', top: '70%', size: 24, delay: '1.1s', icon: '➕' },
  { left: '82%', top: '65%', size: 30, delay: '0.3s', icon: '➗' },
  { left: '50%', top: '15%', size: 22, delay: '0.9s', icon: '⭐' },
  { left: '70%', top: '80%', size: 26, delay: '1.4s', icon: '🎈' }
])
</script>

<template>
  <div class="home">
      <!-- 装饰气泡 -->
    <div class="home__bubbles" aria-hidden="true">
      <span
        v-for="(b, idx) in bubbles"
        :key="idx"
        class="home__bubble"
        :style="{ left: b.left, top: b.top, fontSize: b.size + 'px', animationDelay: b.delay }"
      >{{ b.icon }}</span>
    </div>

    <!-- === 英雄欢迎卡 === -->
    <section class="hero">
      <div class="hero__inner">
        <div class="hero__greet">
          <div class="hero__avatar">
            <span>{{ greeting.emoji }}</span>
          </div>
          <div class="hero__text">
            <h1 class="hero__title">
              {{ greeting.text }}，{{ userStore.nickname || '小数学家' }}！
            </h1>
            <p class="hero__subtitle">
              今天也来玩一玩数学吧～ 一点点小进步，会变成大大的惊喜 🎁
            </p>
          </div>
        </div>

        <!-- 等级进度条 -->
        <div class="hero__level">
          <div class="hero__level-info">
            <span class="hero__level-badge">Lv.{{ levelInfo.level }}</span>
            <span class="hero__level-text">{{ levelInfo.exp }} / {{ levelInfo.nextExp }} EXP</span>
          </div>
          <div class="hero__level-bar">
            <div class="hero__level-fill" :style="{ width: levelInfo.pct + '%' }"></div>
          </div>
          <p class="hero__level-hint">再答对几道题就能升级啦～</p>
        </div>
      </div>
    </section>

    <!-- === 学习统计 === -->
    <section class="stats">
      <div
        v-for="(s, idx) in stats"
        :key="s.label"
        class="stat-card"
        :class="`stat-card--${s.color}`"
        :style="{ animationDelay: (idx * 0.08) + 's' }"
      >
        <div class="stat-card__icon">{{ s.icon }}</div>
        <div class="stat-card__body">
          <div class="stat-card__value">{{ s.value }}</div>
          <div class="stat-card__label">{{ s.label }}</div>
        </div>
      </div>
    </section>

    <!-- === 功能大卡片 === -->
    <section class="features">
      <div class="section-head">
        <h2 class="section-head__title">🎯 来挑一个玩吧</h2>
        <p class="section-head__sub">每一个小卡片里都藏着有趣的东西</p>
      </div>

      <div class="feature-grid">
        <router-link
          v-for="(card, idx) in featureCards"
          :key="card.title"
          :to="card.to"
          class="feature-card"
          :class="`feature-card--${card.color}`"
          :style="{ '--delay': (idx * 0.08) + 's', '--rot': card.rotate }"
        >
          <div class="feature-card__tag">{{ card.tag }}</div>
          <div class="feature-card__big-icon">{{ card.icon }}</div>
          <h3 class="feature-card__title">{{ card.title }}</h3>
          <p class="feature-card__desc">{{ card.desc }}</p>
          <div class="feature-card__go">
            <span>去看看</span>
            <span class="feature-card__arrow">→</span>
          </div>
          <div class="feature-card__deco">{{ card.emoji }}</div>
        </router-link>
      </div>
    </section>

    <!-- === 工具卡片 === -->
    <section class="tools">
      <div class="section-head">
        <h2 class="section-head__title">🧰 实用工具</h2>
        <p class="section-head__sub">帮助你和家长一起记录学习</p>
      </div>
      <div class="tool-grid">
        <router-link
          v-for="t in toolCards"
          :key="t.title"
          :to="t.to"
          class="tool-card"
          :class="`tool-card--${t.color}`"
        >
          <span class="tool-card__icon">{{ t.icon }}</span>
          <span class="tool-card__title">{{ t.title }}</span>
          <span class="tool-card__arrow">›</span>
        </router-link>
      </div>
    </section>

    <div class="home__foot">
      <p>💡 每天一点点，数学就会慢慢变成你的好朋友～</p>
    </div>
    </div>
</template>

<style scoped>
.home {
  position: relative;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 24px 18px 60px;
  overflow: hidden;
}

/* --------- 浮动气泡 --------- */
.home__bubbles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.home__bubble {
  position: absolute;
  opacity: 0.35;
  animation: float 4s ease-in-out infinite;
  user-select: none;
}

/* --------- 英雄卡 --------- */
.hero {
  position: relative;
  z-index: 1;
  margin-bottom: 24px;
}
.hero__inner {
  background: linear-gradient(135deg, #FFB37A 0%, #FF8C42 60%, #F37522 100%);
  color: #fff;
  border-radius: var(--border-radius-xl);
  padding: 28px 24px;
  box-shadow: 0 14px 36px rgba(243, 117, 34, 0.28);
  position: relative;
  overflow: hidden;
}
.hero__inner::before {
  content: '';
  position: absolute;
  right: -40px;
  top: -40px;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 50%;
}
.hero__inner::after {
  content: '';
  position: absolute;
  left: -30px;
  bottom: -60px;
  width: 160px;
  height: 160px;
  background: rgba(255, 255, 255, 0.10);
  border-radius: 50%;
}

.hero__greet {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
  position: relative;
  z-index: 1;
}
.hero__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  animation: float 3s ease-in-out infinite;
  flex-shrink: 0;
}
.hero__text { flex: 1; min-width: 0; }
.hero__title {
  color: #fff;
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}
.hero__subtitle {
  color: rgba(255, 255, 255, 0.92);
  font-size: 14px;
  line-height: 1.55;
}

.hero__level {
  background: rgba(255, 255, 255, 0.18);
  border-radius: var(--border-radius-lg);
  padding: 14px 16px;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(4px);
}
.hero__level-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.hero__level-badge {
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-primary-dark);
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 13px;
}
.hero__level-text {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 600;
}
.hero__level-bar {
  height: 10px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  overflow: hidden;
}
.hero__level-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFE45C, #fff);
  border-radius: 999px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.hero__level-hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.88);
  margin-top: 8px;
  text-align: center;
}

/* --------- 统计卡片 --------- */
.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 28px;
  position: relative;
  z-index: 1;
}
.stat-card {
  background: var(--bg-card);
  border-radius: var(--border-radius-lg);
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow-card);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  animation: fadeIn 0.4s ease both;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}
.stat-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.stat-card--orange .stat-card__icon { background: var(--card-orange-bg); }
.stat-card--green .stat-card__icon { background: var(--card-green-bg); }
.stat-card--blue .stat-card__icon { background: var(--card-blue-bg); }
.stat-card--yellow .stat-card__icon { background: var(--card-yellow-bg); }

.stat-card__value {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
}
.stat-card__label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

@media (min-width: 768px) {
  .stats { grid-template-columns: repeat(4, 1fr); }
}

/* --------- 章节标题 --------- */
.section-head {
  margin-bottom: 18px;
  position: relative;
  z-index: 1;
}
.section-head__title {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 4px;
}
.section-head__sub {
  font-size: 13px;
  color: var(--text-secondary);
}

/* --------- 功能卡片 --------- */
.features { margin-bottom: 28px; position: relative; z-index: 1; }
.feature-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}
.feature-card {
  position: relative;
  background: var(--bg-card);
  border-radius: var(--border-radius-xl);
  padding: 22px 22px 20px;
  box-shadow: var(--shadow-card);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  text-decoration: none;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 170px;
  border: 2px solid transparent;
  animation: fadeIn 0.5s ease both;
  animation-delay: var(--delay, 0s);
}
.feature-card:hover {
  transform: translateY(-4px) rotate(0deg) !important;
  box-shadow: var(--shadow-card-hover);
}
.feature-card__tag {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  z-index: 2;
}
.feature-card__big-icon {
  font-size: 42px;
  margin-bottom: 10px;
  line-height: 1;
}
.feature-card__title {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 6px;
}
.feature-card__desc {
  font-size: 13.5px;
  color: var(--text-secondary);
  line-height: 1.55;
  flex: 1;
}
.feature-card__go {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  font-weight: 700;
  font-size: 14px;
  padding: 8px 14px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: var(--border-radius-pill);
  width: fit-content;
  transition: background var(--transition-fast);
}
.feature-card__arrow {
  transition: transform var(--transition-fast);
  font-size: 16px;
}
.feature-card:hover .feature-card__go { background: rgba(0, 0, 0, 0.08); }
.feature-card:hover .feature-card__arrow { transform: translateX(4px); }

.feature-card__deco {
  position: absolute;
  right: -6px;
  bottom: -10px;
  font-size: 110px;
  opacity: 0.08;
  line-height: 1;
  pointer-events: none;
  transform: rotate(-10deg);
}

/* 彩色变体 */
.feature-card--orange {
  background: linear-gradient(140deg, var(--card-orange-bg) 0%, var(--bg-card) 60%);
  border-color: var(--card-orange-bg);
}
.feature-card--orange .feature-card__title { color: var(--card-orange-text); }
.feature-card--orange .feature-card__go { background: var(--card-orange-bg); color: var(--card-orange-text); }

.feature-card--pink {
  background: linear-gradient(140deg, var(--card-pink-bg) 0%, var(--bg-card) 60%);
  border-color: var(--card-pink-bg);
}
.feature-card--pink .feature-card__title { color: var(--card-pink-text); }
.feature-card--pink .feature-card__go { background: var(--card-pink-bg); color: var(--card-pink-text); }

.feature-card--yellow {
  background: linear-gradient(140deg, var(--card-yellow-bg) 0%, var(--bg-card) 60%);
  border-color: var(--card-yellow-bg);
}
.feature-card--yellow .feature-card__title { color: var(--card-yellow-text); }
.feature-card--yellow .feature-card__go { background: var(--card-yellow-bg); color: var(--card-yellow-text); }

.feature-card--blue {
  background: linear-gradient(140deg, var(--card-blue-bg) 0%, var(--bg-card) 60%);
  border-color: var(--card-blue-bg);
}
.feature-card--blue .feature-card__title { color: var(--card-blue-text); }
.feature-card--blue .feature-card__go { background: var(--card-blue-bg); color: var(--card-blue-text); }

@media (min-width: 700px) {
  .feature-grid { grid-template-columns: 1fr 1fr; }
}

/* --------- 工具卡片 --------- */
.tools { margin-bottom: 28px; position: relative; z-index: 1; }
.tool-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.tool-card {
  background: var(--bg-card);
  border-radius: var(--border-radius-lg);
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  position: relative;
}
.tool-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.tool-card__icon {
  font-size: 26px;
  width: 54px;
  height: 54px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tool-card__title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}
.tool-card__arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: var(--text-muted);
}

.tool-card--green .tool-card__icon { background: var(--card-green-bg); }
.tool-card--purple .tool-card__icon { background: var(--card-purple-bg); }
.tool-card--teal .tool-card__icon { background: var(--card-teal-bg); }

@media (min-width: 600px) {
  .tool-grid { grid-template-columns: repeat(6, 1fr); }
}

.home__foot {
  text-align: center;
  color: var(--text-secondary);
  font-size: 13px;
  padding: 16px;
  position: relative;
  z-index: 1;
}
</style>
