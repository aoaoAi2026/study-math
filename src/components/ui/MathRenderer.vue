<script setup lang="ts">
import katex from 'katex'
import { computed, onMounted, ref, onBeforeUpdate } from 'vue'

const props = defineProps<{ text: string }>()
const root = ref<HTMLDivElement>()

const blocks = computed(() => {
  const out: Array<{ type: 'text' | 'math'; value: string; display?: boolean }> = []
  const pattern = /(\$\$[\s\S]+?\$\$|\$[^$\n]+\$)/g
  let last = 0, m: RegExpExecArray | null
  while ((m = pattern.exec(props.text))) {
    if (m.index > last) out.push({ type: 'text', value: props.text.slice(last, m.index) })
    const raw = m[0]
    const isBlock = raw.startsWith('$$')
    const expr = isBlock ? raw.slice(2, -2) : raw.slice(1, -1)
    out.push({ type: 'math', value: expr, display: isBlock })
    last = m.index + raw.length
  }
  if (last < props.text.length) out.push({ type: 'text', value: props.text.slice(last) })
  return out
})

function renderMath(el: HTMLElement, expr: string, display?: boolean) {
  try {
    el.innerHTML = katex.renderToString(expr, { displayMode: !!display, throwOnError: false })
  } catch {
    el.textContent = expr
  }
}

onMounted(() => mountEls())
onBeforeUpdate(() => mountEls())

function mountEls() {
  if (!root.value) return
  root.value.querySelectorAll<HTMLElement>('[data-math]').forEach(el => {
    renderMath(el, el.dataset.math || '', el.dataset.display === '1')
  })
}
</script>

<template>
  <span class="math-renderer" ref="root">
    <template v-for="(b,i) in blocks" :key="i">
      <template v-if="b.type==='text'">{{ b.value }}</template>
      <span v-else :data-math="b.value" :data-display="b.display?1:0"></span>
    </template>
  </span>
</template>

<style scoped>
.math-renderer :deep(.katex) { font-size: 1.05em; }
</style>
