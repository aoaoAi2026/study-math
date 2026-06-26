<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  getWrongItems,
  markReviewed,
  clearReviewedItems,
  getWrongStats,
  type WrongItem
} from '@/services/wrongBookStore'

const wrongBook = ref<WrongItem[]>([])
const activeFilter = ref<string>('all')

function reload() {
  wrongBook.value = getWrongItems()
}

onMounted(() => {
  reload()
})

const layerLabels: Record<string, string> = {
  all: '全部',
  L1: 'L1 审题',
  L2: 'L2 概念',
  L3: 'L3 计算',
  L4: 'L4 思维'
}

const layerInfo: Record<string, { emoji: string; text: string; color: string; textColor: string; bg: string }> = {
  L1: { emoji: '👀', text: '没看清题目', color: 'blue', textColor: '#3A6AC4', bg: '#E8F0FF' },
  L2: { emoji: '💡', text: '概念记错了', color: 'yellow', textColor: '#C98A10', bg: '#FFF8E1' },
  L3: { emoji: '🧮', text: '计算出问题', color: 'pink', textColor: '#C7417F', bg: '#FFEEF4' },
  L4: { emoji: '🧠', text: '思路卡壳了', color: 'purple', textColor: '#7849B8', bg: '#F3ECFF' }
}

const filtered = computed(() => {
  const list = activeFilter.value === 'all'
    ? wrongBook.value
    : wrongBook.value.filter(i => i.errorLayer === activeFilter.value)
  const groups: Record<string, WrongItem[]> = {}
  list.forEach(item => {
    if (!groups[item.knowledgeName]) groups[item.knowledgeName] = []
    groups[item.knowledgeName].push(item)
  })
  return groups
})

const filteredCount = computed(() => Object.values(filtered.value).flat().length)

const stats = computed(() => {
  const s = getWrongStats()
  return {
    total: s.total,
    L1: s.L1,
    L2: s.L2,
    L3: s.L3,
    L4: s.L4
  }
})

function review(id: string) {
  markReviewed(id)
  reload()
}

function clearReviewed() {
  clearReviewedItems()
  reload()
}

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  return `${days}天前`
}
</script>

