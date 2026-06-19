<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { parseTopicMarkdown } from '@/services/contentLoader'

const route = useRoute()
const topicId = route.params.id as string

const content = ref(parseTopicMarkdown(`
# 和倍问题

## 📌 它是什么？
和倍问题是已知两个数的和以及它们的倍数关系，求这两个数各是多少的问题。

::: story-card
### 小明和小红的苹果
小明和小红一起摘苹果，两人一共摘了 30 个。小明摘的个数是小红的 4 倍。
"我摘得比你多！"小明得意地说。小红不服气："那是因为你摘得快！"
你能帮他们算一算，每人摘了多少个吗？
:::

::: concept-card
### 什么是"1份量"？
在两个数量进行比较时，把较小的那个量看作"1份"（也叫"1倍数"），另一个量是它的几倍就是"几份"。

**关键发现**：只要用**总和 ÷ 总份数**，就能算出 1 份是多少！
:::

::: example-card
### 母题：和倍问题基本型
**题目**：小明和小红一共有 30 个苹果，小明的苹果数是小红的 4 倍。两人各有多少个？

**第一步**：找"1份量"——小红更少，小红是 1 份量

**第二步**：画线段图——小红画 1 段，小明画 4 段

**第三步**：数总份数——1 + 4 = 5（份）

**第四步**：求 1 份量——30 ÷ 5 = 6（个）→ 小红

**第五步**：求其他量——6 × 4 = 24（个）→ 小明

**第六步**：验算——6 + 24 = 30 ✓，24 ÷ 6 = 4 ✓

**核心公式**：$1份量 = 和 ÷ (倍数 + 1)$
:::

::: variant-card
### 变式一：暗和问题
一个长方形的周长是 60 厘米，长是宽的 4 倍。长和宽各是多少？
:::

::: variant-card
### 变式二：三个量的和倍
甲、乙、丙三个数的和是 120，甲是乙的 2 倍，丙是乙的 3 倍。三个数各是多少？
:::

::: mistake-card
### 常见错误：直接用和除以倍数
**错误**：30 ÷ 4 = 7.5，认为小红有 7.5 个
**原因**：忘记把倍数 + 1，总数对应的是（倍数 + 1）份
**纠正**：画线段图，数清楚一共有几份
:::

::: parent-child-card
### 亲子共学脚本
**家长**："你来帮我分析一下这道题。谁是 1 份量？"
**孩子**：（可能说小明或小红）
**家长**（如果孩子说错）："你看，小明的个数是小红的 4 倍，谁更少？"
:::
`))
</script>

<template>
  <AppLayout>
    <div class="topic-detail">
      <div v-html="content.html"></div>
    </div>
  </AppLayout>
</template>

<style scoped>
.topic-detail {
  max-width: 800px;
  margin: 0 auto;
}
</style>
