<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

type TemplateType = 'diary' | 'summary' | 'fun' | 'story'

interface NewspaperData {
  template: TemplateType
  title: string
  sections: { heading: string; content: string }[]
  savedAt: string
}

const STORAGE_KEY = 'math-newspaper'

const templates: { key: TemplateType; label: string; icon: string; desc: string }[] = [
  { key: 'diary', label: '数学日记', icon: '📓', desc: '记录数学学习心得' },
  { key: 'summary', label: '知识总结', icon: '📋', desc: '梳理知识点脉络' },
  { key: 'fun', label: '趣味数学', icon: '🧩', desc: '分享有趣的数学问题' },
  { key: 'story', label: '数学家故事', icon: '📖', desc: '讲述数学家的传奇' },
]

const defaultSections: Record<TemplateType, { heading: string; content: string }[]> = {
  diary: [
    { heading: '今天的数学课', content: '今天在数学课上，我学习了……' },
    { heading: '我的收获', content: '通过这节课，我明白了……' },
    { heading: '还有疑问', content: '我还有一个问题想不通……' },
  ],
  summary: [
    { heading: '核心概念', content: '本单元的重点知识是……' },
    { heading: '公式与定理', content: '重要公式：……' },
    { heading: '典型例题', content: '例题分析：……' },
  ],
  fun: [
    { heading: '趣味问题', content: '今天来挑战一道有趣的题目……' },
    { heading: '解题思路', content: '我是这样想的……' },
    { heading: '拓展思考', content: '如果把题目改一下……' },
  ],
  story: [
    { heading: '人物简介', content: '这位数学家是……' },
    { heading: '主要贡献', content: '他/她最重要的成就是……' },
    { heading: '我的感想', content: '读完这个故事，我觉得……' },
  ],
}

const decorations = ['+', '-', '×', '÷', '=', '∑', 'π', '∞', '√', '%', '△', '∠']
const selectedTemplate = ref<TemplateType>('diary')
const title = ref('我的数学小报')
const sections = ref(defaultSections.diary)
const isPreview = ref(false)
const savedList = ref<NewspaperData[]>([])
const showSaved = ref(false)
const currentTemplate = computed(() => templates.find(t => t.key === selectedTemplate.value))

function selectTemplate(key: TemplateType) {
  selectedTemplate.value = key
  sections.value = defaultSections[key].map(s => ({ ...s }))
}

function saveToStorage() {
  const data: NewspaperData = {
    template: selectedTemplate.value, title: title.value,
    sections: sections.value.map(s => ({ ...s })), savedAt: new Date().toLocaleString(),
  }
  savedList.value = [...savedList.value, data]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedList.value))
}

function loadSaved() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) savedList.value = JSON.parse(raw) } catch { /* */ }
}

function loadItem(item: NewspaperData) {
  selectedTemplate.value = item.template
  title.value = item.title
  sections.value = item.sections.map(s => ({ ...s }))
  showSaved.value = false
}

function deleteItem(index: number) {
  savedList.value.splice(index, 1)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedList.value))
}

onMounted(loadSaved)
</script>

<template>
  <div class="newspaper">
    <header class="np-header">
      <h1>📰 数学小报生成器</h1>
      <p class="np-subtitle">选择模板，编辑内容，生成你的专属数学小报</p>
    </header>

    <div class="np-templates">
      <button v-for="t in templates" :key="t.key"
        :class="['np-tpl', { active: selectedTemplate === t.key }]"
        @click="selectTemplate(t.key)">
        <span class="np-tpl-icon">{{ t.icon }}</span>
        <span class="np-tpl-label">{{ t.label }}</span>
        <span class="np-tpl-desc">{{ t.desc }}</span>
      </button>
    </div>

    <div v-if="!isPreview" class="np-editor">
      <div class="np-field">
        <label>小报标题</label>
        <input v-model="title" type="text" placeholder="输入小报标题" />
      </div>
      <div v-for="(sec, i) in sections" :key="i" class="np-field">
        <label>板块 {{ i + 1 }}</label>
        <input v-model="sec.heading" type="text" placeholder="板块标题" />
        <textarea v-model="sec.content" rows="3" placeholder="输入内容……" />
      </div>
    </div>

    <div v-else class="np-paper-wrap">
      <div class="np-paper">
        <span v-for="(d, i) in decorations" :key="i" class="np-deco"
          :style="{ top: `${8 + (i % 4) * 22}%`, [i % 2 === 0 ? 'right' : 'left']: '6px' }">{{ d }}</span>
        <h2 class="np-paper-title">{{ title }}</h2>
        <p class="np-paper-badge">{{ currentTemplate?.icon }} {{ currentTemplate?.label }}</p>
        <div class="np-sections">
          <div v-for="(sec, i) in sections" :key="i" class="np-section">
            <div class="np-section-head">
              <span class="np-num">{{ i + 1 }}</span>
              <h3>{{ sec.heading }}</h3>
            </div>
            <div class="np-illustration">
              <span v-for="(d, j) in decorations.slice(i * 3, i * 3 + 3)" :key="j">{{ d }}</span>
            </div>
            <p class="np-content">{{ sec.content }}</p>
          </div>
        </div>
        <div class="np-footer">
          <span>✏️ 作者：___________</span>
          <span>📅 日期：___________</span>
        </div>
      </div>
    </div>

    <div class="np-actions">
      <button class="np-btn primary" @click="isPreview = !isPreview">
        {{ isPreview ? '✏️ 返回编辑' : '👁 预览小报' }}
      </button>
      <button class="np-btn success" @click="saveToStorage">💾 保存</button>
      <button class="np-btn outline" @click="showSaved = !showSaved">
        📂 我的作品 ({{ savedList.length }})
      </button>
    </div>

    <div v-if="showSaved" class="np-saved">
      <h3>已保存的小报</h3>
      <div v-if="!savedList.length" class="np-empty">还没有保存过小报</div>
      <div v-for="(item, i) in savedList" :key="i" class="np-saved-item">
        <div>
          <strong>{{ item.title }}</strong>
          <span class="np-saved-time">{{ item.savedAt }}</span>
        </div>
        <div class="np-saved-btns">
          <button class="np-btn sm" @click="loadItem(item)">加载</button>
          <button class="np-btn danger sm" @click="deleteItem(i)">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.newspaper { max-width: 800px; margin: 0 auto; padding: var(--space-6); }
