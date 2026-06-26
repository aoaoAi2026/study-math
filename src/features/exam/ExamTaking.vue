<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loadQuestionBank } from '@/services/questionBankLoader'
import ExamPaperPrintView from './ExamPaperPrintView.vue'

const route = useRoute()
const router = useRouter()

const examId = computed(() => decodeURIComponent(String(route.params.examId || '')))

// 试卷信息（从题库元数据读取）
const paperInfo = ref({
  paperId: '',
  title: '',
  grade: 1,
  duration: 60,
  totalScore: 100,
  year: new Date().getFullYear(),
  sections: [
    { name: '一、填空题', count: 10, scorePerQuestion: 6 },
    { name: '二、解答题', count: 5, scorePerQuestion: 8 }
  ]
})

// 考试状态
const isStarted = ref(false)
const isPaused = ref(false)
const currentQuestion = ref(0)
const answers = ref<Record<string, string>>({})
const showResult = ref(false)
const loading = ref(true)
const showPrintView = ref(false)
const showPreview = ref(false)  // 新增：预览所有题目模式

const timeLeft = ref(60 * 60)
let timer: ReturnType<typeof setInterval> | null = null

const progress = computed(() => {
  if (!questions.value.length) return 0
  return ((currentQuestion.value + 1) / questions.value.length) * 100
})

const questions = ref<any[]>([])

// 计算实际得分
function computeScore() {
  let score = 0
  questions.value.forEach(q => {
    const ua = (answers.value[q.id] || '').trim()
    const correctAns = String(q.answer || '').trim()
    if (ua === correctAns) score += Number(q.score) || 0
  })
  return score
}

function correctCount() {
  let count = 0
  questions.value.forEach(q => {
    const ua = (answers.value[q.id] || '').trim()
    const correctAns = String(q.answer || '').trim()
    if (ua === correctAns) count++
  })
  return count
}

function isQuestionCorrect(q: any) {
  const ua = (answers.value[q.id] || '').trim()
  const correctAns = String(q.answer || '').trim()
  return ua === correctAns
}

function getUserAnswer(q: any) {
  return answers.value[q.id] || ''
}

// 获取SVG图像
function getQuestionSvg(q: any) {
  return q.svg || q.image || q.svgImage || ''
}

// 获取解析文本
function getSolutionText(q: any) {
  // solution可能是数组或字符串
  if (Array.isArray(q.solution)) {
    return q.solution.map((s: any) => {
      if (typeof s === 'string') return s
      return s.description || ''
    }).join(' ')
  }
  return q.solution || q.explanation || q.analysis || ''
}

// 加载试卷（支持 exam/ 目录下的考试真题 JSON）
async function loadExam(id: string) {
  loading.value = true
  try {
    // 优先从 exam/ 目录加载考试真题
    let bank = null
    try {
      const url = '/content/question-bank/exam/' + id + '.json'
      const resp = await fetch(url)
      if (resp.ok) {
        const data = await resp.json()
        if (data.questions && data.questions.length > 0) {
          bank = {
            title: data.title || id,
            grade: Number(data.grade) || 6,
            exercises: data.questions.map(function(q: any) {
              return {
                ...q,
                stem: q.stem || '',
                options: Array.isArray(q.options) ? q.options : undefined,
                answer: String(q.answer !== undefined && q.answer !== null ? q.answer : ''),
                solution: q.solution || '',
                svg: q.svg || q.image || '',
                difficulty: q.difficulty || 2
              }
            })
          }
          paperInfo.value = {
            paperId: data.paperId || id,
            title: data.title || id,
            grade: Number(data.grade) || 6,
            duration: Number(data.duration) || 90,
            totalScore: Number(data.totalScore) || 150,
            year: Number(data.year) || new Date().getFullYear(),
            sections: data.sections || []
          }
          questions.value = bank.exercises.slice(0, Math.min(20, bank.exercises.length))
          timeLeft.value = paperInfo.value.duration * 60
          loading.value = false
          return
        }
      }
    } catch (e) {
      console.error('加载考试真题失败:', e)
    }

    // 回退：尝试加载知识点题库
    bank = await loadQuestionBank(id, true)

    if (bank && bank.exercises && bank.exercises.length > 0) {
      const qList = bank.exercises.slice(0, Math.min(20, bank.exercises.length))
      const half = Math.ceil(qList.length * 0.6)
      qList.forEach(function(q: any, idx: number) {
        if (!q.score) q.score = idx < half ? 5 : 10
        if (!q.sectionNo) q.sectionNo = idx < half ? 1 : 2
      })

      paperInfo.value = {
        paperId: id,
        title: bank.title || id,
        grade: 3,
        duration: Math.max(45, qList.length * 5),
        totalScore: qList.reduce(function(s: number, q: any) { return s + (Number(q.score) || 0) }, 0),
        year: new Date().getFullYear(),
        sections: [
          { name: '一、填空题', count: half, scorePerQuestion: 5 },
          { name: '二、解答题', count: qList.length - half, scorePerQuestion: 10 }
        ]
      }
      questions.value = qList
      timeLeft.value = paperInfo.value.duration * 60
    } else {
      questions.value = []
    }
  } catch (e) {
    console.error('加载试卷失败:', e)
    questions.value = []
  } finally {
    loading.value = false
  }
}

