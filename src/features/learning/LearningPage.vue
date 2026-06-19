<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useLearningStore } from '@/features/learning/learningStore'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const learningStore = useLearningStore()

onMounted(async () => {
  await userStore.init()
  await learningStore.init()
})

const selectedGrade = ref(Number(route.query.grade) || userStore.grade || 3)
const selectedCategory = ref<'all' | 'basic' | 'olympiad'>('all')

const grades = [1, 2, 3, 4, 5, 6]

const categories = [
  { id: 'all' as const, label: '全部' },
  { id: 'basic' as const, label: '校内基础' },
  { id: 'olympiad' as const, label: '奥数专题' }
]

// 完整的知识点数据
const allTopics = [
  // 一年级
  { id: 'g1-number', title: '认识数字', grade: 1, category: 'basic' as const, difficulty: 1 as const, summary: '1-100数的认识、读写、比较大小' },
  { id: 'g1-add-sub', title: '20以内加减法', grade: 1, category: 'basic' as const, difficulty: 1 as const, summary: '进位加法、退位减法' },
  { id: 'g1-shape', title: '认识图形', grade: 1, category: 'basic' as const, difficulty: 1 as const, summary: '长方形、正方形、圆形、三角形' },
  { id: 'g1-compare', title: '比多少', grade: 1, category: 'olympiad' as const, difficulty: 1 as const, summary: '一一对应、移多补少' },
  { id: 'g1-queue', title: '排队问题', grade: 1, category: 'olympiad' as const, difficulty: 2 as const, summary: '从前数、从后数、中间有几人' },
  { id: 'g1-match', title: '趣味搭配', grade: 1, category: 'olympiad' as const, difficulty: 1 as const, summary: '简单的排列组合' },
  { id: 'g1-logic', title: '简单推理', grade: 1, category: 'olympiad' as const, difficulty: 2 as const, summary: '图文算式、等量代换' },
  
  // 二年级
  { id: 'g2-table', title: '乘法口诀', grade: 2, category: 'basic' as const, difficulty: 1 as const, summary: '1-9乘法口诀表' },
  { id: 'g2-division', title: '表内除法', grade: 2, category: 'basic' as const, difficulty: 2 as const, summary: '平均分、包含除' },
  { id: 'g2-angle', title: '角的初步认识', grade: 2, category: 'basic' as const, difficulty: 1 as const, summary: '直角、锐角、钝角' },
  { id: 'g2-interval', title: '间隔问题', grade: 2, category: 'olympiad' as const, difficulty: 2 as const, summary: '植树问题、锯木头、爬楼梯' },
  { id: 'g2-age', title: '年龄问题', grade: 2, category: 'olympiad' as const, difficulty: 2 as const, summary: '年龄差不变' },
  { id: 'g2-move', title: '移多补少', grade: 2, category: 'olympiad' as const, difficulty: 2 as const, summary: '平均分配、相差倍数' },
  { id: 'g2-number-arr', title: '数字谜', grade: 2, category: 'olympiad' as const, difficulty: 3 as const, summary: '竖式谜、横式谜' },
  { id: 'g2-count', title: '数数图形', grade: 2, category: 'olympiad' as const, difficulty: 2 as const, summary: '数线段、数角、数三角形' },
  
  // 三年级
  { id: 'g3-multi-digit', title: '多位数乘除', grade: 3, category: 'basic' as const, difficulty: 2 as const, summary: '两位数乘法、除数是一位数的除法' },
  { id: 'g3-fraction', title: '分数初步', grade: 3, category: 'basic' as const, difficulty: 2 as const, summary: '认识分数、比较大小、简单计算' },
  { id: 'g3-area', title: '面积计算', grade: 3, category: 'basic' as const, difficulty: 2 as const, summary: '长方形、正方形面积' },
  { id: 'sum-multiple', title: '和倍问题', grade: 3, category: 'olympiad' as const, difficulty: 3 as const, summary: '已知和与倍数，求两数' },
  { id: 'diff-multiple', title: '差倍问题', grade: 3, category: 'olympiad' as const, difficulty: 3 as const, summary: '已知差与倍数，求两数' },
  { id: 'sum-diff', title: '和差问题', grade: 3, category: 'olympiad' as const, difficulty: 2 as const, summary: '已知和与差，求两数' },
  { id: 'g3-arithmetic', title: '等差数列', grade: 3, category: 'olympiad' as const, difficulty: 3 as const, summary: '通项公式、求和公式' },
  { id: 'g3-plant', title: '植树问题', grade: 3, category: 'olympiad' as const, difficulty: 2 as const, summary: '两端都植、一端植、环形' },
  { id: 'g3-cycle', title: '周期问题', grade: 3, category: 'olympiad' as const, difficulty: 3 as const, summary: '找规律、余数应用' },
  { id: 'g3-square', title: '方阵问题', grade: 3, category: 'olympiad' as const, difficulty: 3 as const, summary: '实心方阵、空心方阵' },
  
  // 四年级
  { id: 'g4-decimal', title: '小数运算', grade: 4, category: 'basic' as const, difficulty: 2 as const, summary: '小数加减乘除' },
  { id: 'g4-angle-calc', title: '角的度量', grade: 4, category: 'basic' as const, difficulty: 2 as const, summary: '量角器使用、角度计算' },
  { id: 'g4-triangle', title: '三角形', grade: 4, category: 'basic' as const, difficulty: 2 as const, summary: '分类、内角和、三边关系' },
  { id: 'chicken-rabbit', title: '鸡兔同笼', grade: 4, category: 'olympiad' as const, difficulty: 4 as const, summary: '假设法、抬脚法、方程法' },
  { id: 'profit-loss', title: '盈亏问题', grade: 4, category: 'olympiad' as const, difficulty: 4 as const, summary: '一盈一亏、两次盈、两次亏' },
  { id: 'g4-average', title: '平均数问题', grade: 4, category: 'olympiad' as const, difficulty: 3 as const, summary: '移多补少、基准数法' },
  { id: 'g4-meet', title: '相遇问题', grade: 4, category: 'olympiad' as const, difficulty: 3 as const, summary: '相向而行、速度和×时间=路程' },
  { id: 'g4-chase', title: '追及问题', grade: 4, category: 'olympiad' as const, difficulty: 4 as const, summary: '同向而行、速度差×时间=路程差' },
  { id: 'g4-count-geo', title: '几何计数', grade: 4, category: 'olympiad' as const, difficulty: 3 as const, summary: '数长方形、数正方形' },
  { id: 'g4-define', title: '定义新运算', grade: 4, category: 'olympiad' as const, difficulty: 3 as const, summary: '理解新运算规则并计算' },
  
  // 五年级
  { id: 'g5-decimal-calc', title: '小数混合运算', grade: 5, category: 'basic' as const, difficulty: 3 as const, summary: '运算定律推广到小数' },
  { id: 'g5-equation', title: '简易方程', grade: 5, category: 'basic' as const, difficulty: 3 as const, summary: '用字母表示数、解方程' },
  { id: 'g5-area-poly', title: '多边形面积', grade: 5, category: 'basic' as const, difficulty: 3 as const, summary: '平行四边形、三角形、梯形' },
  { id: 'g5-train', title: '火车过桥', grade: 5, category: 'olympiad' as const, difficulty: 4 as const, summary: '火车长度+桥长=总路程' },
  { id: 'g5-boat', title: '流水行船', grade: 5, category: 'olympiad' as const, difficulty: 4 as const, summary: '顺水速度、逆水速度、静水速度' },
  { id: 'g5-work', title: '工程问题', grade: 5, category: 'olympiad' as const, difficulty: 4 as const, summary: '工作效率、合作完成' },
  { id: 'fraction-split', title: '分数裂项', grade: 5, category: 'olympiad' as const, difficulty: 5 as const, summary: '裂项相消法求和' },
  { id: 'g5-ratio', title: '比和比例', grade: 5, category: 'olympiad' as const, difficulty: 3 as const, summary: '按比例分配、比例应用' },
  { id: 'g5-circular', title: '圆与扇形', grade: 5, category: 'olympiad' as const, difficulty: 4 as const, summary: '周长、面积、扇形' },
  { id: 'g5-pigeon', title: '抽屉原理', grade: 5, category: 'olympiad' as const, difficulty: 4 as const, summary: '最不利原则' },
  { id: 'g5-inclusion', title: '容斥原理', grade: 5, category: 'olympiad' as const, difficulty: 4 as const, summary: '韦恩图、重叠计数' },
  
  // 六年级
  { id: 'g6-percent', title: '百分数', grade: 6, category: 'basic' as const, difficulty: 3 as const, summary: '百分数应用、折扣、利率' },
  { id: 'g6-cylinder', title: '圆柱圆锥', grade: 6, category: 'basic' as const, difficulty: 3 as const, summary: '表面积、体积计算' },
  { id: 'g6-ratio-app', title: '比例应用', grade: 6, category: 'basic' as const, difficulty: 3 as const, summary: '正比例、反比例' },
  { id: 'travel-problem', title: '行程问题综合', grade: 6, category: 'olympiad' as const, difficulty: 5 as const, summary: '多次相遇、变速问题' },
  { id: 'g6-concentration', title: '浓度问题', grade: 6, category: 'olympiad' as const, difficulty: 5 as const, summary: '溶质、溶剂、浓度关系' },
  { id: 'g6-economic', title: '经济问题', grade: 6, category: 'olympiad' as const, difficulty: 4 as const, summary: '利润、利润率、打折' },
  { id: 'g6-combination', title: '组合计数', grade: 6, category: 'olympiad' as const, difficulty: 5 as const, summary: '排列组合、加法原理、乘法原理' },
  { id: 'g6-number-theory', title: '数论初步', grade: 6, category: 'olympiad' as const, difficulty: 5 as const, summary: '质数、合数、因数、倍数' },
  { id: 'g6-geometry', title: '几何变换', grade: 6, category: 'olympiad' as const, difficulty: 5 as const, summary: '等积变形、割补法' }
]