<template>
  <div class="wrong-book">

    <!-- 顶部标题卡 -->
    <section class="wb-hero">
      <div class="wb-hero__inner">
        <div class="wb-hero__icon">📝</div>
        <div class="wb-hero__text">
          <h1 class="wb-hero__title">错题本</h1>
          <p class="wb-hero__subtitle">
            不怕错，怕不错过～ 把这些小题目搞定，你就更厉害啦！
          </p>
        </div>
        <div class="wb-hero__badge">
          <span class="wb-hero__badge-num">{{ stats.total }}</span>
          <span class="wb-hero__badge-text">道题</span>
        </div>
      </div>
    </section>

    <!-- 统计概览卡片 -->
    <section class="wb-stats">
      <div class="wb-stat wb-stat--orange" :style="{ animationDelay: '0s' }">
        <div class="wb-stat__icon">📋</div>
        <div class="wb-stat__body">
          <div class="wb-stat__value">{{ stats.total }}</div>
          <div class="wb-stat__label">总错题</div>
        </div>
      </div>
      <div class="wb-stat wb-stat--blue" :style="{ animationDelay: '0.08s' }">
        <div class="wb-stat__icon">👀</div>
        <div class="wb-stat__body">
          <div class="wb-stat__value">{{ stats.L1 }}</div>
          <div class="wb-stat__label">L1 审题</div>
        </div>
      </div>
      <div class="wb-stat wb-stat--yellow" :style="{ animationDelay: '0.16s' }">
        <div class="wb-stat__icon">💡</div>
        <div class="wb-stat__body">
          <div class="wb-stat__value">{{ stats.L2 }}</div>
          <div class="wb-stat__label">L2 概念</div>
        </div>
      </div>
      <div class="wb-stat wb-stat--pink" :style="{ animationDelay: '0.24s' }">
        <div class="wb-stat__icon">🧮</div>
        <div class="wb-stat__body">
          <div class="wb-stat__value">{{ stats.L3 }}</div>
          <div class="wb-stat__label">L3 计算</div>
        </div>
      </div>
      <div class="wb-stat wb-stat--purple" :style="{ animationDelay: '0.32s' }">
        <div class="wb-stat__icon">🧠</div>
        <div class="wb-stat__body">
          <div class="wb-stat__value">{{ stats.L4 }}</div>
          <div class="wb-stat__label">L4 思维</div>
        </div>
      </div>
    </section>

    <!-- 筛选胶囊 -->
    <section class="wb-filters">
      <button
        v-for="(label, key) in layerLabels"
        :key="key"
        class="wb-filter"
        :class="{ 'wb-filter--active': activeFilter === key }"
        @click="activeFilter = key"
      >{{ label }}</button>
    </section>

    <!-- 操作栏 -->
    <section class="wb-actions">
      <span class="wb-actions__count">
        <span class="wb-actions__count-icon">📚</span>
        共 <strong>{{ filteredCount }}</strong> 道错题
      </span>
      <button v-if="wrongBook.some(i => i.reviewed)" class="wb-actions__clear" @click="clearReviewed">
        🧹 清除已掌握
      </button>
    </section>

    <!-- 按知识点分组 -->
    <section v-for="(items, groupName) in filtered" :key="groupName" class="wb-group">
      <div class="wb-group__head">
        <span class="wb-group__emoji">📖</span>
        <h3 class="wb-group__title">{{ groupName }}</h3>
        <span class="wb-group__count">{{ items.length }} 道</span>
      </div>

      <div class="wb-list">
        <div
          v-for="(item, idx) in items"
          :key="item.id"
          class="wb-item"
          :class="{ 'wb-item--reviewed': item.reviewed }"
          :style="{ animationDelay: (idx * 0.06) + 's' }"
        >
          <!-- 题目 -->
          <div class="wb-item__q">
            <span class="wb-item__q-num">题目</span>
            <p class="wb-item__q-text">{{ item.stem }}</p>
          </div>

          <!-- 答案对比 -->
          <div class="wb-item__answers">
            <div class="wb-item__ans wb-item__ans--wrong">
              <div class="wb-item__ans-head">
                <span class="wb-item__ans-icon">❌</span>
                <span class="wb-item__ans-label">你的答案</span>
              </div>
              <p class="wb-item__ans-text">{{ item.userAnswer }}</p>
            </div>
            <div class="wb-item__ans wb-item__ans--correct">
              <div class="wb-item__ans-head">
                <span class="wb-item__ans-icon">✅</span>
                <span class="wb-item__ans-label">正确答案</span>
              </div>
              <p class="wb-item__ans-text">{{ item.correctAnswer }}</p>
            </div>
          </div>

          <!-- 底部信息 -->
          <div class="wb-item__foot">
            <div class="wb-item__tags">
              <span
                class="wb-item__layer"
                :style="{ background: layerInfo[item.errorLayer].bg, color: layerInfo[item.errorLayer].textColor }"
              >
                {{ layerInfo[item.errorLayer].emoji }} {{ item.errorLayer }}
              </span>
              <span v-if="item.reviewCount > 0" class="wb-item__reviewed">
                已复习 {{ item.reviewCount }} 次
              </span>
              <span class="wb-item__time">{{ formatTime(item.timestamp) }}</span>
            </div>
            <button class="wb-item__btn" @click="review(item.id)">
              {{ item.reviewed ? '再看一遍' : '我来复习' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 空状态 -->
    <div v-if="filteredCount === 0" class="wb-empty">
      <div class="wb-empty__icon">🎉</div>
      <div class="wb-empty__title">
        {{ activeFilter === 'all' ? '暂无错题记录' : '这一类没有错题啦' }}
      </div>
      <div class="wb-empty__sub">
        {{ activeFilter === 'all' ? '继续加油，遇到错题会自动记录在这里' : '换一个分类看看吧' }}
      </div>
    </div>

  </div>
</template>

<style scoped>
.wrong-book {
  position: relative;
  max-width: var(--content-max-width, 900px);
  margin: 0 auto;
  padding: 24px 18px 60px;
}

/* --------- 顶部标题卡 --------- */
.wb-hero {
  margin-bottom: 24px;
}
.wb-hero__inner {
  background: linear-gradient(135deg, #FF8C6B 0%, #F06292 55%, #CE93D8 100%);
  color: #fff;
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 14px 36px rgba(240, 98, 146, 0.28);
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
}
.wb-hero__inner::before {
  content: '';
  position: absolute;
  right: -40px;
  top: -40px;
  width: 180px;
  height: 180px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 50%;
}
.wb-hero__icon {
  width: 60px;
  height: 60px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  animation: float 3s ease-in-out infinite;
}
.wb-hero__text {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}
.wb-hero__title {
  color: #fff;
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}
.wb-hero__subtitle {
  color: rgba(255, 255, 255, 0.92);
  font-size: 13.5px;
  line-height: 1.55;
  margin: 0;
}
.wb-hero__badge {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 18px;
  padding: 10px 16px;
  text-align: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}
.wb-hero__badge-num {
  display: block;
  font-size: 22px;
  font-weight: 800;
  color: #CE5A92;
  line-height: 1;
}
.wb-hero__badge-text {
  font-size: 11px;
  color: #B47A9E;
  margin-top: 4px;
}

/* --------- 统计卡片 --------- */
.wb-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 24px;
}
.wb-stat {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 14px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.25s ease;
  animation: fadeIn 0.4s ease both;
  border: 2px solid transparent;
}
.wb-stat:hover { transform: translateY(-2px); }
.wb-stat__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.wb-stat__value {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.1;
}
.wb-stat__label {
  font-size: 11.5px;
  color: var(--text-secondary);
  margin-top: 3px;
}
.wb-stat--orange { border-color: var(--card-orange-bg); }
.wb-stat--orange .wb-stat__icon { background: var(--card-orange-bg); }
.wb-stat--orange .wb-stat__value { color: var(--card-orange-text); }

.wb-stat--blue { border-color: var(--card-blue-bg); }
.wb-stat--blue .wb-stat__icon { background: var(--card-blue-bg); }
.wb-stat--blue .wb-stat__value { color: var(--card-blue-text); }

.wb-stat--yellow { border-color: var(--card-yellow-bg); }
.wb-stat--yellow .wb-stat__icon { background: var(--card-yellow-bg); }
.wb-stat--yellow .wb-stat__value { color: var(--card-yellow-text); }

.wb-stat--pink { border-color: var(--card-pink-bg); }
.wb-stat--pink .wb-stat__icon { background: var(--card-pink-bg); }
.wb-stat--pink .wb-stat__value { color: var(--card-pink-text); }

.wb-stat--purple { border-color: var(--card-purple-bg); }
.wb-stat--purple .wb-stat__icon { background: var(--card-purple-bg); }
.wb-stat--purple .wb-stat__value { color: var(--card-purple-text); }

@media (min-width: 700px) {
  .wb-stats { grid-template-columns: repeat(5, 1fr); }
}

/* --------- 筛选胶囊 --------- */
.wb-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}
.wb-filter {
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 2px solid var(--border-color);
  transition: all 0.2s ease;
  cursor: pointer;
}
.wb-filter:hover {
  border-color: var(--color-warning);
  color: var(--color-warning);
}
.wb-filter--active {
  background: linear-gradient(135deg, var(--color-warning) 0%, var(--color-danger) 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: var(--shadow-primary);
}

/* --------- 操作栏 --------- */
.wb-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 2px;
}
.wb-actions__count {
  font-size: 13px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
}
.wb-actions__count-icon { font-size: 15px; }
.wb-actions__count strong {
  color: var(--text-primary);
  font-weight: 700;
  margin: 0 2px;
}
.wb-actions__clear {
  padding: 8px 14px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--card-pink-text);
  background: var(--card-pink-bg);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}