// 开始考试
function startExam() {
  if (questions.value.length === 0) return
  isStarted.value = true
  startTimer()
}

function togglePause() {
  isPaused.value = !isPaused.value
  if (isPaused.value) stopTimer()
  else startTimer()
}

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--
    else submitExam()
  }, 1000)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function submitAnswer(qid: string, val: string) {
  answers.value[qid] = val
}

function nextQuestion() {
  if (currentQuestion.value < questions.value.length - 1)
    currentQuestion.value++
}

function prevQuestion() {
  if (currentQuestion.value > 0)
    currentQuestion.value--
}

function submitExam() {
  stopTimer()
  showResult.value = true
}

function goBack() {
  router.push('/exam')
}

function togglePrint() {
  showPrintView.value = !showPrintView.value
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(examId, (newId) => {
  if (newId) loadExam(newId)
})

onMounted(() => {
  if (examId.value) loadExam(examId.value)
})
</script>

<template>
  <!-- 打印视图 -->
  <ExamPaperPrintView
    v-if="showPrintView"
    :paper="paperInfo"
    :questions="questions"
    :userAnswers="answers"
    mode="blank"
    @close="showPrintView = false"
  />

  <!-- 考试界面 -->
  <div v-else class="exam-taking">
    <!-- 顶部操作栏 -->
    <header class="exam-header">
      <div class="exam-header__left">
        <button class="back-btn" @click="goBack">← 返回试卷列表</button>
        <h1 class="exam-title">{{ paperInfo.title || '考试' }}</h1>
      </div>
      <div class="exam-header__right">
        <div class="timer" :class="{ 'timer--warning': timeLeft < 300 && isStarted }">
          <span>⏱️ {{ Math.floor(timeLeft / 60) }}:{{ String(timeLeft % 60).padStart(2, '0') }}</span>
        </div>
        <button class="action-btn" @click="togglePrint">🖨️ 打印试卷</button>
        <button v-if="isStarted && !showResult" class="action-btn" @click="togglePause">
          {{ isPaused ? '继续' : '暂停' }}
        </button>
      </div>
    </header>

    <!-- 进度条 -->
    <div v-if="isStarted && !showResult" class="progress-bar">
      <div class="progress-bar__fill" :style="{ width: progress + '%' }"></div>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="empty-screen">
      <div class="spinner">📝</div>
      <p>正在加载试卷...</p>
    </div>

    <!-- 无试卷 -->
    <div v-else-if="questions.length === 0" class="empty-screen">
      <div class="spinner">📋</div>
      <h2>暂无该试卷</h2>
      <p>（ID: {{ examId }}）</p>
      <button class="back-btn-large" @click="goBack">返回试卷列表</button>
    </div>

    <!-- 开始页 -->
    <div v-else-if="!isStarted" class="start-screen">
      <div class="start-card">
        <div class="icon">📝</div>
        <h2>{{ paperInfo.title }}</h2>
        <div class="info-grid">
          <div class="info-item"><span>🕐</span><span>{{ paperInfo.duration }} 分钟</span></div>
          <div class="info-item"><span>📊</span><span>{{ paperInfo.totalScore }} 分</span></div>
          <div class="info-item"><span>📝</span><span>{{ questions.length }} 题</span></div>
          <div class="info-item"><span>🎓</span><span>{{ paperInfo.grade }}年级</span></div>
        </div>
        <div class="notice">
          <h3>📌 考试说明</h3>
          <ul>
            <li>请在规定时间内完成所有题目</li>
            <li>点击选项或输入答案后自动保存</li>
            <li>完成后点击「提交试卷」查看成绩</li>
            <li>可通过「打印试卷」导出 PDF 打印版</li>
          </ul>
        </div>
        <button class="start-btn" @click="startExam">开始考试 →</button>
        <button class="preview-btn" @click="showPreview = true">📖 预览所有题目</button>
      </div>
    </div>

    <!-- 暂停遮罩 -->
    <div v-if="isPaused && isStarted && !showResult" class="pause-overlay">
      <div class="pause-card">
        <div style="font-size: 3rem; margin-bottom: 1rem;">⏸️</div>
        <h2>考试已暂停</h2>
        <p>剩余时间：{{ Math.floor(timeLeft / 60) }}:{{ String(timeLeft % 60).padStart(2, '0') }}</p>
        <button class="start-btn" @click="togglePause">继续考试</button>
      </div>
    </div>

    <!-- 预览所有题目模式 -->
    <div v-if="showPreview" class="preview-mode">
      <div class="preview-header">
        <button class="back-btn" @click="showPreview = false">← 返回</button>
        <h1 class="preview-title">📖 {{ paperInfo.title }} - 题目预览</h1>
        <button class="action-btn" @click="togglePrint">🖨️ 打印试卷</button>
      </div>
      
      <div class="preview-content">
        <div
          v-for="(q, idx) in questions"
          :key="q.id"
          class="preview-question-card"
        >
          <div class="preview-question-header">
            <span class="preview-question-no">第 {{ idx + 1 }} 题</span>
            <span class="preview-question-type">{{ q.type === 'choice' ? '选择题' : '填空题' }}</span>
            <span class="preview-question-score">{{ q.score }} 分</span>
          </div>
          <div class="preview-question-stem">
            <div v-if="getQuestionSvg(q)" v-html="getQuestionSvg(q)" class="preview-question-svg"></div>
            <div v-html="q.stem"></div>
          </div>
          <div v-if="q.options && q.options.length > 0" class="preview-options">
            <div
              v-for="(opt, optIdx) in q.options"
              :key="optIdx"
              class="preview-option-item"
            >
              <span class="preview-option-letter">{{ ['A', 'B', 'C', 'D', 'E', 'F'][optIdx] }}</span>
              <span class="preview-option-text">{{ String(opt) }}</span>
            </div>
          </div>
          <div v-if="q.type === 'fill'" class="preview-fill-placeholder">
            （答案填写处）
          </div>
          <div v-if="q.solution" class="preview-solution">
            <strong>💡 参考答案：</strong>{{ q.answer }}
          </div>
        </div>
      </div>
    </div>

    <!-- 答题页 -->
    <div v-if="isStarted && !showResult && !isPaused" class="exam-content">
      <div class="question-card">
        <div class="question-header">
          <span class="question-no">第 {{ currentQuestion + 1 }} 题</span>
          <span class="question-type">{{ questions[currentQuestion]?.type === 'choice' ? '选择题' : '填空题' }}</span>
          <span class="question-score">本题 {{ questions[currentQuestion]?.score || 0 }} 分</span>
        </div>
        <div class="question-stem">
          <!-- SVG图形题 -->
          <div v-if="getQuestionSvg(questions[currentQuestion])" v-html="getQuestionSvg(questions[currentQuestion])" class="question-svg"></div>
          <div v-html="questions[currentQuestion]?.stem"></div>
        </div>

        <!-- 选择题 -->
        <div v-if="questions[currentQuestion]?.options && questions[currentQuestion]?.options.length > 0" class="options-list">
          <div
            v-for="(opt, idx) in questions[currentQuestion].options"
            :key="idx"
            class="option-item"
            :class="{ 'option-item--selected': answers[questions[currentQuestion].id] === String(idx) }"
            @click="submitAnswer(questions[currentQuestion].id, String(idx))"
          >
            <span class="option-letter">{{ ['A', 'B', 'C', 'D', 'E', 'F'][idx] }}</span>
            <span class="option-text">{{ String(opt) }}</span>
          </div>
        </div>

        <!-- 填空题 -->
        <div v-else class="fill-input-wrapper">
          <input
            type="text"
            :value="answers[questions[currentQuestion]?.id] || ''"
            @input="(e: Event) => submitAnswer(questions[currentQuestion].id, (e.target as HTMLInputElement).value)"
            placeholder="请输入你的答案..."
            class="fill-input"
          />
        </div>
      </div>

      <!-- 导航按钮 -->
      <div class="nav-buttons">
        <button class="nav-btn" :disabled="currentQuestion === 0" @click="prevQuestion">← 上一题</button>
        <div class="question-dots">
          <span
            v-for="(q, idx) in questions"
            :key="q.id"
            class="dot"
            :class="{
              'dot--current': idx === currentQuestion,
              'dot--answered': answers[q.id] !== undefined && answers[q.id] !== ''
            }"
            @click="currentQuestion = idx"
          ></span>
        </div>
        <button v-if="currentQuestion < questions.length - 1" class="nav-btn nav-btn-next" @click="nextQuestion">下一题 →</button>
        <button v-else class="nav-btn nav-btn-submit" @click="submitExam">📤 提交试卷</button>
      </div>
    </div>

    <!-- 结果页 - 详细解析 -->
    <div v-if="showResult" class="result-screen">
      <div class="result-card">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
        <h2>考试完成！</h2>

        <div class="score-display">
          <div class="score-circle">
            <div class="score-number">{{ computeScore() }}</div>
            <div class="score-total">/ {{ paperInfo.totalScore }}</div>
          </div>
          <div class="score-percent">{{ Math.round(computeScore() / paperInfo.totalScore * 100) }}%</div>
        </div>

        <div class="result-stats">
          <div class="stat-item"><div class="stat-value correct">✅ {{ correctCount() }}</div><div class="stat-label">答对</div></div>
          <div class="stat-item"><div class="stat-value wrong">❌ {{ questions.length - correctCount() }}</div><div class="stat-label">答错</div></div>
          <div class="stat-item"><div class="stat-value time">⏱️ {{ Math.floor((paperInfo.duration * 60 - timeLeft) / 60) }}分钟</div><div class="stat-label">用时</div></div>
        </div>

        <div class="result-actions">
          <button class="action-btn action-btn-secondary" @click="togglePrint">🖨️ 打印试卷/答案</button>
          <button class="action-btn action-btn-primary" @click="goBack">📚 返回试卷列表</button>
        </div>
      </div>

      <!-- 每题解析 -->
      <div class="analysis-section">
        <div class="analysis-header">
          <h3>📖 详细解析</h3>
          <span class="analysis-count">共 {{ questions.length }} 题</span>
        </div>

        <div
          v-for="(q, qIdx) in questions"
          :key="q.id"
          class="analysis-card"
          :class="{ 'analysis-card--correct': isQuestionCorrect(q), 'analysis-card--wrong': !isQuestionCorrect(q) }"
        >
          <div class="analysis-header-row">
            <div class="analysis-num">{{ qIdx + 1 }}</div>
            <div class="analysis-info">
              <span class="analysis-type">{{ q.type === 'choice' ? '选择题' : '填空题' }}</span>
              <span class="analysis-score">得分: {{ isQuestionCorrect(q) ? (q.score || 0) : 0 }}/{{ q.score || 0 }}</span>
            </div>
            <div class="analysis-result">
              {{ isQuestionCorrect(q) ? '✅ 正确' : '❌ 错误' }}
            </div>
          </div>

          <div class="analysis-stem">
            <!-- SVG图形题 -->
            <div v-if="getQuestionSvg(q)" v-html="getQuestionSvg(q)" class="question-svg"></div>
            <div v-html="q.stem"></div>
          </div>

          <div class="analysis-answers">
            <div class="analysis-answer-row">
              <span class="answer-label your-answer">你的答案</span>
              <span class="answer-text">{{ getUserAnswer(q) || '（未作答）' }}</span>
            </div>
            <div class="analysis-answer-row">
              <span class="answer-label correct-answer">正确答案</span>
              <span class="answer-text correct-text">{{ q.answer }}</span>
            </div>
          </div>

          <!-- 解析 -->
          <div v-if="getSolutionText(q)" class="analysis-solution">
            <div class="solution-label">📐 解题分析</div>
            <div class="solution-body" v-html="getSolutionText(q)"></div>
          </div>
          <div v-else class="analysis-solution analysis-solution-empty">
            <div class="solution-body">暂无详细解析</div>
          </div>
        </div>
      </div>

      <div class="result-footer-actions">
        <button class="action-btn action-btn-secondary" @click="scrollToTop">⬆️ 回到顶部</button>
        <button class="action-btn action-btn-primary" @click="goBack">📚 返回试卷列表</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exam-taking { min-height: 100vh; background: var(--bg-page); }

