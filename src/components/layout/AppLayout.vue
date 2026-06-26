<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isMobile = ref(false)

// 检测移动端
if (typeof window !== 'undefined') {
  isMobile.value = window.innerWidth < 768
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768
  })
}

// 主导航项
const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/learning', label: '知识地图', icon: '📚' },
  { path: '/games', label: '游戏乐园', icon: '🎮' },
  { path: '/challenge/daily', label: '每日挑战', icon: '⚡' },
  { path: '/parent-academy', label: '家长学院', icon: '👨‍👩‍👧' },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const mainNavPaths = ['/', '/learning', '/games', '/challenge/daily', '/profile', '/question-bank', '/exam', '/tools', '/diagnosis', '/workshop', '/newspaper', '/parent-academy', '/parent-dashboard']
const showBackButton = computed(() => {
  if (route.meta?.hideBack) return false
  return !mainNavPaths.includes(route.path)
})

// 返回上一页
function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

// 等级显示
const levelInfo = computed(() => {
  const level = userStore.level || 1
  const exp = userStore.experience || 0
  const needed = level * 100
  const pct = Math.min(100, Math.floor((exp % needed / needed) * 100))
  return { level, exp, pct, nextLevel: level + 1 }
})
</script>

<template>
  <div class="app-layout">
    <!-- 顶部导航 -->
    <header class="top-nav" v-if="!route.meta?.hideTopNav">
      <div class="top-nav__inner">
        <!-- 返回按钮 -->
        <button 
          v-if="showBackButton"
          class="top-nav__back"
          @click="goBack"
        >
          ←
        </button>
        
        <!-- Logo 区域 -->
        <router-link to="/" class="top-nav__brand" :class="{ 'top-nav__brand--with-back': showBackButton }">
          <span class="top-nav__logo">🧮</span>
          <div class="top-nav__logo-text">
            <span class="top-nav__title">数学宝典</span>
            <span class="top-nav__subtitle">边玩边学</span>
          </div>
        </router-link>

        <!-- 桌面端导航 -->
        <nav class="top-nav__menu" v-if="!isMobile">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="top-nav__link"
            :class="{ 'top-nav__link--active': isActive(item.path) }"
          >
            <span class="top-nav__link-icon">{{ item.icon }}</span>
            <span class="top-nav__link-text">{{ item.label }}</span>
          </router-link>
        </nav>

        <!-- 右侧用户区域 -->
        <div class="top-nav__user">
          <!-- 等级徽章 -->
          <div class="top-nav__level" v-if="!isMobile">
            <div class="top-nav__level-avatar">🦉</div>
            <div class="top-nav__level-info">
              <span class="top-nav__level-name">{{ userStore.nickname || '小数学家' }}</span>
              <div class="top-nav__level-bar">
                <div class="top-nav__level-fill" :style="{ width: levelInfo.pct + '%' }"></div>
                <span class="top-nav__level-text">Lv.{{ levelInfo.level }}</span>
              </div>
            </div>
          </div>

          <!-- 移动用户头像 -->
          <router-link to="/profile" class="top-nav__avatar" v-if="isMobile">
            🦉
          </router-link>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="app-layout__main" :class="{ 'app-layout__main--full': route.meta?.hideTopNav }">
      <RouterView />
    </main>

    <!-- 移动端底部导航 -->
    <nav class="bottom-nav" v-if="isMobile && !route.meta?.hideBottomNav">
      <router-link to="/" class="bottom-nav__item" :class="{ 'bottom-nav__item--active': route.path === '/' }">
        <span class="bottom-nav__icon">🏠</span>
        <span class="bottom-nav__text">首页</span>
      </router-link>
      <router-link to="/learning" class="bottom-nav__item" :class="{ 'bottom-nav__item--active': route.path.startsWith('/learning') }">
        <span class="bottom-nav__icon">📚</span>
        <span class="bottom-nav__text">学习</span>
      </router-link>
      <router-link to="/games" class="bottom-nav__item bottom-nav__item--center">
        <span class="bottom-nav__icon bottom-nav__icon--big">🎮</span>
      </router-link>
      <router-link to="/challenge/daily" class="bottom-nav__item" :class="{ 'bottom-nav__item--active': route.path.startsWith('/challenge') }">
        <span class="bottom-nav__icon">⚡</span>
        <span class="bottom-nav__text">挑战</span>
      </router-link>
      <router-link to="/profile" class="bottom-nav__item" :class="{ 'bottom-nav__item--active': route.path.startsWith('/profile') }">
        <span class="bottom-nav__icon">🦉</span>
        <span class="bottom-nav__text">我的</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* === 顶部导航 === */