const filteredTopics = computed(() => {
  return allTopics.filter(t => {
    const gradeMatch = t.grade === selectedGrade.value
    const categoryMatch = selectedCategory.value === 'all' || t.category === selectedCategory.value
    return gradeMatch && categoryMatch
  })
})

const stats = computed(() => {
  const gradeTopics = allTopics.filter(t => t.grade === selectedGrade.value)
  const basic = gradeTopics.filter(t => t.category === 'basic').length
  const olympiad = gradeTopics.filter(t => t.category === 'olympiad').length
  return { basic, olympiad, total: gradeTopics.length }
})

function gotoTopic(id: string) {
  router.push('/learning/' + id)
}

function changeGrade(grade: number) {
  selectedGrade.value = grade
}
</script>

<template>
  <AppLayout>
    <div class="learning-page">
      <header class="lp-header">
        <h1>📚 专题学习</h1>
        <p class="muted">选择专题，开启数学探索之旅</p>
      </header>

      <!-- 年级选择 -->
      <div class="grade-tabs">
        <button
          v-for="g in grades"
          :key="g"
          class="grade-tab"
          :class="{ active: selectedGrade === g }"
          @click="changeGrade(g)"
        >
          {{ g }}年级
        </button>
      </div>

      <!-- 分类筛选 -->
      <div class="category-tabs">
        <button
          v-for="c in categories"
          :key="c.id"
          class="category-tab"
          :class="{ active: selectedCategory === c.id }"
          @click="selectedCategory = c.id"
        >
          {{ c.label }}
        </button>
      </div>

      <!-- 统计 -->
      <div class="stats-bar">
        <span>校内基础: {{ stats.basic }}个</span>
        <span>奥数专题: {{ stats.olympiad }}个</span>
        <span>总计: {{ stats.total }}个</span>
      </div>

      <!-- 专题列表 -->
      <div class="topic-grid">
        <div
          v-for="topic in filteredTopics"
          :key="topic.id"
          class="topic-card"
          :class="[`diff-${topic.difficulty}`, topic.category]"
          @click="gotoTopic(topic.id)"
        >
          <div class="topic-header">
            <span class="topic-badge">{{ topic.category === 'basic' ? '基础' : '奥数' }}</span>
            <span class="topic-stars">{{ '⭐'.repeat(topic.difficulty) }}</span>
          </div>
          <h3 class="topic-title">{{ topic.title }}</h3>
          <p class="topic-summary">{{ topic.summary }}</p>
          <div class="topic-footer">
            <span class="mastery-level">掌握度: Lv.{{ learningStore.masteryLevel(topic.id) }}/5</span>
            <span class="arrow">→</span>
          </div>
        </div>
      </div>

      <div v-if="filteredTopics.length === 0" class="empty">
        <p>该分类下暂无专题</p>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.learning-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px;
}

