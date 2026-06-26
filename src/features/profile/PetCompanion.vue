<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'

type Stage = 'egg' | 'baby' | 'teen' | 'adult' | 'master'
type Mood = 'happy' | 'sleepy' | 'excited' | 'sad' | 'idle'

interface DiaryEntry {
  time: string
  action: string
  detail: string
}

interface PetState {
  name: string
  stage: Stage
  mood: Mood
  hunger: number
  exp: number
  diary: DiaryEntry[]
}

const STORAGE_KEY = 'pet-companion-data-v2'

const stageConfig: Record<Stage, { emoji: string; label: string; expMax: number; hungerDecay: number }> = {
  egg:   { emoji: '🥚', label: '蛋蛋期', expMax: 50, hungerDecay: 0 },
  baby:  { emoji: '🐣', label: '幼年', expMax: 150, hungerDecay: 2 },
  teen:  { emoji: '🐥', label: '少年', expMax: 300, hungerDecay: 3 },
  adult: { emoji: '🐔', label: '成年', expMax: 600, hungerDecay: 4 },
  master:{ emoji: '🦅', label: '大师', expMax: 9999, hungerDecay: 1 },
}

const moodEmoji: Record<Mood, string> = {
  happy: '😊', sleepy: '😴', excited: '🤩', sad: '😢', idle: '😐',
}

const moodLabel: Record<Mood, string> = {
  happy: '开心', sleepy: '困了', excited: '兴奋', sad: '难过', idle: '发呆',
}

const userStore = useUserStore()

function defaultPet(): PetState {
  return {
    name: '小π',
    stage: 'egg',
    mood: 'idle',
    hunger: 80,
    exp: 0,
    diary: [{
      time: formatTime(new Date()),
      action: '诞生',
      detail: '你好！我是小π，让我们一起学习数学吧！'
    }]
  }
}

function loadPet(): PetState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as PetState
      // 饥饿值随时间衰减
      const now = Date.now()
      const lastSave = parsed.diary?.[0]?.time ? new Date(parsed.diary[0].time).getTime() : now
      const hours = Math.max(0, (now - lastSave) / (1000 * 60 * 60))
      if (hours > 0) {
        const cfg = stageConfig[parsed.stage]
        parsed.hunger = Math.max(0, parsed.hunger - hours * cfg.hungerDecay)
      }
      return parsed
    }
  } catch { /* ignore */ }
  return defaultPet()
}

const pet = ref<PetState>(loadPet())

// 跟踪 userStore 的经验值变化
watch(() => userStore.experience, (newVal, oldVal) => {
  if (newVal > (oldVal || 0)) {
    const gain = newVal - (oldVal || 0)
    pet.value.exp += gain
    pet.value.mood = 'excited'
    addDiary('学习', `学习获得了 ${gain} 经验值！`)
    checkLevelUp()
  }
}, { immediate: true })