/* 顶部 */
.exam-header {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-primary);
}
.exam-header__left { display: flex; align-items: center; gap: 1rem; }
.exam-header__right { display: flex; align-items: center; gap: 0.75rem; }
.back-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
}
.exam-title { font-size: 1.25rem; font-weight: 700; margin: 0; }

.timer {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: 'SF Mono', monospace;
  font-weight: 600;
  font-size: 1rem;
}
.timer--warning { background: var(--color-danger); animation: pulse 1s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }

.action-btn {
  background: var(--bg-card);
  color: var(--text-primary);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}
.action-btn:hover { background: var(--bg-hover); transform: translateY(-1px); }

/* 进度条 */
.progress-bar { height: 4px; background: var(--border-color); }
.progress-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s;
}

/* 空/加载状态 */
.empty-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  min-height: 70vh;
}
.spinner { font-size: 4rem; margin-bottom: 1rem; animation: spin 2s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.empty-screen h2 { font-size: 1.5rem; color: #2d3748; margin: 0 0 0.5rem; }
.empty-screen p { color: #718096; margin: 0 0 1.5rem; }
.back-btn-large {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
}

/* 开始页 */
.start-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
}
.start-card {
  background: white;
  border-radius: 24px;
  padding: 3rem;
  max-width: 600px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}
.start-card .icon { font-size: 4rem; margin-bottom: 1rem; }
.start-card h2 { font-size: 1.75rem; color: #2d3748; margin: 0 0 2rem; }

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}
.info-item {
  background: var(--bg-card);
  padding: 1rem 0.5rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}
.info-item span:first-child { font-size: 1.5rem; }

.notice {
  background: var(--card-yellow-bg);
  border: 1px solid var(--color-warning);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  text-align: left;
  margin-bottom: 2rem;
}
.notice h3 { margin: 0 0 0.75rem; font-size: 1rem; color: var(--card-yellow-text); }
.notice ul { margin: 0; padding-left: 1.5rem; color: var(--card-yellow-text); font-size: 0.875rem; line-height: 1.8; }

.start-btn {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  border: none;
  padding: 1rem 3rem;
  border-radius: 14px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-primary);
  transition: all 0.3s;
}
.start-btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }

