<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  paper: {
    paperId: string
    title: string
    grade: number
    duration: number
    totalScore: number
    year?: number
    source?: string
    sections?: { name: string; count: number; scorePerQuestion: number }[]
  }
  questions: any[]
  userAnswers?: Record<string, string>
  mode: 'blank' | 'answers' | 'report'
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const printMode = ref(props.mode)

function doPrint() {
  window.print()
}

// 计算得分
const actualScore = computed(() => {
  if (!props.userAnswers || !props.questions) return 0
  let score = 0
  props.questions.forEach(q => {
    const ua = (props.userAnswers![q.id] || '').trim()
    const correctAns = String(q.answer || '').trim()
    if (ua === correctAns) score += Number(q.score) || 0
  })
  return score
})

// 正确题数
const correctCount = computed(() => {
  if (!props.userAnswers || !props.questions) return 0
  let count = 0
  props.questions.forEach(q => {
    const ua = (props.userAnswers![q.id] || '').trim()
    const correctAns = String(q.answer || '').trim()
    if (ua === correctAns) count++
  })
  return count
})

// 年级文本
const gradeText = computed(() => {
  const map = ['一', '二', '三', '四', '五', '六']
  const g = props.paper.grade
  return map[g - 1] ? `${map[g - 1]}年级` : `${g}年级`
})

