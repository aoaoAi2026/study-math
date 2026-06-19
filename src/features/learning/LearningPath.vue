<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listTopics } from '@/services/contentLoader'
import { useUserStore } from '@/stores/userStore'
import { useLearningStore } from '@/features/learning/learningStore'

const router = useRouter()
const userStore = useUserStore()
const learningStore = useLearningStore()
onMounted(async () => { await userStore.init(); await learningStore.init() })

const topics = computed(() => listTopics())
const grouped = computed(() => {
  const map: Record<number, ReturnType<typeof listTopics>> = {}
  for (const t of topics.value) { (map[t.grade] = map[t.grade] || []).push(t) }
  return map
})

function goto(id: string) { router.push('/learning/topic/' + id) }
</script>

<template>
  <div class="lp">
    <header class="lp-head">
      <h1>📚 学习路径</h1>
      <p class="muted">从基础到精通，一步一步掌握每一个专题</p>
    </header>
    <div v-for="(list, grade) in grouped" :key="grade" class="grade-block">
      <div class="grade-head">
        <h2>{{ grade }} 年级</h2>
        <span>{{ list.length }} 个专题</span>
      </div>
      <div class="topic-list">
        <div v-for="t in list" :key="t.id" class="row" @click="goto(t.id)">
          <div class="col-left">
            <div class="title">{{ t.title }}</div>
            <div class="sum">{{ t.summary }}</div>
          </div>
          <div class="col-mid">
            <span class="diff">{{ '⭐'.repeat(t.difficulty) }}</span>
          </div>
          <div class="col-right">
            <div class="mastery-bar"><i :style="{width: Math.min(100, learningStore.masteryLevel(t.id)*20) + '%'}"></i></div>
            <span class="mastery-text">Lv.{{ learningStore.masteryLevel(t.id) }}/5</span>
          </div>
          <button class="btn btn-primary small">开始 →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lp { max-width: 1100px; margin: 0 auto; padding: 16px; }
.lp-head { text-align: center; margin-bottom: 24px; }
.lp-head h1 { font-size: 28px; color: #2C3E50; margin-bottom: 6px; }
.muted { color: #9AA5B1; font-size: 14px; }
.grade-block { background: #fff; border-radius: 18px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 10px rgba(0,0,0,.05); }
.grade-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; }
.grade-head h2 { font-size: 20px; color: #2C3E50; }
.topic-list { display: flex; flex-direction: column; gap: 10px; }
.row { display: grid; grid-template-columns: 1fr 60px 160px 80px; gap: 16px; align-items: center; padding: 14px 18px; background: #FAFCFF; border-radius: 12px; cursor: pointer; transition: all .15s; }
.row:hover { background: rgba(79,125,248,.08); transform: translateX(4px); }
.title { font-weight: 700; color: #2C3E50; margin-bottom: 3px; }
.sum { font-size: 13px; color: #6B7785; line-height: 1.5; }
.diff { font-size: 13px; text-align: center; display: block; }
.mastery-bar { background: #EFF3F8; height: 8px; border-radius: 999px; overflow: hidden; }
.mastery-bar i { display: block; height: 100%; background: linear-gradient(90deg,#4F7DF8,#52C41A); transition: width .5s; }
.mastery-text { font-size: 12px; color: #52C41A; text-align: right; margin-top: 4px; display: block; font-weight: 600; }
.btn.small { padding: 8px 14px; font-size: 13px; }
@media (max-width: 768px) { .row { grid-template-columns: 1fr; gap: 8px; } }
</style>
