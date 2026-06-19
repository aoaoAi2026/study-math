# 小学数学奥数知识宝典 - 完整项目文档

**版本**：V3.4
**状态**：可开始开发
**目标**：一份文档，直接发给 Claude / Trae / Cursor，即可启动完整项目开发

---

## 一、产品概述

### 1.1 产品定位

一个网页可访问、手机可安装（APK）、完全离线可用的数学学习平台。

核心价值：100% 覆盖 1-6 年级人教版课内知识点 + 奥数七大模块（计算、应用题、几何、数论、计数、数字谜、组合逻辑）全部内容。每个知识点配备六种学习卡片、虚拟教具、关联游戏、自适应练习，遵循"五步深度教学法"确保学习效果。

### 1.2 目标用户

| 用户 | 场景 | 核心需求 |
|------|------|---------|
| 学生（1-6年级） | 系统学数学、打基础、拓展思维 | 有趣的、能坚持的学习方式 |
| 家长 | 辅导孩子，但不懂怎么教 | 傻瓜式辅导脚本、孩子学情透明 |
| 教师 | 备课参考、课堂教具、分层练习 | 体系化内容、可视化教具 |

### 1.3 产品形态

| 形态 | 说明 | 使用场景 |
|------|------|---------|
| 网页版 | 部署到 GitHub Pages / 服务器 | 电脑浏览器访问，PWA 可离线 |
| APK版 | Android WebView 包装 | 手机安装，完全离线使用 |
| PWA | 网页版支持添加到主屏幕 | 类 App 体验，无需安装 |

### 1.4 核心特点

- **完全离线**：所有内容、游戏、教具、练习数据均存储在本地
- **双端运行**：一套代码，网页 + Android APK 双端部署
- **深度教学**：每个知识点遵循"五步深度教学法"，从情境唤醒到反思建构完整闭环
- **游戏化学习**：12+ 款数学游戏，在玩中巩固知识
- **虚拟教具**：6 大交互式教具，把抽象概念可视化
- **智能练习**：基于 IRT 的自适应刷题 + SM-2 间隔复习 + 错因分类靶向干预
- **激励系统**：宠物养成 + 成就徽章 + 经验等级 + 主题皮肤 + 里程碑仪式
- **家长赋能**：三层支持系统（傻瓜模式/理解模式/拓展模式）+ 辅导仪表盘

---

## 二、技术架构

### 2.1 技术栈

| 层次 | 技术 | 版本 | 说明 |
|------|------|------|-----|
| 前端框架 | Vue 3 | 3.4+ | Composition API + `<script setup>` + TypeScript |
| 构建工具 | Vite | 5.x | 快速构建，HMR |
| 路由 | Vue Router | 4.x | Hash 模式（本地文件兼容） |
| 状态管理 | Pinia | 2.x | 按模块拆分 Store |
| 数学公式 | KaTeX | 0.16+ | 轻量，离线渲染 |
| 图表 | ECharts | 5.x | 按需引入，雷达图/柱状图/热力图 |
| Markdown | marked | 12.x | 自定义渲染器支持 Vue 组件嵌入 |
| 本地搜索 | FlexSearch | 0.7+ | 纯前端全文搜索，多类型分组 |
| 数据存储 | localStorage + IndexedDB | — | idb 库封装 |
| PWA | vite-plugin-pwa | 0.19+ | Service Worker 离线支持 |
| APK | Android WebView | — | 极简壳，仅加载本地文件 |

### 2.2 架构原则

- **单文件 ≤ 300 行**：`.vue` 文件模板+脚本+样式合计不超 300 行
- **纯函数逻辑分离**：游戏算法、IRT 引擎、SM-2 算法等纯逻辑独立为 `.ts` 文件
- **内容与逻辑分离**：Markdown 文件负责知识内容，Vue 组件负责交互逻辑
- **功能模块独立**：每个功能模块（游戏、教具、学习）自包含，可单独开发/测试/替换
- **离线优先**：所有核心功能不依赖网络

### 2.3 存储方案

