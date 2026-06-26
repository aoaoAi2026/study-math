<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
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
  script: { bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', badge: '#10b981', icon: '#15803d' },
  understanding: { bg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', badge: '#3b82f6', icon: '#1d4ed8' },
  extension: { bg: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)', badge: '#8b5cf6', icon: '#6d28d9' }
}

const scriptLines = computed(() => {
  return props.script.split('\n')
    .map(line => line.replace(/^###\s*/, '').trim())
    .filter(line => line)
})

function processLine(line: string): string {
  return line
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
}

function lineClass(line: string): string {
  if (line.includes('家长') || line.includes('妈妈') || line.includes('爸爸')) return 'line--parent'
  if (line.includes('孩子') || line.includes('宝贝')) return 'line--child'
  if (line.startsWith('（') || line.startsWith('(')) return 'line--note'
  return ''
}
</script>

<template>
  <div class="parent-card">
    <div class="parent-card__header" :style="{ background: modeColors[mode || 'script'].bg }">
      <div class="parent-card__icon-wrap">
        <span class="parent-card__icon">👨‍👩‍👧</span>
      </div>
      <div class="parent-card__title-wrap">
        <span class="parent-card__label">亲子互动</span>
        <h2 v-if="title" class="parent-card__title">{{ title }}</h2>
        <h2 v-else class="parent-card__title">和孩子一起思考</h2>
        <span
          v-if="mode"
          class="parent-card__mode"
          :style="{ background: modeColors[mode].badge }"
        >
          {{ modeLabels[mode] }}
        </span>
      </div>
    </div>

    <div class="parent-card__intro">
      <p>按照下面的对话脚本引导孩子自己思考和表达 —— <strong>少说答案，多问问题</strong>。</p>
    </div>

    <div class="parent-card__script">
      <div
        v-for="(line, index) in scriptLines"
        :key="index"
        class="parent-card__line"
        :class="lineClass(line)"
      >
        <span class="parent-card__line-dot"></span>
        <span class="parent-card__line-content" v-html="processLine(line)"></span>
      </div>
    </div>

    <div class="parent-card__tips">
      <div class="parent-card__tip">
        <span class="parent-card__tip-icon">💡</span>
        <span>等待至少 30 秒再给提示</span>
      </div>
      <div class="parent-card__tip">
        <span class="parent-card__tip-icon">🎯</span>
        <span>让孩子自己说出答案</span>
      </div>
      <div class="parent-card__tip">
        <span class="parent-card__tip-icon">🌟</span>
        <span>完成后问：「你是怎么想到的？」</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.parent-card {
  background: var(--bg-card);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.parent-card__header {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 28px 32px 20px;
  background: linear-gradient(135deg, var(--card-green-bg) 0%, rgba(187, 247, 208, 0.8) 50%, var(--card-green-bg) 100%);
  border-bottom: 1px solid rgba(16, 185, 129, 0.15);
}

.parent-card__icon-wrap {
  width: 60px;
  height: 60px;
  background: var(--bg-card);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  flex-shrink: 0;
}

.parent-card__icon { font-size: 28px; }
.parent-card__title-wrap { flex: 1; min-width: 0; }

.parent-card__label {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-success);
  background: rgba(21, 128, 61, 0.12);
  padding: 4px 10px;
  border-radius: 8px;
  margin-bottom: 6px;
  margin-right: 8px;
}

.parent-card__title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px;
  line-height: 1.3;
}

.parent-card__mode {
  padding: 4px 12px;
  border-radius: 999px;
  color: white;
  font-size: 11px;
  font-weight: 700;
}

.parent-card__intro {
  padding: 20px 32px;
  background: var(--bg-hover);
  color: var(--text-primary);
  font-size: 15px;
  line-height: 1.7;
  border-bottom: 1px solid var(--border-color);
}
.parent-card__intro p { margin: 0; }
.parent-card__intro strong { color: var(--color-success); font-weight: 700; }

.parent-card__script {
  padding: 24px 32px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.parent-card__line {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.7;
}

.parent-card__line-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 8px;
  flex-shrink: 0;
  background: var(--border-color-strong);
}

.parent-card__line-content { flex: 1; min-width: 0; }

.line--parent {
  background: rgba(59, 130, 246, 0.1);
  border-left: 3px solid var(--color-primary);
  color: var(--text-primary);
}
.line--parent .parent-card__line-dot { background: var(--color-primary); }

.line--child {
  background: rgba(16, 185, 129, 0.1);
  border-left: 3px solid var(--color-success);
  color: var(--text-primary);
}
.line--child .parent-card__line-dot { background: var(--color-success); }

.line--note {
  background: var(--bg-hover);
  border-left: 3px dashed var(--border-color-strong);
  color: var(--text-secondary);
  font-style: italic;
}
.line--note .parent-card__line-dot { background: var(--border-color-strong); }

.parent-card__tips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px 32px 28px;
}

.parent-card__tip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-success);
}

.parent-card__tip-icon { font-size: 16px; }

@media (max-width: 640px) {
  .parent-card__header { padding: 22px 22px 16px; }
  .parent-card__intro { padding: 18px 22px; }
  .parent-card__script { padding: 20px 22px 8px; }
  .parent-card__tips { padding: 12px 22px 22px; }
  .parent-card__icon-wrap { width: 52px; height: 52px; }
  .parent-card__title { font-size: 18px; }
}
</style>