/* 暂停 */
.pause-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}
.pause-card {
  background: var(--bg-card);
  border-radius: 24px;
  padding: 3rem;
  text-align: center;
  max-width: 400px;
}
.pause-card h2 { color: var(--text-primary); margin: 0 0 0.5rem; font-size: 1.5rem; }
.pause-card p { color: var(--text-secondary); margin-bottom: 1.5rem; }

/* 答题 */
.exam-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
.question-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  margin-bottom: 1.5rem;
}
.question-header {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
  flex-wrap: wrap;
}
.question-no { background: var(--color-primary); color: white; padding: 0.375rem 0.875rem; border-radius: 8px; font-weight: 600; font-size: 0.875rem; }
.question-type { background: var(--bg-hover); color: var(--text-secondary); padding: 0.375rem 0.875rem; border-radius: 8px; font-size: 0.875rem; }
.question-score { color: var(--color-primary-light); font-weight: 600; font-size: 0.875rem; margin-left: auto; }

.question-stem {
  font-size: 1.125rem;
  color: var(--text-primary);
  line-height: 1.9;
  margin-bottom: 2rem;
  padding: 1rem 1.25rem;
  background: var(--bg-hover);
  border-left: 4px solid var(--color-primary);
  border-radius: 8px;
}

.question-svg {
  margin: 1rem 0;
  max-width: 100%;
  overflow-x: auto;
}