| 数据类型 | 存储方式 | 说明 |
|----------|----------|------|
| 用户设置 | localStorage | 主题、字体、声音 |
| 学习进度 | IndexedDB | 知识点掌握度、学习路径节点状态 |
| 练习记录 | IndexedDB | 答题历史、用时、正确率、错误层级 |
| 错题本 | IndexedDB | 错题+错误类型+错误层级+复习记录 |
| 成就数据 | IndexedDB | 已解锁成就、经验值、等级 |
| 宠物状态 | IndexedDB | 成长阶段、情绪、装饰、日记 |
| 笔记/书签 | IndexedDB | 用户笔记和高亮内容 |
| 草稿数据 | IndexedDB | 多页草稿自动保存 |
| 诊断数据 | IndexedDB | 诊断结果、能力雷达图历史 |
| 亲子辅导记录 | IndexedDB | 辅导时长、模式、评分 |

---

## 三、项目目录结构

```
math-app/
├── public/                        # 静态资源（不经过构建）
│   ├── content/                   # 所有 Markdown 教学内容
│   │   ├── grade-1/               # 一年级
│   │   │   ├── index.md
│   │   │   ├── basic/             # 校内基础（7个知识点）
│   │   │   └── olympiad/          # 奥数启蒙（7个知识点）
│   │   ├── grade-2 ... grade-6/   # 二至六年级（同理）
│   │   ├── modules/               # 跨年级模块整合（7大模块）
│   │   ├── resources/             # 资源库（公式表/错题册/术语表）
│   │   └── guide/                 # 使用指南
│   ├── images/                    # 全局图片（线段图/几何/图标）
│   ├── exercises/                 # 独立练习数据 JSON
│   └── fonts/                     # KaTeX 字体文件子集
├── src/
│   ├── app/                       # 应用入口（App.vue, main.ts, env.d.ts）
│   ├── assets/styles/             # CSS 变量/基础样式/多套主题
│   ├── components/                # 全局可复用组件
│   │   ├── ui/                    # MathRenderer / LazyImage / ProgressBar / Modal / Toast
│   │   ├── layout/                # AppLayout / Sidebar / TopNav / BottomNav
│   │   ├── cards/                 # 6 种学习卡片（Story/Concept/Example/Variant/Mistake/ParentChild）
│   │   └── practice/              # QuizEngine + StepGuidance + ComparisonView + 三种题型 + ScratchPad
│   ├── features/                  # 功能模块（每个功能独立文件夹）
│   │   ├── home/                  # 首页仪表盘（HomePage, DailyTasks, ContinueLearning, QuickStats）
│   │   ├── diagnosis/             # 智能诊断（DiagnosticTest/ResultReport/diagnosisStore）
│   │   ├── knowledge-map/         # 知识地图世界树（KnowledgeMap/MapCanvas/TreeNode/mapStore）
│   │   ├── learning/              # 学习中心（TopicDetail/LearningPath/AdaptiveQuiz/Pre/Post/learningStore）
│   │   ├── game-center/           # 游戏中心（GameLobby + 12 款游戏子文件夹）
│   │   ├── challenge/             # 每日挑战/周赛（DailyChallenge/WeeklyContest/challengeStore）
│   │   ├── tools/                 # 虚拟教具工具箱（6 款教具 + toolsStore）
│   │   ├── workshop/              # 出题工坊
│   │   ├── newspaper/             # 数学小报生成
│   │   ├── profile/               # 个人中心（主页/成就墙/宠物/报告/时间轴/毕业仪式/周回顾）
│   │   ├── parent-academy/        # 家长学院
│   │   ├── community/             # 家庭互动（家庭组/解惑墙/挑战/分享卡/学习圈）
│   │   └── admin/                 # 家长控制中心（仪表盘/辅导仪表盘/时长限制）
│   ├── composables/               # 可组合函数（useMarkdown/useExercise/useUserProgress/useAudio/usePlatform/useTimer）
│   ├── router/                    # 路由（index + 6 个子路由文件 + guards）
│   ├── stores/                    # 全局 Pinia（userStore/settingsStore/syncStore）
│   ├── services/                  # 纯逻辑服务层（contentLoader/exerciseEngine/spacedRepetition/localDb 等 15 个）
│   ├── types/                     # TypeScript 类型（8 个类型文件）
│   └── utils/                     # 工具函数（math/format/validators）
├── android/                       # Android 壳工程
├── scripts/                       # build-all.sh + create-content-template.js
├── index.html / vite.config.ts / tsconfig.json / package.json / README.md
```

