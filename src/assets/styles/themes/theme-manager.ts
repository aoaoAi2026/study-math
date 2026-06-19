import { ref, watchEffect } from 'vue'

/** 主题名称 */
export type ThemeName =
  | 'default-blue'
  | 'forest-green'
  | 'sunset-orange'
  | 'starry-purple'
  | 'ocean-cyan'
  | 'sakura-pink'

/** 单个主题的 CSS 变量集合 */
export interface ThemeVariables {
  '--color-primary': string
  '--color-primary-light': string
  '--color-primary-dark': string
  '--color-success': string
  '--color-warning': string
  '--color-danger': string
  '--bg-card': string
  '--bg-hover': string
  '--text-primary': string
  '--text-secondary': string
}

/** 主题元信息 + 变量 */
export interface ThemeConfig {
  name: ThemeName
  label: string
  description: string
  variables: ThemeVariables
}

/* ===================== 6 套主题定义 ===================== */

export const themes: Record<ThemeName, ThemeConfig> = {
  'default-blue': {
    name: 'default-blue',
    label: '默认蓝',
    description: '经典清爽的蓝色主题',
    variables: {
      '--color-primary': '#6366f1',
      '--color-primary-light': '#818cf8',
      '--color-primary-dark': '#4f46e5',
      '--color-success': '#10b981',
      '--color-warning': '#f59e0b',
      '--color-danger': '#ef4444',
      '--bg-card': '#ffffff',
      '--bg-hover': '#f1f5f9',
      '--text-primary': '#1e293b',
      '--text-secondary': '#64748b',
    },
  },

  'forest-green': {
    name: 'forest-green',
    label: '森林绿',
    description: '自然清新的绿色主题',
    variables: {
      '--color-primary': '#16a34a',
      '--color-primary-light': '#4ade80',
      '--color-primary-dark': '#15803d',
      '--color-success': '#22c55e',
      '--color-warning': '#eab308',
      '--color-danger': '#dc2626',
      '--bg-card': '#ffffff',
      '--bg-hover': '#f0fdf4',
      '--text-primary': '#14532d',
      '--text-secondary': '#4d7c0f',
    },
  },

  'sunset-orange': {
    name: 'sunset-orange',
    label: '落日橙',
    description: '温暖活力的橙色主题',
    variables: {
      '--color-primary': '#ea580c',
      '--color-primary-light': '#fb923c',
      '--color-primary-dark': '#c2410c',
      '--color-success': '#16a34a',
      '--color-warning': '#f59e0b',
      '--color-danger': '#dc2626',
      '--bg-card': '#ffffff',
      '--bg-hover': '#fff7ed',
      '--text-primary': '#431407',
      '--text-secondary': '#9a3412',
    },
  },

  'starry-purple': {
    name: 'starry-purple',
    label: '星空紫',
    description: '神秘优雅的紫色主题',
    variables: {
      '--color-primary': '#9333ea',
      '--color-primary-light': '#c084fc',
      '--color-primary-dark': '#7e22ce',
      '--color-success': '#10b981',
      '--color-warning': '#f59e0b',
      '--color-danger': '#ef4444',
      '--bg-card': '#ffffff',
      '--bg-hover': '#faf5ff',
      '--text-primary': '#3b0764',
      '--text-secondary': '#7e22ce',
    },
  },

  'ocean-cyan': {
    name: 'ocean-cyan',
    label: '海洋青',
    description: '宁静深邃的青色主题',
    variables: {
      '--color-primary': '#0891b2',
      '--color-primary-light': '#22d3ee',
      '--color-primary-dark': '#0e7490',
      '--color-success': '#14b8a6',
      '--color-warning': '#f59e0b',
      '--color-danger': '#ef4444',
      '--bg-card': '#ffffff',
      '--bg-hover': '#ecfeff',
      '--text-primary': '#164e63',
      '--text-secondary': '#0e7490',
    },
  },

  'sakura-pink': {
    name: 'sakura-pink',
    label: '樱花粉',
    description: '温柔浪漫的粉色主题',
    variables: {
      '--color-primary': '#ec4899',
      '--color-primary-light': '#f9a8d4',
      '--color-primary-dark': '#db2777',
      '--color-success': '#10b981',
      '--color-warning': '#f59e0b',
      '--color-danger': '#ef4444',
      '--bg-card': '#ffffff',
      '--bg-hover': '#fdf2f8',
      '--text-primary': '#500724',
      '--text-secondary': '#9d174d',
    },
  },
}

const STORAGE_KEY = 'app_theme'

/* ===================== 主题管理 Composable ===================== */

export function useTheme() {
  /** 当前主题名称（响应式） */
  const currentTheme = ref<ThemeName>('default-blue')

  /** 将 CSS 变量写入 <html> 根元素 */
  function applyThemeToDOM(vars: ThemeVariables) {
    const root = document.documentElement
    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value)
    }
  }

  /** 设置主题 */
  function setTheme(name: ThemeName) {
    if (!themes[name]) return
    currentTheme.value = name
    applyThemeToDOM(themes[name].variables)
    try {
      localStorage.setItem(STORAGE_KEY, name)
    } catch {
      // localStorage 不可用时静默忽略
    }
  }

  /** 获取当前主题配置 */
  function getCurrentTheme(): ThemeConfig {
    return themes[currentTheme.value]
  }

  /** 获取所有主题列表 */
  function getAllThemes(): ThemeConfig[] {
    return Object.values(themes)
  }

  /** 初始化：从 localStorage 恢复主题 */
  function initTheme() {
    let saved: ThemeName | null = null
    try {
      saved = localStorage.getItem(STORAGE_KEY) as ThemeName | null
    } catch {
      // ignore
    }
    if (saved && themes[saved]) {
      currentTheme.value = saved
    }
    applyThemeToDOM(themes[currentTheme.value].variables)
  }

  // 自动初始化
  watchEffect(() => {
    initTheme()
  })

  return {
    currentTheme,
    setTheme,
    getCurrentTheme,
    getAllThemes,
  }
}
