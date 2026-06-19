<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  src: string
  alt?: string
  width?: number | string
  height?: number | string
  placeholder?: string
}>()

const loaded = ref(false)
const error = ref(false)
const imgRef = ref<HTMLImageElement | null>(null)

const isVisible = ref(false)

function handleLoad() {
  loaded.value = true
}

function handleError() {
  error.value = true
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer.disconnect()
        }
      })
    },
    { rootMargin: '100px' }
  )

  if (imgRef.value) {
    observer.observe(imgRef.value)
  }
})
</script>

<template>
  <div ref="imgRef" class="lazy-image" :style="{ width, height }">
    <div v-if="!loaded && !error" class="lazy-image__placeholder">
      <slot name="placeholder">
        <div class="lazy-image__loading"></div>
      </slot>
    </div>
    <img
      v-if="isVisible && !error"
      :src="src"
      :alt="alt"
      class="lazy-image__img"
      :class="{ 'lazy-image__img--loaded': loaded }"
      @load="handleLoad"
      @error="handleError"
    />
    <div v-if="error" class="lazy-image__error">
      <slot name="error">
        <span>图片加载失败</span>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.lazy-image {
  position: relative;
  overflow: hidden;
  background: var(--bg-hover);
  border-radius: var(--radius-md);
}

.lazy-image__placeholder,
.lazy-image__error {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lazy-image__loading {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
}

.lazy-image__error {
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}

.lazy-image__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.lazy-image__img--loaded {
  opacity: 1;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