---

## 四、核心代码规范

### 4.1 行数红线

| 文件类型 | 最大行数 | 说明 |
|----------|---------|------|
| .vue 组件 | 300 行 | 模板 + 脚本 + 样式合计 |
| .ts 逻辑文件 | 200 行 | 纯逻辑（如 gameLogic.ts） |
| Pinia Store | 100 行 | 状态 + getter + action |
| 路由文件 | 50 行 | 仅路由表数组 |

### 4.2 拆分触发条件

- 组件模板超过 100 行 → 拆分子组件
- 脚本逻辑超过 150 行 → 提取到 composables 或专属 `.ts`
- 样式超过 80 行 → 提取到独立 CSS
- Store 超过 100 行 → 拆分业务逻辑到 services

### 4.3 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件名 | kebab-case | `segment-diagram.vue`, `use-markdown.ts` |
| 组件名 | PascalCase | `SegmentDiagram`, `ConceptCard` |
| 函数/变量 | camelCase | `loadContent`, `masteryLevel` |
| 常量 | UPPER_SNAKE_CASE | `MAX_PRACTICE_COUNT` |
| TypeScript 接口 | 描述性名称 | `UserProfile`, `ExerciseData` |
| MD 知识点文件 | 英文短横线 | `sum-multiple.md`, `chicken-rabbit.md` |

### 4.4 组件结构模板

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'                 // 1. imports
const props = defineProps<{ title: string }>()                 // 2. props & emits
const emit = defineEmits<{ (e: 'close'): void }>()
const { data, loading } = useSomeFeature()                     // 3. composables
const isOpen = ref(false)                                      // 4. reactive state
const displayTitle = computed(() => props.title.toUpperCase()) // 5. computed
function handleClick() { /* ... */ }                           // 6. methods
onMounted(() => { /* ... */ })                                 // 7. lifecycle hooks
</script>

<template>
  <div class="component-name">
    <!-- 模板简洁，复杂逻辑放 computed -->
  </div>
</template>

