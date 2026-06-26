<script setup lang="ts">
import { ref, computed } from 'vue'

type Category = '全部' | '辅导方法' | '心理建设' | '习惯培养' | '奥数入门'

interface Article {
  id: number
  title: string
  summary: string
  category: Exclude<Category, '全部'>
  content: string
}

const articles: Article[] = [
  {
    id: 1, title: '如何辅导孩子做应用题', category: '辅导方法',
    summary: '掌握"读题-画图-列式-检验"四步法，让孩子逐步攻克应用题难关。',
    content: `应用题是小学数学的难点，家长辅导时建议采用"四步法"：

1. **读题**：让孩子大声朗读题目两遍，圈出关键数字和条件词（"一共""比...多""平均"）。

2. **画图**：用线段图、示意图或表格将文字转化为直观图形。例如"鸡兔同笼"问题，先画头再画腿，孩子一眼就能看出关系。

3. **列式**：引导孩子用自己的话复述解题思路，再写出算式。不要急于纠正，先听孩子的想法。

4. **检验**：将答案代回原题验证。养成"答完必查"的习惯，可以减少粗心失分。

**实用建议**：每天只辅导1-2道应用题，重在质量而非数量。孩子遇到困难时，不要直接给答案，而是用提问引导："你觉得这道题在问什么？" `
  },
  {
    id: 2, title: '孩子数学焦虑怎么办', category: '心理建设',
    summary: '识别数学焦虑的信号，用科学方法帮助孩子建立数学自信。',
    content: `数学焦虑表现为：一看到数学题就紧张、考试时大脑空白、回避数学相关活动。

**应对策略**：

1. **接纳情绪**：告诉孩子"觉得数学难是正常的"，不要说"这么简单你怎么不会"。接纳是改变的第一步。

2. **降低难度**：从孩子能做对的题目开始，逐步提升。连续的成功体验能有效缓解焦虑。

3. **改变认知**：数学能力不是天生的，而是练出来的。给孩子讲"成长型思维"——大脑越练越聪明。

4. **营造轻松氛围**：辅导时保持耐心，用"我们一起来想想"代替"你应该知道"。避免在饭桌或睡前讨论数学成绩。

5. **关注过程而非结果**：表扬孩子的努力和思考过程，而非只看分数。"你这道题的思路很特别"比"考了100分"更有价值。`
  },
  {
    id: 3, title: '每天15分钟数学习惯养成', category: '习惯培养',
    summary: '用微习惯策略，让孩子在短时间内建立稳定的数学学习节奏。',
    content: `研究表明，每天15分钟的专注练习比周末突击2小时效果更好。

**具体操作方法**：

1. **固定时间**：选择孩子精力充沛的时段（如放学后休息30分钟），每天同一时间开始，形成条件反射。

2. **明确内容**：提前准备好当天的练习内容，避免"做哪道题"的犹豫浪费时间。可以准备一个练习清单。

3. **计时器辅助**：使用倒计时器，15分钟一到就停止。让孩子知道"时间有限"，反而更专注。

4. **内容安排**：5分钟口算热身 + 8分钟专项练习 + 2分钟回顾总结。内容由易到难，循序渐进。

5. **记录反馈**：用简单的打卡表记录每天的完成情况，连续7天给予小奖励，强化习惯。

**注意事项**：周末可以适当延长到20分钟，但不要超过30分钟。保持"意犹未尽"的感觉最重要。`
  },
  {
    id: 4, title: '奥数入门：从什么时候开始', category: '奥数入门',
    summary: '了解奥数学习的最佳起点，避免过早或过晚开始训练。',
    content: `奥数学习并非越早越好，合理的起点很重要。

**各年级建议**：

- **二年级**：以趣味数学游戏为主，培养数感和逻辑意识。推荐数独、火柴棒游戏。
- **三年级**：开始接触基础奥数专题，如找规律、简单推理。每周1-2次，每次30分钟。
- **四年级**：系统学习奥数专题（行程问题、鸡兔同笼等），这是奥数学习的黄金期。
- **五六年级**：针对薄弱专题强化训练，为升学做准备。

**家长须知**：

1. 兴趣优先：如果孩子抗拒，不要强迫。可以先从数学故事书、趣味视频入手激发兴趣。

2. 量力而行：选择适合孩子水平的题目，不要盲目追求难题。做对中等题比做错难题更有价值。

3. 避免误区：奥数≠刷题。重在培养思维方式，而非机械记忆解题套路。

4. 平衡发展：奥数学习不应挤占课内基础知识的巩固时间。基础不牢，奥数难精。`
  },
  {
    id: 5, title: '错题本的正确使用方法', category: '辅导方法',
    summary: '建立高效的错题整理系统，让每一道错题都成为进步的阶梯。',
    content: `错题本不是简单的"抄错题"，而是一套系统的学习方法。

**错题本四步法**：

1. **记录错题**：抄写或剪贴原题，用红笔标注错误步骤。不需要每道错题都记录，优先记录"有代表性"的错题。

2. **分析原因**：在错题旁写明错误原因——是"概念不清""计算粗心"还是"审题不仔细"。分类统计，找到薄弱环节。

3. **写出正解**：用不同颜色的笔写出正确解答过程，并标注关键步骤。

4. **定期回顾**：每周回顾一次本周错题，每月回顾一次本月错题。回顾时遮住答案重新做一遍，做对了才算真正掌握。

**实用建议**：
- 错题本不要做得太"精美"，实用为主
- 每道错题标注日期和来源，方便追踪
- 同一类型的错题整理在一起，形成专题`
  },
  {
    id: 6, title: '如何培养数学思维', category: '习惯培养',
    summary: '数学思维不仅是计算能力，更是逻辑推理和问题解决的综合能力。',
    content: `数学思维的核心是"把复杂问题拆解为简单步骤"的能力。

**日常培养方法**：

1. **生活中的数学**：逛超市时让孩子算总价、比较单价；做饭时讨论比例和分量。让数学融入生活。

2. **多问"为什么"**：遇到数学题，引导孩子思考"为什么要用这个方法""还有别的做法吗"。培养一题多解的能力。

3. **玩策略游戏**：象棋、围棋、数独、24点游戏都能锻炼逻辑思维。每周安排1-2次家庭游戏时间。

4. **鼓励表达**：让孩子用自己的话解释解题思路。能说清楚，说明真正理解了。

5. **循序渐进**：从观察规律→发现模式→总结方法→推广应用，逐步提升思维层次。

**关键原则**：不要追求速度，要追求理解。一道题想透，胜过十道题走过场。`
  }
]