function stripHtml(html: string): string {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

// 将题目按分区组织
function getQuestionsBySection(sectionNo: number) {
  return props.questions.filter(q => Number(q.sectionNo) === sectionNo)
}
</script>

<template>
  <div class="print-wrapper">
    <!-- 打印操作栏（屏幕可见，打印时隐藏） -->
    <div class="print-toolbar no-print">
      <button class="btn" @click="doPrint">
        🖨️ 打印 / 导出PDF
      </button>
      <div class="mode-switch">
        <label>打印模式：</label>
        <select v-model="printMode">
          <option value="blank">空白试卷</option>
          <option value="answers">试卷+答案解析</option>
          <option value="report">答题报告</option>
        </select>
      </div>
      <button class="btn-close" @click="emit('close')">
        关闭
      </button>
      <p class="print-hint">💡 提示：在打印对话框选择「另存为 PDF」即可导出 PDF 文件</p>
    </div>

    <!-- 试卷正文 -->
    <div class="paper">
      <!-- 密封线 & 标题 -->
      <div class="paper-header">
        <div class="paper-seal">
          <span>密</span><br/>
          <span>封</span><br/>
          <span>线</span><br/>
          <span>内</span><br/>
          <span>不</span><br/>
          <span>准</span><br/>
          <span>答</span><br/>
          <span>题</span>
        </div>

        <div class="paper-title-block">
          <h1 class="paper-title">{{ paper.title }}</h1>
          <div class="paper-meta">
            <span>年级：{{ gradeText }}</span>
            <span>考试时间：{{ paper.duration }} 分钟</span>
            <span>满分：{{ paper.totalScore }} 分</span>
            <span v-if="paper.year">年份：{{ paper.year }}</span>
          </div>
          <div class="paper-info">
            <div class="info-cell"><span>姓名：</span><span class="underline"></span></div>
            <div class="info-cell"><span>班级：</span><span class="underline"></span></div>
            <div class="info-cell"><span>学号：</span><span class="underline"></span></div>
            <div class="info-cell"><span>得分：</span><span class="underline"></span></div>
          </div>
        </div>
      </div>

      <!-- 报告模式成绩 -->
      <div v-if="printMode === 'report'" class="paper-report no-print-when-blank">
        <h2>本卷得分：{{ actualScore }} / {{ paper.totalScore }} 分</h2>
        <p>答对 {{ correctCount }} 题 / 共 {{ questions.length }} 题</p>
      </div>

      <!-- 分区显示 -->
      <div class="paper-sections">
        <div v-for="(section, sIdx) in paper.sections" :key="sIdx" class="section">
          <h3 class="section-title">{{ section.name }}</h3>
          <div class="question-list">
            <div
              v-for="(q, idx) in getQuestionsBySection(sIdx + 1)"
              :key="q.id"
              class="question-item"
            >
              <div class="question-no">{{ idx + 1 }}.</div>
              <div class="question-main">
                <div class="question-stem">{{ stripHtml(q.stem) }}</div>
                <div v-if="q.options && q.options.length > 0" class="question-options">
                  <div v-for="(opt, oi) in q.options" :key="oi" class="option-line">
                    <span class="option-label">{{ ['A', 'B', 'C', 'D', 'E', 'F'][oi] }}.</span>
                    <span class="option-text">{{ stripHtml(opt) }}</span>
                  </div>
                </div>
                <!-- 空白答题区 -->
                <div v-if="printMode === 'blank'" class="answer-area">
                  <div class="blank-lines"></div>
                </div>
                <!-- 答案显示 -->
                <div v-else-if="printMode === 'answers'" class="answer-area">
                  <div class="answer-box">
                    <span class="answer-label">✅ 正确答案：</span>
                    <span class="answer-text">{{ stripHtml(String(q.answer || '')) }}</span>
                  </div>
                  <div v-if="q.solution" class="solution-box">
                    <span class="answer-label">📝 解析：</span>
                    <span class="solution-text">{{ stripHtml(String(q.solution)) }}</span>
                  </div>
                </div>
                <!-- 答题报告 -->
                <div v-else-if="printMode === 'report'" class="answer-area">
                  <div
                    :class="['answer-box', (userAnswers && userAnswers[q.id] !== undefined && String(userAnswers[q.id]).trim() === String(q.answer).trim()) || (userAnswers && userAnswers[q.id] === q.answer) ? 'answer-box-correct' : 'answer-box-wrong']">
                    <span class="answer-label">你的答案：</span>
                    <span class="answer-text">{{ (userAnswers && userAnswers[q.id]) ? stripHtml(userAnswers[q.id]) : '未作答' }}</span>
                    <span class="answer-label" style="margin-left: 14px;">正确答案：</span>
                    <span class="answer-text">{{ stripHtml(String(q.answer || '')) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 页脚 -->
      <div class="paper-footer">
        <div>— 本卷共 {{ questions.length }} 题 —</div>
        <div style="margin-top: 8px; font-size: 12px; color: #888;">认真审题，仔细作答，祝你考试顺利！</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.print-wrapper {
  min-height: 100vh;
  background: var(--bg-page);
  padding: 10px;
}

/* 打印操作栏 */
.print-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  flex-wrap: wrap;
}

.btn {
  background: white;
  color: #4a5568;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.btn:hover {
  background: var(--bg-hover);
  transform: translateY(-1px);
}

.btn-close {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  margin-left: auto;
}

.mode-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.mode-switch select {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: white;
  color: #4a5568;
  font-size: 14px;
  min-width: 150px;
  cursor: pointer;
}

.print-hint {
  font-size: 13px;
  opacity: 0.95;
  margin: 0;
}

/* 试卷 A4 样式 */
.paper {
  max-width: 800px;
  margin: 80px auto 40px;
  background: white;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  padding: 50px 60px;
  min-height: calc(100vh - 120px);
}

/* 试卷头部 */
.paper-header {
  border-bottom: 2px solid #2d3748;
  padding-bottom: 20px;
  margin-bottom: 30px;
  display: flex;
  gap: 30px;
}

.paper-seal {
  writing-mode: vertical-rl;
  text-orientation: upright;
  border-left: 2px dashed #aaa;
  padding: 20px 8px;
  color: #555;
  font-size: 14px;
  letter-spacing: 4px;
  font-family: 'SimSun', '宋体', serif;
}

.paper-title-block {
  flex: 1;
}

.paper-title {
  font-size: 24px;
  font-weight: bold;
  color: #1a202c;
  margin: 0 0 12px;
  text-align: center;
  font-family: 'SimHei', '黑体', sans-serif;
}

.paper-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  font-size: 13px;
  color: #4a5568;
  margin-bottom: 20px;
}

.paper-info {
  border: 1px solid #e2e8f0;
  padding: 12px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.info-cell {
  flex: 1;
  min-width: 150px;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.info-cell span:first-child {
  color: #2d3748;
  font-weight: 600;
  white-space: nowrap;
}

.underline {
  flex: 1;
  border-bottom: 1px solid #4a5568;
  display: inline-block;
  min-height: 18px;
  margin-left: 4px;
}

/* 报告头部 */
.paper-report {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: var(--card-yellow-bg);
  border: 1px solid var(--border-color);
}

.paper-report h2 {
  font-size: 22px;
  color: var(--card-yellow-text);
  font-weight: bold;
  margin: 0 0 8px;
}

.paper-report p {
  font-size: 15px;
  color: #4a5568;
  margin: 0;
}

/* 分区 */
.section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #2d3748;
  padding: 10px 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.question-list {
  padding-left: 4px;
}

.question-item {
  margin-bottom: 28px;
  display: flex;
  gap: 8px;
}

.question-no {
  font-weight: 700;
  color: #2d3748;
  min-width: 28px;
  flex-shrink: 0;
}

.question-main {
  flex: 1;
}

.question-stem {
  line-height: 1.9;
  color: #1a202c;
  font-size: 14.5px;
}

.question-options {
  margin-top: 10px;
  padding-left: 4px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 20px;
}

.option-line {
  display: flex;
  gap: 6px;
  padding: 3px 0;
}

.option-label {
  font-weight: 600;
  color: #2d3748;
}

/* 答题区 */
.answer-area {
  margin-top: 14px;
}

.blank-lines {
  min-height: 60px;
  background: repeating-linear-gradient(
    to top,
    transparent 0,
    transparent 23px,
    #e2e8f0 23px,
    #e2e8f0 24px
  );
  border: 1px dashed #e2e8f0;
  margin: 8px 0;
}

.answer-box {
  padding: 10px 14px;
  border-left: 4px solid var(--color-success);
  background: rgba(16, 185, 129, 0.1);
  margin-bottom: 8px;
  line-height: 1.8;
}

.answer-box-wrong {
  border-left-color: var(--color-danger);
  background: rgba(239, 68, 68, 0.1);
}

.answer-box-correct {
  border-left-color: var(--color-success);
  background: rgba(16, 185, 129, 0.1);
}

.solution-box {
  padding: 10px 14px;
  border-left: 4px solid var(--color-primary);
  background: rgba(99, 102, 241, 0.1);
  line-height: 1.8;
}

.answer-label {
  font-weight: bold;
  color: #2d3748;
  font-size: 13px;
}

.answer-text,
.solution-text {
  color: #2f855a;
  font-weight: 500;
  font-size: 13.5px;
}

.solution-text {
  color: #2b6cb0;
}

/* 页脚 */
.paper-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  font-size: 13px;
  color: #718096;
}

/* 打印专用样式 */
@media print {
  .no-print {
    display: none !important;
  }

  .print-wrapper {
    background: white;
    padding: 0;
  }

  .paper {
    max-width: none;
    margin: 0;
    box-shadow: none;
    padding: 15mm 12mm;
  }

  body {
    background: white;
    margin: 0;
    padding: 0;
    font-family: 'SimSun', '宋体', serif;
  }

  @page {
    size: A4;
    margin: 10mm 12mm;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .paper {
    margin: 120px 8px 20px;
    padding: 25px 16px;
  }

  .paper-title {
    font-size: 18px;
  }

  .paper-meta {
    gap: 8px;
    font-size: 12px;
  }

  .question-options {
    grid-template-columns: 1fr;
  }
}
</style>