<style scoped>
.component-name { /* 使用 CSS 变量保持主题一致性 */ }
</style>
```

### 4.5 状态管理规范

- **全局 Store（`stores/`）**：仅放跨模块共享的数据（用户信息、设置）
- **功能 Store（`features/` 内）**：各功能模块的状态，独立管理
- 禁止 Store 之间直接引用，通过事件或 composables 通信
- 复杂业务逻辑放在 `services/` 中，Store 只调用服务方法

### 4.6 类型安全要求

- 禁止使用 `any`（除非有充分理由并注释说明）
- 所有 Props、Emits 显式声明类型
- 所有 API 返回值定义 interface
- Store 的 state、getter、action 均有类型注解
- 所有异步操作使用 try-catch 包裹；内容加载失败显示友好错误页面（含重试按钮）

---

## 五、核心数据结构

### 5.1 用户数据模型（types/user.ts）

- **UserProfile**：id, nickname, avatar, grade(1-6), goal, createdAt
- **KnowledgeMastery**：按 knowledgeId 存储 level(0-5)、练习次数、正确率、easeFactor、interval、lastErrorLayer
- **PracticeRecord**：exerciseId、userAnswer、isCorrect、timeUsed、timestamp、errorType、errorLayer
- **WrongRecord**：错题库，包含 wrongAnswer/correctAnswer/errorLayer/nextReviewDate/consecutiveCorrect/resolved
- **Achievement**：成就（id/name/icon/category/progress/target/unlockedAt）
- **PetState**：宠物状态（stage/mood/hunger/accessories/skills/diary）
- **UserNote** + **UserData**：笔记 + 全局用户数据聚合

### 5.2 题目数据模型（types/exercise.ts）

- **Exercise**：id, knowledgePoints, type(choice/fill/input/application), difficulty(1-5), stem, options, answer, solution(SolutionStep[]), hints, commonMistakes, irtParams{a,b,c}, estimatedTime, tags, guidanceLevel
- **GuidanceLevel**：demonstration | scaffolding | socratic | challenge
- **SolutionStep**：description, expression, diagram, why
- **CommonMistake**：mistake, reason, correction, errorLayer(L1-L4)

### 5.3 内容卡片类型（types/content.ts）

- **CardType**：story | concept | example | variant | mistake | parent-child
- **CardSection**：type, title, content, component, componentProps, parentNotes
- **KnowledgeNode**：知识点节点（id/name/grade/module/difficulty/prerequisites/leadsTo/relatedTo/easyToMistake/guidanceLevel/estimatedMinutes）

### 5.4 学习路径类型（types/learning.ts）

- **GuidanceLevelConfig**：level, maxHints, hintDelay
- **LearningPathNode**：knowledgeId, status(locked/available/in-progress/mastered), guidanceLevel, preAssessmentRequired, postTestThreshold
- **PreAssessmentResult**：knowledgeId, passed, score, weakPrerequisites, recommendation(proceed/review-first/restart)
- **ParentCoachingRecord**：date, knowledgeId, duration, mode(script/understanding/extension), childEngagement(1-5), parentRestraint(1-5), childMood, notes

### 5.5 诊断类型（types/diagnosis.ts）

- **DiagnosisResult**：radarData[{module,score}], recommendedPath(basic/enhance/competition), estimatedGrade, strengths[], weaknesses[], overallScore, history
- **DiagnosisAnswer**：exerciseId, userAnswer, isCorrect, timeUsed

### 5.6 挑战类型（types/challenge.ts）

- **ChallengeRecord**：id, type(daily/weekly), date, score, totalQuestions, correctCount, timeUsed, rank, details[]

### 5.7 社区类型（types/community.ts）

- **HelpRequest**：exerciseId, userId, scratchImage, description, answers[], resolved, createdAt
- **HelpAnswer**：userId, content, imageUrl, isAccepted, createdAt
- **LearningCircle**：name, members[], ownerId, createdAt

---

## 六、内容编写规范

### 6.1 五步深度教学法卡片编排

| 步骤 | 卡片 | 核心问题 | 学生行为 | 最少内容 |
|------|------|---------|---------|---------|
| 第一步 | 情境故事卡 | "我为什么要学这个？" | 阅读/观看生活场景 | 1 个贴近生活的场景描述 |
| 第二步 | 概念构建卡 | "这个知识到底是什么？" | 拖拽/观察/发现规律 | 1 个交互教具 + 概念定义 |
| 第三步 | 例题精讲卡 | "我该怎么解决这类问题？" | 跟分步演示，每步自己先试 | 1 道母题 + 完整分步解析 |
| 第四步 | 变式挑战卡 | "换样子我还会吗？" | 独立解决变式题 | ≥3 道变式（覆盖 ≥4 个变式维度） |
| 第五步 | 亲子共学卡 | "我能讲出来吗？" | 口述过程/自己出题/教家长 | 1 份对话脚本 + 1 道自主题 |

### 6.2 Markdown 文件结构（和倍问题示例）

每个知识点一个 `.md` 文件，使用 `::: card-type` 自定义容器标记不同类型的卡片（见完整文档示例，包含 story-card / concept-card / example-card / variant-card / mistake-card / parent-child-card 六种容器）。

### 6.3 自定义容器渲染机制

在 `useMarkdown.ts` 中扩展 marked 渲染器，将 `::: card-type` 转换为对应 Vue 组件。Markdown 文件以年级为一级目录、校内/奥数为二级目录组织，文件名使用英文短横线命名。

### 6.4 四层展示解题步骤

每道母题按 **直觉猜测 → 画图建模 → 算式推导 → 公式总结** 四层结构编写，层层递进地引导学生从直觉到抽象。

### 6.5 变式题六维度设计

每个知识点至少覆盖 4 个维度：**数字变化**、**情境变化**、**结构变化**（如暗和/暗差）、**角色变化**（两人→三人）、**逆向变化**（已知结果反求条件）、**干扰变化**（加入无关信息）。

### 6.6 认知负荷管理

- 一个 MD 文件只讲一个核心概念
- 每张卡片信息量控制在 **3±1 个要点**
- 复杂概念拆分为多个子卡片（如"分数裂项"拆为"裂差基本型 → 裂差推广型 → 裂和型"）
- 例题的每个步骤不超过 2 个新操作

### 6.7 文件命名规范（重申）

- 知识点文件：英文短横线（`sum-multiple.md`, `chicken-rabbit.md`）
- 专题文件夹：英文短横线（`sum-diff-multiple/`, `trip-problem/`）
- 年级目录：`grade-{1-6}`
- 模块目录：`basic/`, `olympiad/`

---

## 七、教学法核心设计

### 7.1 三阶思维引导策略

| 难度 | 策略 | 提示次数 | 示例 |
|------|------|---------|------|
| ★-★★ | 示范型：先完整演示一遍，再让孩子模仿 | 无限制 | 先播放"假设全是鸡"的完整动画 |
| ★★★ | 脚手架型：分步提示，每步一个引导问题 | 每步 1 次 | "如果假设笼子里全是鸡，总脚数是多少？" |
| ★★★★ | 苏格拉底型：只给最模糊的提示 | 总共 1 次 | "鸡和兔最大的区别是什么？" |
| ★★★★★ | 挑战型：不给任何提示 | 0 次 | 完全独立解决，获"独立思考者"徽章 |

### 7.2 错因四层分类与靶向干预

| 层级 | 错误类型 | 表现 | 干预策略 |
|------|---------|------|---------|
| L1 输入层 | 审题错误 | 漏看条件、看错数字 | "读题三步法"训练（圈关键词→画图翻译→复述题意） |
| L2 加工层 | 概念错误 | 找错 1 份量、用错公式 | 回退到概念构建卡，重新操作教具 |
| L2 加工层 | 方法错误 | 步骤遗漏、思路偏差 | 标准步骤与用户步骤并排对比（ComparisonView） |
| L3 执行层 | 计算错误 | 进退位遗漏、口诀记错 | 推送对应计算类型的每日特训（Calc Arcade） |
| L4 元认知层 | 思维定势 | 只会套模板，变形就不会 | 推送"反套路"变式题，刻意训练条件识别 |

### 7.3 完整学习闭环（7步）

```
预评估 → 情境唤醒 → 概念建构 → 方法探索 → 变式迁移 → 反思建构 → 后测验证
   ↑                                                              ↓
   ←—— 未通过：回退薄弱环节   |   通过：标记掌握，进入 SM-2 间隔复习队列 ——