const categories: Category[] = ['全部', '辅导方法', '心理建设', '习惯培养', '奥数入门']
const activeCategory = ref<Category>('全部')
const expandedId = ref<number | null>(null)

const filteredArticles = computed(() =>
  activeCategory.value === '全部'
    ? articles
    : articles.filter(a => a.category === activeCategory.value)
)

function toggleArticle(id: number) {
  expandedId.value = expandedId.value === id ? null : id
}

function formatContent(content: string): string {
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^(\d+\.\s)/gm, '<span class="academy__list-num">$1</span>')
}

const categoryColors: Record<Exclude<Category, '全部'>, { bg: string; text: string; border: string }> = {
  '辅导方法': { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa', border: '#3b82f6' },
  '心理建设': { bg: 'rgba(236, 72, 153, 0.15)', text: '#f472b6', border: '#ec4899' },
  '习惯培养': { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80', border: '#22c55e' },
  '奥数入门': { bg: 'rgba(251, 191, 36, 0.15)', text: '#fcd34d', border: '#f59e0b' }
}
</script>

<template>
  <div class="academy">
    <header class="academy__header">
      <div class="academy__hero">
        <div class="academy__icon">📚</div>
        <h1 class="academy__title">家长学院</h1>
        <p class="academy__subtitle">Parent Academy</p>
        <p class="academy__desc">教育指南与辅导方法，陪伴孩子快乐学数学</p>
      </div>
    </header>

    <nav class="academy__tabs">
      <button
        v-for="cat in categories" :key="cat"
        class="academy__tab"
        :class="{ active: activeCategory === cat }"
        @click="activeCategory = cat"
      >{{ cat }}</button>
    </nav>

    <div class="academy__list">
      <article
        v-for="item in filteredArticles" :key="item.id"
        class="academy__card"
        :class="{ expanded: expandedId === item.id }"
        @click="toggleArticle(item.id)"
      >
        <div class="academy__card-header">
          <div class="academy__card-tag">
            <span 
              class="academy__tag"
              :style="{ 
                background: categoryColors[item.category].bg,
                color: categoryColors[item.category].text,
                borderColor: categoryColors[item.category].border
              }"
            >{{ item.category }}</span>
          </div>
          <h3 class="academy__card-title">{{ item.title }}</h3>
          <p class="academy__card-summary">{{ item.summary }}</p>
          <div class="academy__card-toggle">
            <span class="academy__toggle-text">{{ expandedId === item.id ? '收起' : '展开详情' }}</span>
            <span class="academy__toggle-icon" :class="{ rotated: expandedId === item.id }">▼</span>
          </div>
        </div>
        <div v-if="expandedId === item.id" class="academy__card-detail" @click.stop>
          <div class="academy__content" v-html="formatContent(item.content)" />
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.academy {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 0;
}

.academy__header {
  text-align: center;
  margin-bottom: 32px;
}

.academy__hero {
  padding: 24px;
}

.academy__icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.academy__title {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #f472b6, #7c3aed, #00d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.academy__subtitle {
  font-size: 12px;
  color: var(--text-tertiary);
  letter-spacing: 4px;
  margin-bottom: 12px;
}

.academy__desc {
  color: var(--text-secondary);
  font-size: 14px;
}

.academy__tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 32px;
}

.academy__tab {
  padding: 12px 24px;
  border: 1.5px solid var(--border-color);
  border-radius: 30px;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.academy__tab:hover {
  border-color: rgba(99, 102, 241, 0.5);
  color: var(--color-primary);
}

.academy__tab.active {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
}

.academy__list {
  max-width: 600px;
  margin: 0 auto;
}

.academy__card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.academy__card:hover {
  border-color: rgba(99, 102, 241, 0.3);
  background: var(--bg-hover);
}

.academy__card.expanded {
  border-color: rgba(99, 102, 241, 0.5);
}

.academy__card-header {
  padding: 20px 24px;
}

.academy__card-tag {
  margin-bottom: 12px;
}

.academy__tag {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid;
}

.academy__card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.academy__card-summary {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
}

.academy__card-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.academy__toggle-text {
  font-size: 13px;
  color: var(--color-primary);
  font-weight: 500;
}

.academy__toggle-icon {
  font-size: 12px;
  color: var(--color-primary);
  transition: transform 0.3s ease;
}

.academy__toggle-icon.rotated {
  transform: rotate(180deg);
}

.academy__card-detail {
  padding: 0 24px 24px;
  border-top: 1px solid var(--border-color);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.academy__content {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.8;
  padding-top: 20px;
}

.academy__content strong {
  color: var(--color-primary-light);
  font-weight: 600;
}

.academy__list-num {
  color: var(--color-info);
  font-weight: 600;
}

.academy__content br {
  display: block;
  margin: 12px 0;
}
</style>