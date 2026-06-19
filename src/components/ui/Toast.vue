<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface ToastOptions {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const toasts = ref<Array<ToastOptions & { id: number }>>([])
let nextId = 0

function show(options: ToastOptions) {
  const id = nextId++
  const toast = { ...options, id }
  toasts.value.push(toast)

  const duration = options.duration || 3000
  setTimeout(() => {
    remove(id)
  }, duration)
}

function remove(id: number) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

defineExpose({ show })
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type || 'info'}`"
          @click="remove(toast.id)"
        >
          <span class="toast__icon">
            {{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : toast.type === 'warning' ? '⚠' : 'ℹ' }}
          </span>
          <span class="toast__message">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: var(--space-6);
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  pointer-events: auto;
  min-width: 200px;
  max-width: 400px;
}

.toast__icon {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  flex-shrink: 0;
}

.toast--success .toast__icon {
  background: var(--color-success);
  color: white;
}

.toast--error .toast__icon {
  background: var(--color-error);
  color: white;
}

.toast--warning .toast__icon {
  background: var(--color-warning);
  color: white;
}

.toast--info .toast__icon {
  background: var(--color-info);
  color: white;
}

.toast__message {
  flex: 1;
  color: var(--text-primary);
  font-size: var(--text-sm);
}

.toast-enter-active,
.toast-leave-active {
  transition: all var(--transition-normal);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-move {
  transition: transform var(--transition-normal);
}
</style>