watch(pet, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

const currentStage = computed(() => stageConfig[pet.value.stage])
const stageProgressPct = computed(() => {
  if (pet.value.stage === 'master') return 100
  return Math.min(Math.round((pet.value.exp / currentStage.value.expMax) * 100), 100)
})
const nextStage = computed(() => {
  const stages: Stage[] = ['egg', 'baby', 'teen', 'adult', 'master']
  const idx = stages.indexOf(pet.value.stage)
  if (idx >= stages.length - 1) return null
  return stages[idx + 1]
})
const expToNext = computed(() => {
  if (pet.value.stage === 'master') return 0
  return currentStage.value.expMax - pet.value.exp
})

function formatTime(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function addDiary(action: string, detail: string) {
  pet.value.diary.unshift({
    time: formatTime(new Date()),
    action,
    detail,
  })
  if (pet.value.diary.length > 20) pet.value.diary.length = 20
}

function checkLevelUp() {
  if (pet.value.stage === 'master') return
  if (pet.value.exp >= currentStage.value.expMax) {
    const stages: Stage[] = ['egg', 'baby', 'teen', 'adult', 'master']
    const idx = stages.indexOf(pet.value.stage)
    pet.value.stage = stages[idx + 1]
    pet.value.mood = 'excited'
    const newStage = stageConfig[pet.value.stage]
    addDiary('进化', `恭喜！${pet.value.name} 进化到了 ${newStage.label}（${newStage.emoji}）！`)
    pet.value.hunger = Math.min(pet.value.hunger + 10, 100)
    userStore.addBadges('pet-' + pet.value.stage)
  }
}

function feed() {
  pet.value.hunger = Math.min(pet.value.hunger + 25, 100)
  pet.value.exp += 5
  pet.value.mood = 'happy'
  addDiary('喂食', `饱食度 +25，心情变好啦！`)
  checkLevelUp()
}

function play() {
  pet.value.hunger = Math.max(pet.value.hunger - 10, 0)
  pet.value.exp += 15
  pet.value.mood = 'excited'
  addDiary('陪玩', `一起玩耍真开心，经验 +15！`)
  checkLevelUp()
}

function study() {
  pet.value.hunger = Math.max(pet.value.hunger - 5, 0)
  pet.value.exp += 25
  pet.value.mood = pet.value.hunger < 20 ? 'sleepy' : 'happy'
  addDiary('学习', `认真学习中，经验 +25！`)
  checkLevelUp()
}

function rest() {
  pet.value.hunger = Math.max(pet.value.hunger - 3, 0)
  pet.value.mood = 'sleepy'
  addDiary('休息', `休息一下，恢复精力~`)
}

function rename(newName: string) {
  if (newName.trim() && newName.trim() !== pet.value.name) {
    const oldName = pet.value.name
    pet.value.name = newName.trim()
    addDiary('改名', `名字从 "${oldName}" 改为 "${pet.value.name}"`)
  }
}

// 用户统计
const userStats = computed(() => ({
  totalExp: userStore.experience,
  correctTotal: userStore.correctTotal || 0,
  wrongTotal: userStore.wrongTotal || 0,
  completedTopics: userStore.completedTopics?.length || 0,
  badges: userStore.badges?.length || 0,
  daysSinceCreate: userStore.createdAt
    ? Math.floor((Date.now() - new Date(userStore.createdAt).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 1,
}))

onMounted(() => {
  userStore.init()
  // 初始化 pet 经验
  if (pet.value.exp === 0 && userStore.experience > 0) {
    pet.value.exp = Math.floor(userStore.experience / 2)
  }
})
</script>

<template>
  <div class="pc">
    <header class="pc-header">
      <h1 class="pc-title">🐾 学习宠物</h1>
      <p class="pc-subtitle">你的学习伙伴，每次进步都会让它成长</p>
    </header>

    <div class="pc-main">
      <!-- 宠物展示 -->
      <div class="pc-display">
        <div class="pc-stage-label">
          {{ currentStage.label }}
          <span v-if="nextStage" class="pc-next-stage">→ {{ stageConfig[nextStage].label }}</span>
        </div>

        <div class="pc-avatar-wrap">
          <div class="pc-avatar" :class="{ 'pc-avatar--excited': pet.mood === 'excited' }">
            {{ currentStage.emoji }}
          </div>
          <div class="pc-mood">{{ moodEmoji[pet.mood] }} {{ moodLabel[pet.mood] }}</div>
        </div>

        <h2 class="pc-name">{{ pet.name }}</h2>

        <div class="pc-stats">
          <div class="pc-stat">
            <span class="pc-stat-label">⭐ 成长经验</span>
            <div class="pc-stat-bar">
              <div class="pc-stat-fill pc-stat-fill--exp" :style="{ width: stageProgressPct + '%' }"></div>
            </div>
            <span class="pc-stat-value">
              {{ pet.exp }} / {{ currentStage.expMax }}
            </span>
          </div>
          <div class="pc-stat">
            <span class="pc-stat-label">🍖 饱食度</span>
            <div class="pc-stat-bar">
              <div class="pc-stat-fill" :style="{ width: pet.hunger + '%' }" :class="{
                'pc-stat-fill--low': pet.hunger < 30,
                'pc-stat-fill--warn': pet.hunger >= 30 && pet.hunger < 60
              }"></div>
            </div>
            <span class="pc-stat-value">{{ pet.hunger }}%</span>
          </div>
        </div>

        <!-- 互动按钮 -->
        <div class="pc-actions">
          <button class="pc-action pc-action--feed" @click="feed">
            <span class="pc-action-icon">🍖</span>
            <span class="pc-action-label">喂食</span>
            <span class="pc-action-effect">+25 饱食 +5 经验</span>
          </button>
          <button class="pc-action pc-action--play" @click="play">
            <span class="pc-action-icon">🎮</span>
            <span class="pc-action-label">陪玩</span>
            <span class="pc-action-effect">+15 经验 -10 饱食</span>
          </button>
          <button class="pc-action pc-action--study" @click="study">
            <span class="pc-action-icon">📚</span>
            <span class="pc-action-label">学习</span>
            <span class="pc-action-effect">+25 经验 -5 饱食</span>
          </button>
          <button class="pc-action pc-action--rest" @click="rest">
            <span class="pc-action-icon">😴</span>
            <span class="pc-action-label">休息</span>
            <span class="pc-action-effect">恢复心情</span>
          </button>
        </div>
      </div>

      <!-- 成就与统计 -->
      <div class="pc-achievements">
        <h3 class="pc-section-title">📊 学习统计</h3>
        <div class="pc-user-stats">
          <div class="pc-user-stat">
            <span class="pc-user-stat-value">{{ userStats.totalExp }}</span>
            <span class="pc-user-stat-label">总经验</span>
          </div>
          <div class="pc-user-stat">
            <span class="pc-user-stat-value pc-user-stat-value--green">{{ userStats.correctTotal }}</span>
            <span class="pc-user-stat-label">答对题数</span>
          </div>
          <div class="pc-user-stat">
            <span class="pc-user-stat-value pc-user-stat-value--red">{{ userStats.wrongTotal }}</span>
            <span class="pc-user-stat-label">答错题数</span>
          </div>
          <div class="pc-user-stat">
            <span class="pc-user-stat-value">{{ userStats.completedTopics }}</span>
            <span class="pc-user-stat-label">掌握专题</span>
          </div>
          <div class="pc-user-stat">
            <span class="pc-user-stat-value">{{ userStats.daysSinceCreate }}</span>
            <span class="pc-user-stat-label">学习天数</span>
          </div>
          <div class="pc-user-stat">
            <span class="pc-user-stat-value pc-user-stat-value--yellow">{{ userStats.badges }}</span>
            <span class="pc-user-stat-label">获得徽章</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 日记 -->
    <div class="pc-diary">
      <h3 class="pc-section-title">📖 成长日记</h3>
      <div v-if="pet.diary.length === 0" class="pc-diary-empty">
        还没有互动记录，快去和你的宠物玩耍吧！
      </div>
      <ul v-else class="pc-diary-list">
        <li v-for="(entry, i) in pet.diary" :key="i" class="pc-diary-item">
          <span class="pc-diary-time">{{ entry.time }}</span>
          <span class="pc-diary-tag">{{ entry.action }}</span>
          <span class="pc-diary-detail">{{ entry.detail }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.pc { max-width: 1100px; margin: 0 auto; padding: var(--space-4); }

.pc-header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.pc-title {
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin: 0 0 var(--space-1);
}

.pc-subtitle {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin: 0;
}

.pc-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  margin-bottom: var(--space-6);
}

/* 宠物展示 */
.pc-display {
  background: var(--bg-card);
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  text-align: center;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

.pc-stage-label {
  display: inline-block;
  font-size: var(--text-sm);
  color: var(--color-primary);
  background: rgba(99, 102, 241, 0.1);
  padding: var(--space-1) var(--space-4);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-4);
  font-weight: 600;
}

.pc-next-stage {
  color: var(--text-tertiary);
  font-size: var(--text-xs);
  font-weight: 400;
}

.pc-avatar-wrap {
  padding: var(--space-4) 0;
}

.pc-avatar {
  font-size: 120px;
  line-height: 1;
  margin-bottom: var(--space-2);
  animation: float 3s ease-in-out infinite;
  display: inline-block;
}

.pc-avatar--excited {
  animation: bounce 0.5s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

.pc-mood {
  font-size: var(--text-base);
  color: var(--text-secondary);
}

.pc-name {
  font-size: var(--text-xl);
  color: var(--text-primary);
  font-weight: 700;
  margin: var(--space-3) 0 var(--space-4);
}

.pc-stats {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.pc-stat {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.pc-stat-label {
  min-width: 90px;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

.pc-stat-bar {
  flex: 1;
  height: 8px;
  background: var(--bg-hover);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.pc-stat-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-normal);
}

.pc-stat-fill--exp { background: linear-gradient(90deg, var(--color-warning), var(--color-warning-dark)); }
.pc-stat-fill--low { background: var(--color-error); }
.pc-stat-fill--warn { background: var(--color-warning); }

.pc-stat-value {
  min-width: 80px;
  text-align: right;
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-weight: 600;
}

/* 互动按钮 */
.pc-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.pc-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-4) var(--space-3);
  background: var(--bg-hover);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--text-primary);
}

.pc-action:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary-light);
  background: var(--bg-card);
}

.pc-action-icon {
  font-size: 28px;
}

.pc-action-label {
  font-weight: 600;
  font-size: var(--text-base);
}

.pc-action-effect {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.pc-action--feed:hover { border-color: var(--color-success); }
.pc-action--play:hover { border-color: var(--color-info); }
.pc-action--study:hover { border-color: var(--color-primary); }
.pc-action--rest:hover { border-color: var(--color-warning); }

/* 成就 */
.pc-achievements {
  background: var(--bg-card);
  border-radius: var(--radius-2xl);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.pc-section-title {
  font-size: var(--text-lg);
  color: var(--text-primary);
  margin: 0 0 var(--space-4);
  font-weight: 600;
}

.pc-user-stats {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--space-3);
}

.pc-user-stat {
  background: var(--bg-hover);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  text-align: center;
}

.pc-user-stat-value {
  display: block;
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--space-1);
}

.pc-user-stat-label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.pc-user-stat-value--green { color: var(--color-success); }
.pc-user-stat-value--red { color: var(--color-error); }
.pc-user-stat-value--yellow { color: var(--color-warning); }

/* 日记 */
.pc-diary {
  background: var(--bg-card);
  border-radius: var(--radius-2xl);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.pc-diary-empty {
  text-align: center;
  color: var(--text-tertiary);
  padding: var(--space-8) 0;
}

.pc-diary-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 500px;
  overflow-y: auto;
}

.pc-diary-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-2);
  border-bottom: 1px solid var(--border-color-light);
  font-size: var(--text-sm);
}

.pc-diary-item:last-child { border-bottom: none; }

.pc-diary-time {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  min-width: 110px;
}

.pc-diary-tag {
  background: var(--color-primary);
  color: var(--text-inverse);
  padding: 2px var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 500;
  min-width: 40px;
  text-align: center;
}

.pc-diary-detail {
  color: var(--text-primary);
  flex: 1;
}

@media (max-width: 768px) {
  .pc-main { grid-template-columns: 1fr; }
  .pc-user-stats { grid-template-columns: repeat(3, 1fr); }
}
</style>
