<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TopNav from './TopNav.vue'
import Sidebar from './Sidebar.vue'
import BottomNav from './BottomNav.vue'

const route = useRoute()
const isMobile = computed(() => window.innerWidth < 768)
const showSidebar = computed(() => !route.meta?.hideSidebar && !isMobile.value)
const showBottomNav = computed(() => isMobile.value && !route.meta?.hideBottomNav)
</script>

<template>
  <div class="app-layout">
    <TopNav v-if="!route.meta?.hideTopNav" />
    <div class="app-layout__body">
      <Sidebar v-if="showSidebar" />
      <main class="app-layout__main">
        <slot />
      </main>
    </div>
    <BottomNav v-if="showBottomNav" />
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-layout__body {
  flex: 1;
  display: flex;
  padding-top: var(--topnav-height);
}

.app-layout__main {
  flex: 1;
  padding: var(--space-6);
  max-width: var(--content-max-width);
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .app-layout__main {
    padding: var(--space-4);
    padding-bottom: calc(var(--bottomnav-height) + var(--space-4));
  }
}
</style>