.lp-header {
  text-align: center;
  margin-bottom: 24px;
}
.lp-header h1 {
  font-size: 28px;
  color: #2C3E50;
  margin-bottom: 6px;
}
.muted {
  color: #9AA5B1;
  font-size: 14px;
}

.grade-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.grade-tab {
  padding: 10px 20px;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  background: #fff;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.15s;
  cursor: pointer;
}
.grade-tab.active {
  background: #4F7DF8;
  border-color: #4F7DF8;
  color: white;
}

.category-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.category-tab {
  flex: 1;
  padding: 12px;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  background: #fff;
  font-weight: 500;
  transition: all 0.15s;
  cursor: pointer;
}
.category-tab.active {
  background: rgba(79, 125, 248, 0.1);
  border-color: #4F7DF8;
  color: #4F7DF8;
}

.stats-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  padding: 12px 16px;
  background: #F8FAFC;
  border-radius: 12px;
  font-size: 14px;
  color: #6B7785;
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.topic-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  border: 2px solid #E2E8F0;
  cursor: pointer;
  transition: all 0.15s;
}
.topic-card:hover {
  border-color: #4F7DF8;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.topic-card.olympiad {
  border-left: 4px solid #F59E0B;
}
.topic-card.basic {
  border-left: 4px solid #52C41A;
}

.topic-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.topic-badge {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 500;
}
.olympiad .topic-badge {
  background: #FEF3C7;
  color: #D97706;
}
.basic .topic-badge {
  background: #DCFCE7;
  color: #16A34A;
}
.topic-stars {
  font-size: 12px;
}

.topic-title {
  font-size: 18px;
  color: #2C3E50;
  margin-bottom: 8px;
}
.topic-summary {
  font-size: 13px;
  color: #6B7785;
  line-height: 1.5;
  margin-bottom: 16px;
}

.topic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mastery-level {
  font-size: 12px;
  color: #4F7DF8;
  font-weight: 500;
}
.arrow {
  color: #9AA5B1;
  font-size: 18px;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: #9AA5B1;
}

@media (max-width: 640px) {
  .topic-grid {
    grid-template-columns: 1fr;
  }
}
</style>