.top-nav {
  background: var(--bg-card);
  border-bottom: 3px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.top-nav__inner {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

/* 返回按钮 */
.top-nav__back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  border: none;
  background: var(--bg-hover);
  color: var(--text-secondary);
  font-size: 1.25rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.top-nav__back:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

/* Logo */
.top-nav__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  flex-shrink: 0;
}

.top-nav__brand--with-back {
  margin-left: -1rem;
}

.top-nav__logo {
  font-size: 2.25rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: white;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.25);
  transition: transform var(--transition-fast);
}

.top-nav__brand:hover .top-nav__logo {
  transform: rotate(-10deg) scale(1.1);
}

.top-nav__logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.top-nav__title {
  font-size: var(--text-xl);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.top-nav__subtitle {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

/* 菜单项 */
.top-nav__menu {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
  justify-content: center;
}

.top-nav__link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: var(--text-sm);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.top-nav__link:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.top-nav__link--active {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.top-nav__link-icon {
  font-size: 1.1rem;
}

/* 用户区域 */
.top-nav__user {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.top-nav__level {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: var(--card-yellow-bg);
  border-radius: var(--radius-full);
  transition: transform var(--transition-fast);
}

.top-nav__level:hover {
  transform: scale(1.03);
}

.top-nav__level-avatar {
  font-size: 1.5rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
}

.top-nav__level-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.top-nav__level-name {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--card-yellow-text);
}

.top-nav__level-bar {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 2px;
}

.top-nav__level-fill {
  width: 60px;
  height: 6px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-warning));
  border-radius: var(--radius-full);
  transition: width var(--transition-normal);
}

.top-nav__level-text {
  font-size: 0.7rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.top-nav__avatar {
  font-size: 1.75rem;
  text-decoration: none;
}

/* 主内容 */
.app-layout__main {
  flex: 1;
  padding: 3.5rem var(--content-padding) 2rem;
  padding-bottom: calc(var(--content-padding) + var(--bottomnav-height) + 1rem);
  max-width: var(--content-max-width);
  margin: 0 auto;
  width: 100%;
}

.app-layout__main--full {
  padding: 0;
  max-width: 100%;
}

/* === 移动端底部导航 === */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-card);
  border-top: 3px solid var(--border-color);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.5rem 0.25rem;
  padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
  z-index: 100;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 0.4rem 0.6rem;
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--text-tertiary);
  flex: 1;
  transition: all var(--transition-fast);
}

.bottom-nav__item--active {
  color: var(--color-primary);
}

.bottom-nav__item--active .bottom-nav__icon {
  transform: scale(1.15);
}

.bottom-nav__icon {
  font-size: 1.3rem;
  transition: transform var(--transition-fast);
}

.bottom-nav__text {
  font-size: 0.7rem;
  font-weight: 600;
}

/* 中间游戏按钮 - 突出显示 */
.bottom-nav__item--center {
  position: relative;
  flex: 0 0 auto;
}

.bottom-nav__item--center .bottom-nav__icon--big {
  background: linear-gradient(135deg, var(--color-primary), var(--color-warning));
  color: white;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-2xl);
  font-size: 1.5rem;
  margin-top: -16px;
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.35);
  border: 4px solid var(--bg-card);
}

/* 桌面端隐藏底部导航 */
@media (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
  .app-layout__main {
    padding-bottom: 3rem;
  }
}
</style>