```

- **预评估**：3-5 道题检测前置知识是否牢固（<80% 先复习前置）
- **后测验证**：5 道题（基本型+变式型），正确率 ≥80% 且用时 ≤ 标准时间 1.5 倍才"已掌握"

### 7.4 学习路径分流机制

```
预评估
├── ≥80% → 正常学习新知识
├── 60-79% → 快速复习前置知识（10分钟微课）
└── <60% → 必须先重新学习前置知识

后测验证
├── ≥80% → 标记掌握，进入 SM-2 间隔复习
├── 50-79% → 针对性补充（哪类错题回哪张卡片）
└── <50% → 重新学习整个知识点，降低初始引导难度
```

### 7.5 间隔复习关联网络

在 SM-2 算法基础上增加知识点关联复习：复习 A 时自动检查前驱/易混知识点掌握度，如下降优先复习；如易混知识点（和倍/差倍）近期错误增多，自动推送对比练习和综合复习包。

---

## 八、全知识点与功能映射（完整清单）

### 8.1 一年级（7 校内 + 7 奥数启蒙）

**校内基础**：1-20 各数的认识、20 以内加减法、100 以内数的认识、100 以内加减法、认识平面图形、认识立体图形、认识钟表、认识人民币

**奥数启蒙**：找规律、图形剪拼、火柴棒游戏、简单逻辑推理、一笔画、数独入门、数小正方体

### 8.2 二年级（6 校内 + 9 奥数拓展）

**校内基础**：表内乘法、表内除法、混合运算、长度单位、质量单位、角的初步认识

**奥数拓展**：巧算入门、移多补少、年龄问题初步、等量代换、排队问题、重叠问题、有序数图形、列表推理、数列规律

### 8.3 三年级（6 校内 + 12 奥数专题）★ 教学法重点年级

**校内基础**：多位数乘法、除法竖式、分数初步、周长与面积、年月日、小数初步

**奥数专题**：等差数列、**和倍问题** ★、**差倍问题** ★、**和差问题** ★、植树问题、周期问题、还原问题、巧求周长、面积初步、奇偶性、竖式谜、加乘原理

### 8.4 四年级（7 校内 + 17 奥数专题）

**校内基础**：大数的认识、运算定律、小数乘法、平行与垂直、三角形分类、条形统计图、平均数

**奥数专题**：小数巧算、定义新运算、**盈亏问题** ★★、**鸡兔同笼** ★★、页码问题、方阵问题、容斥原理、**等积变形** ★、**一半模型** ★、割补法、角的计算、整除特征、质数与合数、分解质因数、最大公因数与最小公倍数、**抽屉原理** ★、逻辑推理进阶

### 8.5 五年级（6 校内 + 20 奥数专题）

**校内基础**：简易方程、分数的意义、多边形面积、长方体和正方体、可能性、分数加减法

**奥数专题**：**分数裂项** ★★、比较与估算、繁分数化简、**分数应用题** ★★★、**工程问题** ★★、**浓度问题** ★★、**经济问题** ★★、**牛吃草问题** ★★、**比和比例应用题** ★★、**蝴蝶模型** ★★、**燕尾模型** ★、**鸟头模型** ★、**沙漏模型** ★、立体几何进阶、**同余定理** ★★、**完全平方数** ★、不定方程入门、**排列组合初步** ★、**数阵图** ★、复杂逻辑推理

### 8.6 六年级（8 校内 + 16 奥数专题）

**校内基础**：分数乘除法、比和比例、百分数、圆、圆柱、圆锥、负数、扇形统计图

**奥数专题**：复杂分数裂项、**行程问题综合** ★★★（含相遇追及/火车过桥/环形跑道/流水行船/比例解行程）、复杂工程问题、复杂浓度问题、复杂经济问题、**曲线几何综合** ★★、**几何最值（将军饮马）** ★、**进位制** ★、不定方程进阶、染色问题、**必胜策略** ★、小初衔接

---

## 九、功能模块优先级总表

### 核心学习（P0 MVP）

知识地图、专题学习（6 种卡片）、智能诊断、智能练习（IRT 引擎）、错题管理（SM-2 + 四层错因）、前置检测、后测验证、每日挑战

### 游戏中心（P0-P1）

计算街机、数独探险（P0）；火柴棒谜题、24 点大战、数学大富翁（P1）；一笔画、数字华容道、图形拼板、分数披萨店、方程天平、几何积木、数学记忆卡（P2）

### 虚拟教具（P0-P2）

线段图生成器、几何画板（P0）；坐标系工具、分数直观工具、立体几何观察器（P1）；函数图像探索（P2）

### 激励系统（P0-P2）

宠物小π、成就徽章（P0）；经验等级、每日任务、主题皮肤、里程碑仪式（P1）；学习伙伴精灵、出题工坊、数学小报、每周回顾（P2）

### 家庭与社交（P1-P3）

家庭组、解惑墙、家长控制、家长学院、辅导仪表盘、三层支持系统（P1）；成就分享卡、家庭挑战赛（P2）；学习圈（P3）

### 辅助功能（P0-P3）

全局搜索 FlexSearch（P0）；打印中心、番茄钟计时（P1）；笔记收藏、数据管理、学习时间轴（P2）；教师控制台（P3）

---

## 十、开发路径

### 第一阶段：MVP（1-6 周）

目标：完整学习闭环 + 核心内容 + 基础游戏教具

- 第 1 周：项目初始化（Vue3+TS+Vite+Pinia+Router）+ 布局组件 + 基础样式 + KaTeX 集成
- 第 2 周：内容加载系统（useMarkdown）+ 六种学习卡片 + TopicDetail 页面 + 侧边栏导航
- 第 3 周：核心练习引擎（QuizEngine/三种题型/ScratchPad）+ exerciseEngine(IRT) + spacedRepetition(SM-2) + localDb
- 第 4 周：教学法核心（PreAssessment + PostTest + learningPathService + StepGuidance + ComparisonView）
- 第 5 周：三年级和差倍专题完整 MD 内容 + 线段图生成器 + 计算街机游戏
- 第 6 周：智能诊断 + 宠物小π + 成就系统 + 首页完善

**里程碑**：MVP 可演示——完整 7 步学习闭环跑通

### 第二阶段：V1.5（7-10 周）

- 第 7-8 周：三年级全部奥数专题 + 四年级核心专题（盈亏/鸡兔同笼/等积变形/整除）+ 家长学院
- 第 8-9 周：火柴棒谜题 + 24 点 + 数学大富翁 + 几何画板教具 + 分数直观工具
- 第 9-10 周：亲子三层支持系统 + 家长控制中心 + 辅导仪表盘 + 家庭组 + 解惑墙 + 打印中心

**里程碑**：V1.5 发布——3-4 年级核心内容 + 6 款游戏 + 3 大教具 + 家长三层支持

### 第三阶段：V2.0（11-16 周）

- 第 11-12 周：五年级/六年级奥数核心专题 + 1-2 年级内容 + 3-6 年级校内基础全覆盖
- 第 13-14 周：剩余 7 款游戏 + 剩余 3 款教具 + 主题皮肤系统
- 第 15-16 周：宠物完整功能 + 成就扩展 + 每日挑战/周赛 + 学习伙伴 + 出题工坊 + 数学小报 + 里程碑仪式 + 每周回顾 + 数据导入导出

**里程碑**：V2.0 完整版——1-6 年级全内容 + 12 款游戏 + 6 大教具 + 完整激励体系

### 第四阶段：V3.0 生态版（远期）

教师控制台（班级管理/学情看板/作业布置）+ 学习圈功能 + 多语言支持（i18n）+ AI 解题步骤分析（本地轻量模型，可选）

---

## 十一、构建与部署

### 11.1 Vite 配置要点

- 插件：`@vitejs/plugin-vue` + `vite-plugin-pwa`（registerType: autoUpdate，workbox.globPatterns 包含 js/css/html/md/json/svg/png/woff2）
- resolve.alias：`'@': '/src'`
- build.rollupOptions.output.manualChunks：vendor-vue（vue/vue-router/pinia）、vendor-math（marked/katex）、vendor-charts（echarts）

### 11.2 一键构建脚本（scripts/build-all.sh）

```
npm install → npm run build → 复制 dist/ 到 android/app/src/main/assets/www/ → ./gradlew assembleRelease
```

产物：`dist/`（Web）+ `app-release.apk`（Android）

### 11.3 代码体积控制策略

- KaTeX 字体子集（仅数学符号 + 拉丁字母）
- ECharts 按需引入（仅雷达图/柱状图/热力图）
- Three.js 动态导入（仅立体几何观察器使用）
- 游戏 Canvas 2D 优先，避免 WebGL 开销
- 图片 SVG 优先，路由懒加载，manualChunks 分包

---

## 十二、快速启动指南

```bash
# 1. 环境：Node.js 18+ LTS
# 2. 创建项目
npm create vite@latest math-app -- --template vue-ts
cd math-app
# 3. 安装核心依赖
npm install vue-router pinia marked katex flexsearch echarts idb
npm install -D @types/marked vite-plugin-pwa
# 4. 创建目录结构（参见第三章）
# 5. 创建入口 main.ts / App.vue / 路由 / 各组件
# 6. 启动开发服务器
npm run dev
```

**开发流程建议**：先跑通内容加载 → 搭建学习闭环（TopicDetail→PreAssessment→QuizEngine→PostTest→错题本）→ 逐个添加游戏 → 完善激励系统

---

## 十三、总结

本文档涵盖了一个完整数学学习平台所需的全部设计——从产品定位、技术架构、目录结构、类型定义、内容规范、教学法设计，到功能清单、开发路径、构建部署。核心设计理念贯穿始终：**功能为学习效果服务，内容为思维成长设计**。
