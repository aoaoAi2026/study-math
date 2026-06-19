<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()
const isSearchOpen = ref(false)
const searchQuery = ref('')

const navItems = [
  { path: '/', icon: '🏠', label: '首页' },
  { path: '/map', icon: '🗺️', label: '知识地图' },
  { path: '/learning', icon: '📚', label: '学习' },
  { path: '/games', icon: '🎮', label: '游戏' },
  { path: '/tools', icon: '🛠️', label: '教具' }
]

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
    isSearchOpen.value = false
  }
}

function toggleTheme() {
  const themes = ['light', 'dark', 'space', 'ocean', 'magic', 'martial', 'eye-care']
  const current = document.documentElement.dataset.theme || 'light'
  const next = themes[(themes.indexOf(current) + 1) % themes.length]
  document.documentElement.dataset.theme = next
  localStorage.setItem('theme', next)
}
</script>

<template>
  <header class="top-nav">
    <div class="top-nav__left">
      <router-link to="/" class="top-nav__logo">
        <span class="top-nav__logo-icon">📐</span>
        <span class="top-nav__logo-text">数学宝典</span>
      </router-link>
    </div>

    <div class="top-nav__center">
      <div v-if="isSearchOpen" class="top-nav__search">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索知识点、游戏..."
          class="top-nav__search-input"
          @keyup.enter="handleSearch"
        />
        <button class="top-nav__search-close" @click="isSearchOpen = false">✕</button>
      </div>
    </div>

    <div class="top-nav__right">
      <button class="top-nav__icon-btn" @click="isSearchOpen = true" title="搜索">
        🔍
      </button>
      <button class="top-nav__icon-btn" @click="toggleTheme" title="切换主题">
        🎨
      </button>
      <router-link to="/profile" class="top-nav__avatar">
        <span>{{ userStore.nickname?.[0] || '我' }}</span>
      </router-link>
    </div>
  </header>
</template>

<style scoped>
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--topnav-height);
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-4);
  z-index: var(--z-sticky);
}

.top-nav__left,
.top-nav__right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.top-nav__logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-primary);
  font-weight: 600;
  font-size: var(--text-lg);
}

.top-nav__logo-icon {
  font-size: var(--text-xl);
}

.top-nav__search {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.top-nav__search-input {
  width: 300px;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
}

.top-nav__search-close {
  color: var(--text-secondary);
  padding: var(--space-1);
}

.top-nav__icon-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
  transition: background var(--transition-fast);
}

.top-nav__icon-btn:hover {
  background: var(--bg-hover);
}

.top-nav__avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: var(--text-inverse);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

@media (max-width: 768px) {
  .top-nav__logo-text {
    display: none;
  }

  .top-nav__search-input {
    width: 200px;
  }
}
</style>
