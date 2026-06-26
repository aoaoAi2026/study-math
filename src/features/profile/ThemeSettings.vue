<script setup lang="ts">
import { useTheme } from '@/assets/styles/themes/theme-manager'
import type { ThemeName, ThemeConfig } from '@/assets/styles/themes/theme-manager'

const { currentTheme, setTheme, getAllThemes } = useTheme()
const themeList = getAllThemes()

function isActive(name: ThemeName): boolean {
  return currentTheme.value === name
}

function selectTheme(name: ThemeName) {
  setTheme(name)
}

/** 提取预览色块所需的关键色值 */
function previewColors(theme: ThemeConfig) {
  const v = theme.variables
  return {
    primary: v['--color-primary'],
    primaryLight: v['--color-primary-light'],
    primaryDark: v['--color-primary-dark'],
    success: v['--color-success'],
    warning: v['--color-warning'],
    danger: v['--color-danger'],
    bgCard: v['--bg-card'],
    text: v['--text-primary'],
  }
}
</script>

<template>
  <div class="theme-settings">
    <h2 class="page-title">主题设置</h2>
    <p class="page-desc">选择你喜欢的主题风格，切换后立即生效</p>

    <div class="theme-grid">
      <div
        v-for="theme in themeList"
        :key="theme.name"
        class="theme-card"
        :class="{ active: isActive(theme.name) }"
        @click="selectTheme(theme.name)"
      >
        <!-- 色块预览 -->
        <div class="color-preview" :style="{ background: previewColors(theme).bgCard }">
          <!-- 夜间模式特殊标识 -->
          <div v-if="theme.name === 'dark-mode'" class="dark-mode-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </div>
          <div class="color-bar">
            <span class="swatch" :style="{ background: previewColors(theme).primaryDark }"></span>
            <span class="swatch" :style="{ background: previewColors(theme).primary }"></span>
            <span class="swatch" :style="{ background: previewColors(theme).primaryLight }"></span>
          </div>
          <div class="color-bar">
            <span class="swatch" :style="{ background: previewColors(theme).success }"></span>
            <span class="swatch" :style="{ background: previewColors(theme).warning }"></span>
            <span class="swatch" :style="{ background: previewColors(theme).danger }"></span>
          </div>
          <div class="mock-text">
            <span class="mock-line primary" :style="{ background: previewColors(theme).primary, width: '60%' }"></span>
            <span class="mock-line secondary" :style="{ background: previewColors(theme).primaryLight, width: '40%' }"></span>
          </div>
        </div>
        <!-- 主题信息 -->
        <div class="theme-info">
          <span class="theme-label">{{ theme.label }}</span>
          <span class="theme-desc">{{ theme.description }}</span>
        </div>
        <!-- 选中标记 -->
        <div v-if="isActive(theme.name)" class="check-mark">&#10003;</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-settings {
  max-width: 700px;
  margin: 0 auto;
  padding: 16px;
}

.page-title {
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin-bottom: 4px;
}

.page-desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (min-width: 600px) {
  .theme-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.theme-card {
  position: relative;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  border: 2px solid var(--border-color);
  overflow: hidden;
  cursor: pointer;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.theme-card:hover {
  box-shadow: var(--shadow-md);
}

.theme-card.active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.color-preview {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-bar {
  display: flex;
  gap: 6px;
}

.swatch {
  flex: 1;
  height: 16px;
  border-radius: var(--radius-sm);
}

.dark-mode-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #fbbf24;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mock-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 4px;
}

.mock-line {
  height: 6px;
  border-radius: 3px;
  opacity: 0.7;
}

.theme-info {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.theme-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
}

.theme-desc {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.check-mark {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}
</style>
