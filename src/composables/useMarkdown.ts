import { ref, onMounted } from 'vue'
import { marked } from 'marked'
import { loadTopic } from '@/services/contentLoader'
import type { KnowledgeTopic } from '@/types/content'

marked.setOptions({ breaks: true, gfm: true })

export function useMarkdown(id: string) {
  const topic = ref<KnowledgeTopic | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  onMounted(async () => {
    try {
      topic.value = await loadTopic(id)
    } catch (e: any) {
      error.value = e.message || '加载失败'
    } finally {
      loading.value = false
    }
  })

  function render(md: string): string {
    try { return marked.parse(md) as string }
    catch { return md }
  }

  return { topic, loading, error, render }
}

export { marked }
