import { ref, watchEffect } from 'vue'

/** 主题名称 */
export type ThemeName =
  | 'default-blue'
  | 'forest-green'
  | 'sunset-orange'
  | 'starry-purple'
  | 'ocean-cyan'
  | 'sakura-pink'
  | 'dark-mode'

/** 单个主题的 CSS 变量集合 */
export interface ThemeVariables {
  '--color-primary': string
  '--color-primary-light': string
  '--color-primary-dark': string
  '--color-primary-soft': string
  '--color-success': string
  '--color-warning': string
  '--color-danger': string
  '--bg-page': string
  '--bg-page-gradient': string
  '--bg-card': string
  '--bg-hover': string
  '--text-primary': string
  '--text-secondary': string
  '--text-muted': string
  '--border-color': string
  '--border-color-strong': string
  '--shadow-xs': string
  '--shadow-sm': string
  '--shadow-md': string
  '--shadow-lg': string
  '--shadow-primary': string
  '--card-orange-bg': string
  '--card-orange-text': string
  '--card-pink-bg': string
  '--card-pink-text': string
  '--card-blue-bg': string
  '--card-blue-text': string
  '--card-green-bg': string
  '--card-green-text': string
  '--card-yellow-bg': string
  '--card-yellow-text': string
  '--card-purple-bg': string
  '--card-purple-text': string
  '--card-red-bg': string
  '--card-red-text': string
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
  'dark-mode': {
    name: 'dark-mode',
    label: '夜间模式',
    description: '护眼深色主题，保护视力',
    variables: {
      '--color-primary': '#6366f1',
      '--color-primary-light': '#818cf8',
      '--color-primary-dark': '#4f46e5',
      '--color-primary-soft': 'rgba(99, 102, 241, 0.15)',
      '--color-success': '#10b981',
      '--color-warning': '#f59e0b',
      '--color-danger': '#ef4444',
      '--bg-page': '#0d0d0d',
      '--bg-page-gradient': 'linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 50%, #0d0d0d 100%)',
      '--bg-card': '#1a1a1a',
      '--bg-hover': '#252525',
      '--text-primary': '#f1f1f1',
      '--text-secondary': '#a1a1aa',
      '--text-muted': '#71717a',
      '--border-color': '#2a2a2a',
      '--border-color-strong': '#3a3a3a',
      '--shadow-xs': '0 1px 2px rgba(0, 0, 0, 0.3)',
      '--shadow-sm': '0 2px 6px rgba(0, 0, 0, 0.4)',
      '--shadow-md': '0 6px 18px rgba(0, 0, 0, 0.5)',
      '--shadow-lg': '0 12px 32px rgba(0, 0, 0, 0.6)',
      '--shadow-primary': '0 4px 20px rgba(99, 102, 241, 0.35)',
      '--card-orange-bg': '#2d1f14',
      '--card-orange-text': '#ffb07c',
      '--card-pink-bg': '#2d1422',
      '--card-pink-text': '#f9a8d4',
      '--card-blue-bg': '#14202d',
      '--card-blue-text': '#93c5fd',
      '--card-green-bg': '#142d22',
      '--card-green-text': '#6ee7b7',
      '--card-yellow-bg': '#2d2814',
      '--card-yellow-text': '#fcd34d',
      '--card-purple-bg': '#22142d',
      '--card-purple-text': '#c4b5fd',
      '--card-red-bg': '#2d1414',
      '--card-red-text': '#fca5a5',
    },
  },

