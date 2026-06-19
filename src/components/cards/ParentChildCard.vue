<script setup lang="ts">
defineProps<{
  title?: string
  script: string
  mode?: 'script' | 'understanding' | 'extension'
}>()

const modeLabels = {
  script: '傻瓜模式',
  understanding: '理解模式',
  extension: '拓展模式'
}

const modeColors = {
  script: '#10b981',
  understanding: '#3b82f6',
  extension: '#8b5cf6'
}
</script>

<template>
  <div class="parent-child-card">
    <div class="parent-child-card__header">
      <span class="parent-child-card__icon">👨‍👩‍👧</span>
      <h3 v-if="title" class="parent-child-card__title">{{ title }}</h3>
      <span
        v-if="mode"
        class="parent-child-card__mode"
        :style="{ background: modeColors[mode] }"
      >
        {{ modeLabels[mode] }}
      </span>
    </div>

    <div class="parent-child-card__intro">
      <p>和孩子一起完成这道题！按照下面的对话脚本，引导孩子自己思考和表达。</p>
    </div>

    <div class="parent-child-card__script">
      <div
        v-for="(line, index) in script.split('\n')"
        :key="index"
        class="parent-child-card__line"
        :class="{
          'parent-child-card__line--parent': line.includes('家长'),
          'parent-child-card__line--child': line.includes('孩子'),
          'parent-child-card__line--note': line.startsWith('（')
        }"
      >
        {{ line }}
      </div>
    </div>

    <div class="parent-child-card__tips">
      <div class="parent-child-card__tip">
        <span class="parent-child-card__tip-icon">💡</span>
        <span>等待至少 30 秒再给提示</span>
      </div>
      <div class="parent-child-card__tip">
        <span class="parent-child-card__tip-icon">🎯</span>
        <span>让孩子自己说出答案</span>
      </div>
      <div class="parent-child-card__tip">
        <span class="parent-child-card__tip-icon">🌟</span>
        <span>完成后询问"你是怎么想到的"</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.parent-child-card {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  border: 2px solid #86efac;
}

.parent-child-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.parent-child-card__icon {
  font-size: var(--text-2xl);
}

.parent-child-card__title {
  font-size: var(--text-xl);
  color: #166534;
  margin: 0;
  flex: 1;
}

.parent-child-card__mode {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  color: white;
  font-size: var(--text-xs);
  font-weight: 600;
}

.parent-child-card__intro {
  color: #166534;
  margin-bottom: var(--space-4);
}

.parent-child-card__intro p {
  margin: 0;
}

.parent-child-card__script {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.parent-child-card__line {
  padding: var(--space-2) 0;
  border-bottom: 1px dashed var(--border-color);
}

.parent-child-card__line:last-child {
  border-bottom: none;
}

.parent-child-card__line--parent {
  color: #1d4ed8;
  font-weight: 500;
}

.parent-child-card__line--child {
  color: #059669;
}

.parent-child-card__line--note {
  color: var(--text-tertiary);
  font-style: italic;
  font-size: var(--text-xs);
}

.parent-child-card__tips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.parent-child-card__tip {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: rgba(16, 185, 129, 0.1);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  color: #166534;
}
</style>
