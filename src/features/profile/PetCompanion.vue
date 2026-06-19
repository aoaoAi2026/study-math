<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

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

const STORAGE_KEY = 'pet-companion-data'

const stageConfig: Record<Stage, { emoji: string; label: string; expMax: number }> = {
  egg:   { emoji: '🥚', label: '蛋',   expMax: 100 },
  baby:  { emoji: '🐣', label: '幼年', expMax: 250 },
  teen:  { emoji: '🐥', label: '少年', expMax: 500 },
  adult: { emoji: '🐔', label: '成年', expMax: 999 },
  master:{ emoji: '🦅', label: '大师', expMax: 999 },
}

const moodEmoji: Record<Mood, string> = {
  happy: '😊', sleepy: '😴', excited: '🤩', sad: '😢', idle: '😐',
}

const moodLabel: Record<Mood, string> = {
  happy: '开心', sleepy: '困了', excited: '兴奋', sad: '难过', idle: '发呆',
}

function defaultPet(): PetState {
  return { name: '小π', stage: 'egg', mood: 'idle', hunger: 60, exp: 0, diary: [] }
}

function loadPet(): PetState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as PetState
  } catch { /* ignore */ }
  return defaultPet()
}

const pet = ref<PetState>(loadPet())

watch(pet, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

const currentStage = computed(() => stageConfig[pet.value.stage])
const expPercent = computed(() => {
  const max = currentStage.value.expMax
  return pet.value.stage === 'master' ? 100 : Math.min((pet.value.exp / max) * 100, 100)
})

function addDiary(action: string, detail: string) {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  pet.value.diary.unshift({
    time: `${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
    action,
    detail,
  })
  if (pet.value.diary.length > 50) pet.value.diary.length = 50
}

function checkLevelUp() {
  const stages: Stage[] = ['egg', 'baby', 'teen', 'adult', 'master']
  const idx = stages.indexOf(pet.value.stage)
  if (idx >= stages.length - 1) return
  const cfg = stageConfig[pet.value.stage]
  if (pet.value.exp >= cfg.expMax) {
    pet.value.stage = stages[idx + 1]
    pet.value.mood = 'excited'
    addDiary('进化', `恭喜！${pet.value.name} 进化到了 ${stageConfig[pet.value.stage].label} 阶段！`)
  }
}

function feed() {
  pet.value.hunger = Math.min(pet.value.hunger + 20, 100)
  pet.value.exp += 10
  pet.value.mood = 'happy'
  addDiary('喂食', '饱食度 +20，经验 +10')
  checkLevelUp()
}

function play() {
  pet.value.hunger = Math.max(pet.value.hunger - 10, 0)
  pet.value.exp += 15
  pet.value.mood = 'excited'
  addDiary('陪玩', '饱食度 -10，经验 +15')
  checkLevelUp()
}

function study() {
  pet.value.hunger = Math.max(pet.value.hunger - 5, 0)
  pet.value.exp += 20
  pet.value.mood = pet.value.hunger < 20 ? 'sleepy' : 'happy'
  addDiary('学习', '饱食度 -5，经验 +20')
  checkLevelUp()
}
</script>

<template>
  <AppLayout>
    <div class="pet-companion">
      <!-- 宠物展示区 -->
      <div class="pet-companion__display">
        <div class="pet-companion__badge">{{ currentStage.label }}</div>
        <div class="pet-companion__avatar">{{ currentStage.emoji }}</div>
        <div class="pet-companion__mood">{{ moodEmoji[pet.mood] }} {{ moodLabel[pet.mood] }}</div>
        <h2 class="pet-companion__name">{{ pet.name }}</h2>
      </div>

      <!-- 属性条 -->
      <div class="pet-companion__stats">
        <div class="pet-companion__stat">
          <span class="pet-companion__label">🍖 饱食度</span>
          <div class="pet-companion__bar">
            <div class="pet-companion__fill" :style="{ width: pet.hunger + '%' }" />
          </div>
          <span class="pet-companion__value">{{ pet.hunger }}</span>
        </div>
        <div class="pet-companion__stat">
          <span class="pet-companion__label">⭐ 经验值</span>
          <div class="pet-companion__bar">
            <div class="pet-companion__fill pet-companion__fill--exp" :style="{ width: expPercent + '%' }" />
          </div>
          <span class="pet-companion__value">{{ pet.exp }}/{{ currentStage.expMax }}</span>
        </div>
      </div>

      <!-- 互动按钮 -->
      <div class="pet-companion__actions">
        <button class="pet-companion__action" @click="feed">🍖 喂食</button>
        <button class="pet-companion__action" @click="play">🎮 陪玩</button>
        <button class="pet-companion__action" @click="study">📖 学习</button>
      </div>

      <!-- 宠物日记 -->
      <div class="pet-companion__diary">
        <h3 class="pet-companion__diary-title">🐾 宠物日记</h3>
        <div v-if="pet.diary.length === 0" class="pet-companion__diary-empty">还没有互动记录，快去和宠物玩吧！</div>
        <ul v-else class="pet-companion__diary-list">
          <li v-for="(entry, i) in pet.diary" :key="i" class="pet-companion__diary-item">
            <span class="pet-companion__diary-time">{{ entry.time }}</span>
            <span class="pet-companion__diary-tag">{{ entry.action }}</span>
            <span class="pet-companion__diary-detail">{{ entry.detail }}</span>
          </li>
        </ul>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.pet-companion {
  max-width: 420px;
  margin: 0 auto;
  text-align: center;
}

.pet-companion__display {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-8) var(--space-6);
  margin-bottom: var(--space-6);
  box-shadow: var(--shadow-md);
}

.pet-companion__badge {
  display: inline-block;
  font-size: var(--text-xs);
  color: var(--color-primary);
  background: var(--bg-hover);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-3);
}

.pet-companion__avatar {
  font-size: 96px;
  line-height: 1.1;
  margin-bottom: var(--space-2);
  transition: transform var(--transition-normal);
}

.pet-companion__avatar:hover {
  transform: scale(1.1);
}

.pet-companion__mood {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-1);
}

.pet-companion__name {
  font-size: var(--text-xl);
  color: var(--text-primary);
  margin: 0;
}

.pet-companion__stats {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-4) var(--space-5);
  margin-bottom: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.pet-companion__stat {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.pet-companion__stat:last-child {
  margin-bottom: 0;
}

.pet-companion__label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  white-space: nowrap;
}

.pet-companion__bar {
  flex: 1;
  height: 8px;
  background: var(--bg-hover);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.pet-companion__fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-normal);
}

.pet-companion__fill--exp {
  background: var(--color-success);
}

.pet-companion__value {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  min-width: 60px;
  text-align: right;
}

.pet-companion__actions {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.pet-companion__action {
  flex: 1;
  padding: var(--space-3) var(--space-4);
  background: var(--color-primary);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast);
}

.pet-companion__action:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.pet-companion__action:active {
  transform: translateY(0);
}

.pet-companion__diary {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
  text-align: left;
}

.pet-companion__diary-title {
  font-size: var(--text-base);
  color: var(--text-primary);
  margin: 0 0 var(--space-3);
}

.pet-companion__diary-empty {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  text-align: center;
  padding: var(--space-4) 0;
}

.pet-companion__diary-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 240px;
  overflow-y: auto;
}

.pet-companion__diary-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--border-color-light);
  font-size: var(--text-sm);
}

.pet-companion__diary-item:last-child {
  border-bottom: none;
}

.pet-companion__diary-time {
  color: var(--text-tertiary);
  white-space: nowrap;
}

.pet-companion__diary-tag {
  color: var(--color-primary);
  font-weight: 600;
  white-space: nowrap;
}

.pet-companion__diary-detail {
  color: var(--text-secondary);
}
</style>