.wb-actions__clear:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* --------- 分组标题 --------- */
.wb-group { margin-bottom: 28px; }
.wb-group__head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  padding-left: 6px;
}
.wb-group__emoji {
  width: 32px;
  height: 32px;
  background: var(--card-orange-bg);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.wb-group__title {
  font-size: 17px;
  font-weight: 800;
  color: var(--text-primary);
  flex: 1;
  margin: 0;
}
.wb-group__count {
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--bg-card);
  padding: 4px 12px;
  border-radius: 999px;
  font-weight: 600;
}

/* --------- 错题卡片 --------- */
.wb-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.wb-item {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 18px;
  box-shadow: var(--shadow-sm);
  transition: all 0.25s ease;
  animation: fadeIn 0.4s ease both;
  border: 2px solid transparent;
  position: relative;
}
.wb-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--card-orange-bg);
}
.wb-item--reviewed {
  opacity: 0.72;
}

/* 题目部分 */
.wb-item__q {
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px dashed var(--border-color);
}
.wb-item__q-num {
  display: inline-block;
  background: var(--card-orange-bg);
  color: var(--card-orange-text);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 8px;
  margin-bottom: 8px;
}
.wb-item__q-text {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0;
}

/* 答案对比 */
.wb-item__answers {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-bottom: 14px;
}
.wb-item__ans {
  border-radius: 12px;
  padding: 12px 14px;
}
.wb-item__ans-head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}
.wb-item__ans-icon { font-size: 14px; }
.wb-item__ans-label {
  font-size: 11.5px;
  font-weight: 700;
}
.wb-item__ans-text {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.55;
  margin: 0;
  padding-left: 20px;
}