.question-svg :deep(svg) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  background: var(--bg-card);
  box-shadow: var(--shadow-sm);
}

.options-list { display: flex; flex-direction: column; gap: 0.75rem; }
.option-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.option-item:hover { border-color: var(--color-primary); background: var(--bg-hover); transform: translateX(4px); }
.option-item--selected {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
  box-shadow: var(--shadow-primary);
}
.option-letter {
  width: 36px;
  height: 36px;
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--text-secondary);
  flex-shrink: 0;
  transition: all 0.2s;
}
.option-item--selected .option-letter { background: var(--color-primary); color: white; border-color: var(--color-primary); }
.option-text { color: var(--text-primary); font-weight: 500; font-size: 1rem; }

.fill-input-wrapper { padding: 0.5rem 0; }
.fill-input {
  width: 100%;
  padding: 1rem 1.25rem;
  font-size: 1.125rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  outline: none;
  transition: all 0.2s;
  text-align: center;
  font-family: inherit;
}
.fill-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }

/* 导航 */
.nav-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.nav-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  transition: all 0.2s;
}
.nav-btn:hover:not(:disabled) { background: var(--bg-hover); }
.nav-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.nav-btn-next { background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark)); color: white; }
.nav-btn-submit { background: linear-gradient(135deg, var(--color-success), #059669); color: white; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }

.question-dots {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
  max-width: 300px;
  justify-content: center;
  flex: 1;
}
.dot {
  width: 10px;
  height: 10px;
  background: var(--border-color);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}
.dot--current { background: var(--color-primary); transform: scale(1.4); }
.dot--answered { background: var(--text-secondary); }

/* 结果页 */
.result-screen {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}
.result-card {
  background: var(--bg-card);
  border-radius: 24px;
  padding: 3rem;
  text-align: center;
  box-shadow: var(--shadow-lg);
  margin-bottom: 2rem;
}
.result-card h2 { font-size: 1.75rem; color: var(--text-primary); margin: 0 0 2rem; }

.score-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background: var(--color-primary-soft);
  border-radius: 20px;
}
.score-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}
.score-number { font-size: 3rem; font-weight: 800; line-height: 1; }
.score-total { font-size: 1rem; opacity: 0.9; margin-top: 0.25rem; }
.score-percent { font-size: 3rem; font-weight: 800; color: #667eea; }

.result-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
.stat-value { font-size: 1.5rem; font-weight: 700; }
.stat-value.correct { color: #10b981; }
.stat-value.wrong { color: #ef4444; }
.stat-value.time { color: #667eea; font-size: 1.125rem; }
.stat-label { font-size: 0.875rem; color: #718096; }

.result-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.action-btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}
.action-btn-secondary {
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 2px solid var(--border-color);
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

/* 解析部分 */
.analysis-section {
  background: var(--bg-card);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  margin-bottom: 2rem;
}
.analysis-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--border-color);
}
.analysis-header h3 { font-size: 1.5rem; color: var(--text-primary); margin: 0; }
.analysis-count { color: var(--text-secondary); font-size: 0.875rem; }

.analysis-card {
  background: var(--bg-hover);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  transition: all 0.2s;
}
.analysis-card:hover {
  box-shadow: var(--shadow-sm);
  transform: translateY(-2px);
}
.analysis-card--correct {
  border-left: 4px solid var(--color-success);
}
.analysis-card--wrong {
  border-left: 4px solid var(--color-danger);
}

.analysis-header-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.analysis-num {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}
.analysis-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.analysis-type {
  background: var(--bg-hover);
  color: var(--text-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}
.analysis-score {
  color: #718096;
  font-size: 0.875rem;
}
.analysis-result {
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
}
.analysis-card--correct .analysis-result { background: rgba(16, 185, 129, 0.1); color: var(--color-success); }
.analysis-card--wrong .analysis-result { background: rgba(239, 68, 68, 0.1); color: var(--color-danger); }

.analysis-stem {
  padding: 1.25rem;
  background: var(--bg-card);
  border-radius: 12px;
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-primary);
  margin-bottom: 1.25rem;
}

.analysis-answers {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding: 1rem 1.25rem;
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}
.analysis-answer-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.answer-label {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  min-width: 80px;
  text-align: center;
  flex-shrink: 0;
}
.your-answer { background: var(--bg-hover); color: var(--text-secondary); }
.correct-answer { background: rgba(16, 185, 129, 0.1); color: var(--color-success); }
.answer-text {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
}
.answer-text.correct-text { color: var(--color-success); }

.analysis-solution {
  padding: 1.25rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--color-success);
  border-radius: 12px;
}
.analysis-solution-empty {
  background: var(--bg-hover);
  border: 1px solid var(--border-color);
  padding: 1rem;
  text-align: center;
  color: var(--text-secondary);
}
.solution-label {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-success);
  margin-bottom: 0.75rem;
}
.solution-body {
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--text-primary);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.result-footer-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* 预览模式 */
.preview-mode {
  min-height: 100vh;
  background: var(--bg-page);
}
.preview-header {
  background: var(--bg-card);
  padding: 1rem 1.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.preview-title {
  flex: 1;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}
.preview-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}
.preview-question-card {
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
}
.preview-question-header {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}
.preview-question-no {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.375rem 0.875rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
}
.preview-question-type {
  background: var(--bg-hover);
  color: var(--text-secondary);
  padding: 0.375rem 0.875rem;
  border-radius: 8px;
  font-size: 0.875rem;
}
.preview-question-score {
  color: var(--color-primary-light);
  font-weight: 600;
  font-size: 0.875rem;
  margin-left: auto;
}
.preview-question-stem {
  font-size: 1.05rem;
  color: var(--text-primary);
  line-height: 1.8;
  margin-bottom: 1.25rem;
  padding: 1rem 1.25rem;
  background: var(--bg-hover);
  border-left: 4px solid var(--color-primary);
  border-radius: 8px;
}
.preview-question-svg {
  margin: 1rem 0;
  max-width: 100%;
  overflow-x: auto;
}
.preview-options {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding-left: 0.75rem;
}
.preview-option-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--bg-card);
  border-radius: 10px;
  font-size: 0.95rem;
  color: var(--text-primary);
}
.preview-option-letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--border-color);
  color: var(--text-secondary);
  border-radius: 8px;
  font-weight: 600;
  flex-shrink: 0;
}
.preview-option-text {
  flex: 1;
  line-height: 1.6;
}
.preview-fill-placeholder {
  padding: 0.75rem 1rem;
  background: var(--card-yellow-bg);
  border: 2px dashed var(--color-warning);
  border-radius: 10px;
  color: var(--card-yellow-text);
  font-style: italic;
}
.preview-solution {
  margin-top: 1rem;
  padding: 0.875rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  font-size: 0.95rem;
  color: var(--color-success);
}

/* 预览按钮 */
.preview-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.75rem;
}
.preview-btn:hover {
  background: var(--bg-hover);
  border-color: var(--border-color);
}

/* 响应式 */
@media (max-width: 768px) {
  .exam-header { padding: 0.75rem 1rem; }
  .exam-title { font-size: 1rem; }
  .start-card, .result-card, .analysis-section { padding: 1.5rem 1rem; }        
  .info-grid { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .question-card { padding: 1.25rem; }
  .question-stem { font-size: 1rem; padding: 0.875rem 1rem; }
  .exam-content, .result-screen { padding: 1rem; }
  .score-display { flex-direction: column; padding: 1.5rem; }
  .analysis-header-row { gap: 0.5rem; }
  .preview-content { padding: 1rem; }
  .preview-question-card { padding: 1.25rem; }
}
</style>