.np-header { text-align: center; margin-bottom: var(--space-6); }
.np-header h1 { font-size: var(--text-2xl); color: var(--text-primary); margin-bottom: var(--space-2); }
.np-subtitle { color: var(--text-secondary); font-size: var(--text-sm); }

.np-templates { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-3); margin-bottom: var(--space-6); }
.np-tpl { display: flex; flex-direction: column; align-items: center; gap: var(--space-1); padding: var(--space-4); background: var(--bg-card); border: 2px solid var(--border-color); border-radius: var(--radius-lg); cursor: pointer; transition: all var(--transition-fast); }
.np-tpl.active { border-color: var(--color-primary); background: rgba(99,102,241,.06); }
.np-tpl-icon { font-size: var(--text-2xl); }
.np-tpl-label { font-weight: 600; font-size: var(--text-sm); color: var(--text-primary); }
.np-tpl-desc { font-size: var(--text-xs); color: var(--text-tertiary); }

.np-editor { display: flex; flex-direction: column; gap: var(--space-4); margin-bottom: var(--space-6); }
.np-field { display: flex; flex-direction: column; gap: var(--space-2); }
.np-field label { font-size: var(--text-sm); font-weight: 600; color: var(--text-secondary); }
.np-field input, .np-field textarea { width: 100%; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-card); color: var(--text-primary); font-size: var(--text-base); resize: vertical; }
.np-field input:focus, .np-field textarea:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(99,102,241,.15); }

.np-paper-wrap { margin-bottom: var(--space-6); }
.np-paper { position: relative; padding: var(--space-8) var(--space-10); background: var(--bg-card); border: 3px double var(--color-primary-light); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); overflow: hidden; }
.np-deco { position: absolute; font-size: var(--text-lg); color: var(--color-primary-light); opacity: .25; font-weight: bold; }
.np-paper-title { text-align: center; font-size: var(--text-3xl); color: var(--color-primary-dark); margin-bottom: var(--space-1); border-bottom: 2px dashed var(--border-color); padding-bottom: var(--space-3); }
.np-paper-badge { text-align: center; font-size: var(--text-xs); color: var(--text-tertiary); margin-bottom: var(--space-6); }
.np-sections { display: flex; flex-direction: column; gap: var(--space-6); }
.np-section { background: var(--bg-hover); border-radius: var(--radius-lg); padding: var(--space-4); border-left: 4px solid var(--color-primary); }
.np-section-head { display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2); }
.np-num { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: var(--radius-full); background: var(--color-primary); color: var(--text-inverse); font-size: var(--text-xs); font-weight: 700; flex-shrink: 0; }
.np-section-head h3 { font-size: var(--text-lg); color: var(--text-primary); }
.np-illustration { display: flex; gap: var(--space-4); padding: var(--space-2) 0; font-size: var(--text-xl); color: var(--color-secondary); opacity: .6; }
.np-content { font-size: var(--text-sm); color: var(--text-primary); line-height: var(--leading-relaxed); white-space: pre-wrap; }
.np-footer { display: flex; justify-content: space-between; margin-top: var(--space-8); padding-top: var(--space-4); border-top: 2px dashed var(--border-color); font-size: var(--text-sm); color: var(--text-tertiary); }

.np-actions { display: flex; gap: var(--space-3); flex-wrap: wrap; margin-bottom: var(--space-6); }
.np-btn { padding: var(--space-2) var(--space-4); border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 600; cursor: pointer; transition: all var(--transition-fast); border: 1px solid transparent; background: var(--bg-hover); color: var(--text-primary); }
.np-btn.primary { background: var(--color-primary); color: var(--text-inverse); }
.np-btn.primary:hover { background: var(--color-primary-dark); }
.np-btn.success { background: var(--color-success); color: var(--text-inverse); }
.np-btn.outline { border-color: var(--border-color); background: transparent; }
.np-btn.danger { background: rgba(239,68,68,.1); color: var(--color-error); }
.np-btn.sm { padding: var(--space-1) var(--space-3); font-size: var(--text-xs); }

.np-saved { background: var(--bg-card); border-radius: var(--radius-lg); padding: var(--space-4); box-shadow: var(--shadow-sm); }
.np-saved h3 { font-size: var(--text-lg); margin-bottom: var(--space-3); }
.np-empty { text-align: center; color: var(--text-tertiary); padding: var(--space-6); font-size: var(--text-sm); }
.np-saved-item { display: flex; justify-content: space-between; align-items: center; padding: var(--space-3) 0; border-bottom: 1px solid var(--border-color-light); }
.np-saved-item:last-child { border-bottom: none; }
.np-saved-time { display: block; font-size: var(--text-xs); color: var(--text-tertiary); margin-top: 2px; }
.np-saved-btns { display: flex; gap: var(--space-2); }
</style>