.wb-item__ans--wrong {
  background: rgba(239, 68, 68, 0.1);
  border: 1.5px solid rgba(239, 68, 68, 0.3);
}
.wb-item__ans--wrong .wb-item__ans-label { color: var(--color-danger); }
.wb-item__ans--wrong .wb-item__ans-text { color: var(--color-danger); }

.wb-item__ans--correct {
  background: rgba(16, 185, 129, 0.1);
  border: 1.5px solid rgba(16, 185, 129, 0.3);
}
.wb-item__ans--correct .wb-item__ans-label { color: var(--color-success); }
.wb-item__ans--correct .wb-item__ans-text { color: var(--color-success); }

@media (min-width: 600px) {
  .wb-item__answers { grid-template-columns: 1fr 1fr; }
}

/* 底部信息 */
.wb-item__foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.wb-item__tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.wb-item__layer {
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
}
.wb-item__reviewed {
  font-size: 11.5px;
  color: #4CAF7E;
  font-weight: 600;
}
.wb-item__time {
  font-size: 11px;
  color: #B8B8B8;
}
.wb-item__btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, #FF8C42 0%, #F37522 100%);
  color: #fff;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 140, 66, 0.3);
  transition: all 0.2s ease;
  flex-shrink: 0;
  border: none;
}
.wb-item__btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(255, 140, 66, 0.4);
}

/* --------- 空状态 --------- */
.wb-empty {
  text-align: center;
  padding: 60px 20px;
}
.wb-empty__icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}
.wb-empty__title {
  font-size: 18px;
  font-weight: 800;
  color: #3A3A3A;
  margin-bottom: 8px;
}
.wb-empty__sub {
  font-size: 13px;
  color: #8C8C8C;
  line-height: 1.6;
}

/* --------- 动画 --------- */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
</style>