  'default-blue': {
    name: 'default-blue',
    label: '默认蓝',
    description: '经典清爽的蓝色主题',
    variables: {
      '--color-primary': '#6366f1',
      '--color-primary-light': '#818cf8',
      '--color-primary-dark': '#4f46e5',
      '--color-primary-soft': 'rgba(99, 102, 241, 0.08)',
      '--color-success': '#10b981',
      '--color-warning': '#f59e0b',
      '--color-danger': '#ef4444',
      '--bg-page': '#f8fafc',
      '--bg-page-gradient': 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      '--bg-card': '#ffffff',
      '--bg-hover': '#f1f5f9',
      '--text-primary': '#1e293b',
      '--text-secondary': '#64748b',
      '--text-muted': '#94a3b8',
      '--border-color': '#e2e8f0',
      '--border-color-strong': '#cbd5e1',
      '--shadow-xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
      '--shadow-sm': '0 2px 6px rgba(0, 0, 0, 0.06)',
      '--shadow-md': '0 6px 18px rgba(0, 0, 0, 0.08)',
      '--shadow-lg': '0 12px 32px rgba(0, 0, 0, 0.1)',
      '--shadow-primary': '0 4px 20px rgba(99, 102, 241, 0.35)',
      '--card-orange-bg': '#fff7ed',
      '--card-orange-text': '#ea580c',
      '--card-pink-bg': '#fdf2f8',
      '--card-pink-text': '#ec4899',
      '--card-blue-bg': '#eff6ff',
      '--card-blue-text': '#3b82f6',
      '--card-green-bg': '#f0fdf4',
      '--card-green-text': '#22c55e',
      '--card-yellow-bg': '#fffbeb',
      '--card-yellow-text': '#f59e0b',
      '--card-purple-bg': '#faf5ff',
      '--card-purple-text': '#8b5cf6',
      '--card-red-bg': '#fef2f2',
      '--card-red-text': '#dc2626',
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
      '--color-primary-soft': 'rgba(22, 163, 74, 0.08)',
      '--color-success': '#22c55e',
      '--color-warning': '#eab308',
      '--color-danger': '#dc2626',
      '--bg-page': '#f0fdf4',
      '--bg-page-gradient': 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      '--bg-card': '#ffffff',
      '--bg-hover': '#f0fdf4',
      '--text-primary': '#14532d',
      '--text-secondary': '#4d7c0f',
      '--text-muted': '#65a30d',
      '--border-color': '#dcfce7',
      '--border-color-strong': '#bbf7d0',
      '--shadow-xs': '0 1px 2px rgba(22, 163, 74, 0.05)',
      '--shadow-sm': '0 2px 6px rgba(22, 163, 74, 0.06)',
      '--shadow-md': '0 6px 18px rgba(22, 163, 74, 0.08)',
      '--shadow-lg': '0 12px 32px rgba(22, 163, 74, 0.1)',
      '--shadow-primary': '0 4px 20px rgba(22, 163, 74, 0.35)',
      '--card-orange-bg': '#fff7ed',
      '--card-orange-text': '#ea580c',
      '--card-pink-bg': '#fdf2f8',
      '--card-pink-text': '#ec4899',
      '--card-blue-bg': '#eff6ff',
      '--card-blue-text': '#3b82f6',
      '--card-green-bg': '#dcfce7',
      '--card-green-text': '#16a34a',
      '--card-yellow-bg': '#fffbeb',
      '--card-yellow-text': '#f59e0b',
      '--card-purple-bg': '#faf5ff',
      '--card-purple-text': '#8b5cf6',
      '--card-red-bg': '#fef2f2',
      '--card-red-text': '#dc2626',
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
      '--color-primary-soft': 'rgba(234, 88, 12, 0.08)',
      '--color-success': '#16a34a',
      '--color-warning': '#f59e0b',
      '--color-danger': '#dc2626',
      '--bg-page': '#fff7ed',
      '--bg-page-gradient': 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
      '--bg-card': '#ffffff',
      '--bg-hover': '#fff7ed',
      '--text-primary': '#431407',
      '--text-secondary': '#9a3412',
      '--text-muted': '#c2410c',
      '--border-color': '#ffedd5',
      '--border-color-strong': '#fed7aa',
      '--shadow-xs': '0 1px 2px rgba(234, 88, 12, 0.05)',
      '--shadow-sm': '0 2px 6px rgba(234, 88, 12, 0.06)',
      '--shadow-md': '0 6px 18px rgba(234, 88, 12, 0.08)',
      '--shadow-lg': '0 12px 32px rgba(234, 88, 12, 0.1)',
      '--shadow-primary': '0 4px 20px rgba(234, 88, 12, 0.35)',
      '--card-orange-bg': '#ffedd5',
      '--card-orange-text': '#ea580c',
      '--card-pink-bg': '#fdf2f8',
      '--card-pink-text': '#ec4899',
      '--card-blue-bg': '#eff6ff',
      '--card-blue-text': '#3b82f6',
      '--card-green-bg': '#f0fdf4',
      '--card-green-text': '#22c55e',
      '--card-yellow-bg': '#fffbeb',
      '--card-yellow-text': '#f59e0b',
      '--card-purple-bg': '#faf5ff',
      '--card-purple-text': '#8b5cf6',
      '--card-red-bg': '#fef2f2',
      '--card-red-text': '#dc2626',
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
      '--color-primary-soft': 'rgba(147, 51, 234, 0.08)',
      '--color-success': '#10b981',
      '--color-warning': '#f59e0b',
      '--color-danger': '#ef4444',
      '--bg-page': '#faf5ff',
      '--bg-page-gradient': 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
      '--bg-card': '#ffffff',
      '--bg-hover': '#faf5ff',
      '--text-primary': '#3b0764',
      '--text-secondary': '#7e22ce',
      '--text-muted': '#9333ea',
      '--border-color': '#f3e8ff',
      '--border-color-strong': '#e9d5ff',
      '--shadow-xs': '0 1px 2px rgba(147, 51, 234, 0.05)',
      '--shadow-sm': '0 2px 6px rgba(147, 51, 234, 0.06)',
      '--shadow-md': '0 6px 18px rgba(147, 51, 234, 0.08)',
      '--shadow-lg': '0 12px 32px rgba(147, 51, 234, 0.1)',
      '--shadow-primary': '0 4px 20px rgba(147, 51, 234, 0.35)',
      '--card-orange-bg': '#fff7ed',
      '--card-orange-text': '#ea580c',
      '--card-pink-bg': '#fdf2f8',
      '--card-pink-text': '#ec4899',
      '--card-blue-bg': '#eff6ff',
      '--card-blue-text': '#3b82f6',
      '--card-green-bg': '#f0fdf4',
      '--card-green-text': '#22c55e',
      '--card-yellow-bg': '#fffbeb',
      '--card-yellow-text': '#f59e0b',
      '--card-purple-bg': '#f3e8ff',
      '--card-purple-text': '#9333ea',
      '--card-red-bg': '#fef2f2',
      '--card-red-text': '#dc2626',
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
      '--color-primary-soft': 'rgba(8, 145, 178, 0.08)',
      '--color-success': '#14b8a6',
      '--color-warning': '#f59e0b',
      '--color-danger': '#ef4444',
      '--bg-page': '#ecfeff',
      '--bg-page-gradient': 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
      '--bg-card': '#ffffff',
      '--bg-hover': '#ecfeff',
      '--text-primary': '#164e63',
      '--text-secondary': '#0e7490',
      '--text-muted': '#0891b2',
      '--border-color': '#cffafe',
      '--border-color-strong': '#a5f3fc',
      '--shadow-xs': '0 1px 2px rgba(8, 145, 178, 0.05)',
      '--shadow-sm': '0 2px 6px rgba(8, 145, 178, 0.06)',
      '--shadow-md': '0 6px 18px rgba(8, 145, 178, 0.08)',
      '--shadow-lg': '0 12px 32px rgba(8, 145, 178, 0.1)',
      '--shadow-primary': '0 4px 20px rgba(8, 145, 178, 0.35)',
      '--card-orange-bg': '#fff7ed',
      '--card-orange-text': '#ea580c',
      '--card-pink-bg': '#fdf2f8',
      '--card-pink-text': '#ec4899',
      '--card-blue-bg': '#cffafe',
      '--card-blue-text': '#0891b2',
      '--card-green-bg': '#f0fdf4',
      '--card-green-text': '#22c55e',
      '--card-yellow-bg': '#fffbeb',
      '--card-yellow-text': '#f59e0b',
      '--card-purple-bg': '#faf5ff',
      '--card-purple-text': '#8b5cf6',
      '--card-red-bg': '#fef2f2',
      '--card-red-text': '#dc2626',
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
      '--color-primary-soft': 'rgba(236, 72, 153, 0.08)',
      '--color-success': '#10b981',
      '--color-warning': '#f59e0b',
      '--color-danger': '#ef4444',
      '--bg-page': '#fdf2f8',
      '--bg-page-gradient': 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
      '--bg-card': '#ffffff',
      '--bg-hover': '#fdf2f8',
      '--text-primary': '#500724',
      '--text-secondary': '#9d174d',
      '--text-muted': '#ec4899',
      '--border-color': '#fce7f3',
      '--border-color-strong': '#fbcfe8',
      '--shadow-xs': '0 1px 2px rgba(236, 72, 153, 0.05)',
      '--shadow-sm': '0 2px 6px rgba(236, 72, 153, 0.06)',
      '--shadow-md': '0 6px 18px rgba(236, 72, 153, 0.08)',
      '--shadow-lg': '0 12px 32px rgba(236, 72, 153, 0.1)',
      '--shadow-primary': '0 4px 20px rgba(236, 72, 153, 0.35)',
      '--card-orange-bg': '#fff7ed',
      '--card-orange-text': '#ea580c',
      '--card-pink-bg': '#fce7f3',
      '--card-pink-text': '#ec4899',
      '--card-blue-bg': '#eff6ff',
      '--card-blue-text': '#3b82f6',
      '--card-green-bg': '#f0fdf4',
      '--card-green-text': '#22c55e',
      '--card-yellow-bg': '#fffbeb',
      '--card-yellow-text': '#f59e0b',
      '--card-purple-bg': '#faf5ff',
      '--card-purple-text': '#8b5cf6',
      '--card-red-bg': '#fef2f2',
      '--card-red-text': '#dc2626',
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
    
    // 设置 data-theme 属性，使 CSS 主题文件生效
    document.documentElement.dataset.theme = name
    
    // 同时应用 CSS 变量
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
    
    // 设置 data-theme 属性
    document.documentElement.dataset.theme = currentTheme.value
    
    // 应用 CSS 变量
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
