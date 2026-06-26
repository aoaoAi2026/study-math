import { marked } from 'marked'
import type { CardBlock, KnowledgeTopic, TopicIndex } from '@/types/content'

const CARD_TYPES = ['story', 'concept', 'example', 'variant', 'mistake', 'parent-child'] as const

interface TopicMeta extends TopicIndex {
  icon: string
  description: string
  knowledgePoints: string[]
}

/**
 * TOPIC_INDEX 中的 path 必须与 public/content/ 目录下的文件名一致（不含 .md）
 * 每个 topic 的 id 会同时用于路由、题库知识点匹配等
 */
const TOPIC_INDEX: TopicMeta[] = [
  // ======== 一年级 校内基础（8个） ========
  {
    id: 'g1-number-recognition',
    title: '1-20各数的认识',
    grade: 1, category: 'basic', difficulty: 1,
    path: 'grade-1/basic/number-recognition',
    icon: '🔢',
    summary: '认识1-20各数，理解数的顺序和大小',
    description: '通过实物操作认识数字，建立数感。',
    knowledgePoints: ['g1-number-recognition']
  },
  {
    id: 'g1-addition-within-20',
    title: '20以内加减法',
    grade: 1, category: 'basic', difficulty: 1,
    path: 'addition-within-20',
    icon: '➕',
    summary: '用"凑十法"掌握20以内的进退位加减法',
    description: '通过故事和游戏的方式，让孩子熟练掌握20以内的加减法。',
    knowledgePoints: ['g1-addition-within-20']
  },
  {
    id: 'g1-word-problem-1st',
    title: '一年级应用题入门',
    grade: 1, category: 'basic', difficulty: 2,
    path: 'word-problem-1st',
    icon: '📝',
    summary: '把生活中的问题转化为加法或减法算式',
    description: '学会读题、识别关键词，列出正确的算式。',
    knowledgePoints: ['g1-word-problem-1st']
  },
  {
    id: 'g1-counting-game',
    title: '趣味数数',
    grade: 1, category: 'basic', difficulty: 1,
    path: 'counting-game',
    icon: '🎲',
    summary: '有趣的数数与计数游戏',
    description: '通过游戏培养数感和有序思维。',
    knowledgePoints: ['g1-counting-game']
  },
  {
    id: 'g1-number-100',
    title: '100以内数的认识',
    grade: 1, category: 'basic', difficulty: 1,
    path: 'grade-1/basic/number-100',
    icon: '💯',
    summary: '认识100以内的数，理解数位概念',
    description: '掌握个位、十位的含义，能读写100以内的数。',
    knowledgePoints: ['g1-number-100']
  },
  {
    id: 'g1-addition-subtraction-100',
    title: '100以内加减法',
    grade: 1, category: 'basic', difficulty: 2,
    path: 'grade-1/basic/addition-subtraction-100',
    icon: '➖',
    summary: '掌握100以内的加减法计算',
    description: '熟练进行100以内的加减法运算。',
    knowledgePoints: ['g1-addition-subtraction-100']
  },
  {
    id: 'g1-plane-shapes',
    title: '认识平面图形',
    grade: 1, category: 'basic', difficulty: 1,
    path: 'grade-1/basic/plane-shapes',
    icon: '🔷',
    summary: '认识长方形、正方形、三角形、圆',
    description: '通过观察和操作认识常见的平面图形。',
    knowledgePoints: ['g1-plane-shapes']
  },
  {
    id: 'g1-solid-shapes',
    title: '认识立体图形',
    grade: 1, category: 'basic', difficulty: 1,
    path: 'grade-1/basic/solid-shapes',
    icon: '📦',
    summary: '认识长方体、正方体、圆柱、球',
    description: '通过观察和触摸认识常见的立体图形。',
    knowledgePoints: ['g1-solid-shapes']
  },
  {
    id: 'g1-clock-time',
    title: '认识钟表',
    grade: 1, category: 'basic', difficulty: 2,
    path: 'grade-1/basic/clock-time',
    icon: '🕐',
    summary: '认识整时和半时',
    description: '学会看钟表，认识整时和半时。',
    knowledgePoints: ['g1-clock-time']
  },
  {
    id: 'g1-rmb-money',
    title: '认识人民币',
    grade: 1, category: 'basic', difficulty: 2,
    path: 'grade-1/basic/rmb-money',
    icon: '💴',
    summary: '认识元、角、分及其换算',
    description: '认识人民币的面值，学会简单的计算。',
    knowledgePoints: ['g1-rmb-money']
  },

  // ======== 一年级 奥数启蒙（7个） ========
  {
    id: 'g1-find-pattern',
    title: '找规律',
    grade: 1, category: 'olympiad', difficulty: 1,
    path: 'grade-1/olympiad/find-pattern',
    icon: '🔍',
    summary: '发现数字和图形的排列规律',
    description: '培养观察力和推理能力。',
    knowledgePoints: ['g1-find-pattern']
  },
  {
    id: 'g1-shape-cut-paste',
    title: '图形剪拼',
    grade: 1, category: 'olympiad', difficulty: 2,
    path: 'grade-1/olympiad/shape-cut-paste',
    icon: '✂️',
    summary: '通过剪拼操作理解图形变换',
    description: '培养空间想象力和动手能力。',
    knowledgePoints: ['g1-shape-cut-paste']
  },
  {
    id: 'g1-matchstick-game',
    title: '火柴棒游戏',
    grade: 1, category: 'olympiad', difficulty: 2,
    path: 'grade-1/olympiad/matchstick-game',
    icon: '📍',
    summary: '移动火柴棒改变算式或图形',
    description: '培养灵活思维和空间想象力。',
    knowledgePoints: ['g1-matchstick-game']
  },
  {
    id: 'g1-simple-logic',
    title: '简单逻辑推理',
    grade: 1, category: 'olympiad', difficulty: 2,
    path: 'grade-1/olympiad/simple-logic',
    icon: '🧠',
    summary: '通过条件进行简单推理',
    description: '培养初步的逻辑推理能力。',
    knowledgePoints: ['g1-simple-logic']
  },
  {
    id: 'g1-one-stroke',
    title: '一笔画',
    grade: 1, category: 'olympiad', difficulty: 2,
    path: 'grade-1/olympiad/one-stroke',
    icon: '✏️',
    summary: '判断图形能否一笔画成',
    description: '了解奇点偶点，培养图论直觉。',
    knowledgePoints: ['g1-one-stroke']
  },
  {
    id: 'g1-sudoku-intro',
    title: '数独入门',
    grade: 1, category: 'olympiad', difficulty: 1,
    path: 'grade-1/olympiad/sudoku-intro',
    icon: '🔣',
    summary: '四宫数独基础',
    description: '通过简单的数独游戏培养逻辑推理。',
    knowledgePoints: ['g1-sudoku-intro']
  },
  {
    id: 'g1-count-cubes',
    title: '数小正方体',
    grade: 1, category: 'olympiad', difficulty: 2,
    path: 'grade-1/olympiad/count-cubes',
    icon: '🎲',
    summary: '数出立体图形中的小正方体个数',
    description: '培养空间想象力和有序计数能力。',
    knowledgePoints: ['g1-count-cubes']
  },

  // ======== 二年级 校内基础（6个） ========
  {
    id: 'g2-multiplication-table',
    title: '乘法口诀',
    grade: 2, category: 'basic', difficulty: 1,
    path: 'multiplication-table',
    icon: '✖️',
    summary: '1-9乘法口诀表与应用',
    description: '有趣地背诵并理解乘法口诀，为后续学习打基础。',
    knowledgePoints: ['g2-multiplication-table']
  },
  {
    id: 'g2-division-table',
    title: '表内除法',
    grade: 2, category: 'basic', difficulty: 2,
    path: 'grade-2/basic/division-table',
    icon: '➗',
    summary: '用乘法口诀求商',
    description: '理解除法的含义，熟练进行表内除法。',
    knowledgePoints: ['g2-division-table']
  },
  {
    id: 'g2-mixed-operations',
    title: '混合运算',
    grade: 2, category: 'basic', difficulty: 2,
    path: 'grade-2/basic/mixed-operations',
    icon: '🔢',
    summary: '加减乘除混合运算的顺序',
    description: '掌握运算顺序，正确进行混合运算。',
    knowledgePoints: ['g2-mixed-operations']
  },
  {
    id: 'g2-length-unit',
    title: '长度单位',
    grade: 2, category: 'basic', difficulty: 1,
    path: 'grade-2/basic/length-unit',
    icon: '📏',
    summary: '认识厘米和米',
    description: '建立长度观念，学会测量和估算。',
    knowledgePoints: ['g2-length-unit']
  },
  {
    id: 'g2-mass-unit',
    title: '质量单位',
    grade: 2, category: 'basic', difficulty: 1,
    path: 'grade-2/basic/mass-unit',
    icon: '⚖️',
    summary: '认识克和千克',
    description: '建立质量观念，学会简单的单位换算。',
    knowledgePoints: ['g2-mass-unit']
  },
  {
    id: 'g2-angle-intro',
    title: '角的初步认识',
    grade: 2, category: 'basic', difficulty: 1,
    path: 'grade-2/basic/angle-intro',
    icon: '📐',
    summary: '认识角及其各部分名称',
    description: '通过观察认识角，会比较角的大小。',
    knowledgePoints: ['g2-angle-intro']
  },

  // ======== 二年级 奥数拓展（9个） ========
  {
    id: 'g2-clever-calc',
    title: '巧算入门',
    grade: 2, category: 'olympiad', difficulty: 2,
    path: 'grade-2/olympiad/clever-calc',
    icon: '🧮',
    summary: '凑整法、带符号搬家等巧算技巧',
    description: '学习简便计算方法，提高计算速度。',
    knowledgePoints: ['g2-clever-calc']
  },
  {
    id: 'g2-move-supplement',
    title: '移多补少',
    grade: 2, category: 'olympiad', difficulty: 2,
    path: 'grade-2/olympiad/move-supplement',
    icon: '⚖️',
    summary: '通过移动使两部分相等',
    description: '理解平均分的概念，培养数感。',
    knowledgePoints: ['g2-move-supplement']
  },
  {
    id: 'g2-age-problem-basic',
    title: '年龄问题初步',
    grade: 2, category: 'olympiad', difficulty: 2,
    path: 'grade-2/olympiad/age-problem-basic',
    icon: '🎂',
    summary: '年龄差不变的简单应用',
    description: '理解年龄差不变的道理。',
    knowledgePoints: ['g2-age-problem-basic']
  },
  {
    id: 'g2-equal-replace',
    title: '等量代换',
    grade: 2, category: 'olympiad', difficulty: 2,
    path: 'grade-2/olympiad/equal-replace',
    icon: '🔄',
    summary: '用一个量代替另一个相等的量',
    description: '培养代换思维，为方程学习打基础。',
    knowledgePoints: ['g2-equal-replace']
  },
  {
    id: 'g2-queue-problem',
    title: '排队问题',
    grade: 2, category: 'olympiad', difficulty: 2,
    path: 'grade-2/olympiad/queue-problem',
    icon: '👥',
    summary: '计算排队中的人数',
    description: '理解"第几"和"有几个"的区别。',
    knowledgePoints: ['g2-queue-problem']
  },
  {
    id: 'g2-overlap-problem',
    title: '重叠问题',
    grade: 2, category: 'olympiad', difficulty: 2,
    path: 'grade-2/olympiad/overlap-problem',
    icon: '🔀',
    summary: '两个集合重叠部分的计算',
    description: '理解重叠的含义，学会画图分析。',
    knowledgePoints: ['g2-overlap-problem']
  },
  {
    id: 'g2-count-shapes',
    title: '有序数图形',
    grade: 2, category: 'olympiad', difficulty: 2,
    path: 'grade-2/olympiad/count-shapes',
    icon: '🔷',
    summary: '按顺序数出图形个数',
    description: '培养有序思维和分类计数能力。',
    knowledgePoints: ['g2-count-shapes']
  },
  {
    id: 'g2-list-reasoning',
    title: '列表推理',
    grade: 2, category: 'olympiad', difficulty: 2,
    path: 'grade-2/olympiad/list-reasoning',
    icon: '📋',
    summary: '用列表法进行逻辑推理',
    description: '学会用表格整理条件，进行推理。',
    knowledgePoints: ['g2-list-reasoning']
  },
  {
    id: 'g2-sequence-pattern',
    title: '数列规律',
    grade: 2, category: 'olympiad', difficulty: 2,
    path: 'grade-2/olympiad/sequence-pattern',
    icon: '📈',
    summary: '发现数列的规律并续写',
    description: '培养观察力和归纳能力。',
    knowledgePoints: ['g2-sequence-pattern']
  },

  // ======== 三年级 校内基础（6个） ========
  {
    id: 'g3-multi-digit-multiply',
    title: '多位数乘法',
    grade: 3, category: 'basic', difficulty: 2,
    path: 'grade-3/basic/multi-digit-multiply',
    icon: '✖️',
    summary: '多位数乘一位数、两位数',
    description: '掌握多位数乘法的竖式计算。',
    knowledgePoints: ['g3-multi-digit-multiply']
  },
  {
    id: 'g3-division-vertical',
    title: '除法竖式',
    grade: 3, category: 'basic', difficulty: 2,
    path: 'grade-3/basic/division-vertical',
    icon: '➗',
    summary: '多位数除以一位数',
    description: '掌握除法竖式的书写和计算。',
    knowledgePoints: ['g3-division-vertical']
  },
  {
    id: 'g3-fraction-intro',
    title: '分数初步',
    grade: 3, category: 'basic', difficulty: 2,
    path: 'grade-3/basic/fraction-intro',
    icon: '🍕',
    summary: '认识分数及各部分名称',
    description: '理解分数的含义，认识几分之一。',
    knowledgePoints: ['g3-fraction-intro']
  },
  {
    id: 'g3-perimeter-area',
    title: '周长与面积',
    grade: 3, category: 'basic', difficulty: 2,
    path: 'grade-3/basic/perimeter-area',
    icon: '📐',
    summary: '长方形和正方形的周长与面积',
    description: '理解周长和面积的概念，掌握计算公式。',
    knowledgePoints: ['g3-perimeter-area']
  },
  {
    id: 'g3-year-month-day',
    title: '年月日',
    grade: 3, category: 'basic', difficulty: 2,
    path: 'grade-3/basic/year-month-day',
    icon: '📅',
    summary: '认识年月日及24时计时法',
    description: '了解时间单位，学会计算经过时间。',
    knowledgePoints: ['g3-year-month-day']
  },
  {
    id: 'g3-decimal-intro',
    title: '小数初步',
    grade: 3, category: 'basic', difficulty: 2,
    path: 'grade-3/basic/decimal-intro',
    icon: '🔢',
    summary: '认识小数及简单计算',
    description: '理解小数的含义，会进行简单的小数加减。',
    knowledgePoints: ['g3-decimal-intro']
  },

  // ======== 三年级 奥数专题（12个） ========
  {
    id: 'g3-arithmetic-sequence',
    title: '等差数列',
    grade: 3, category: 'olympiad', difficulty: 3,
    path: 'grade-3/olympiad/arithmetic-sequence',
    icon: '📈',
    summary: '等差数列的通项与求和',
    description: '学习等差数列的基本公式和应用。',
    knowledgePoints: ['g3-arithmetic-sequence']
  },
  {
    id: 'g3-sum-multiple',
    title: '和倍问题',
    grade: 3, category: 'olympiad', difficulty: 3,
    path: 'sum-multiple',
    icon: '🧮',
    summary: '已知两个数的和与倍数关系，求这两个数',
    description: '学习和倍问题的基本模型，画线段图找"一倍数"。',
    knowledgePoints: ['g3-sum-multiple']
  },
  {
    id: 'g3-diff-multiple',
    title: '差倍问题',
    grade: 3, category: 'olympiad', difficulty: 3,
    path: 'diff-multiple',
    icon: '📏',
    summary: '已知两个数的差与倍数关系，求这两个数',
    description: '学习差倍问题的基本模型，熟练使用线段图分析。',
    knowledgePoints: ['g3-diff-multiple']
  },
  {
    id: 'g3-sum-diff',
    title: '和差问题',
    grade: 3, category: 'olympiad', difficulty: 3,
    path: 'sum-diff',
    icon: '⚖️',
    summary: '已知两个数的和与差，求这两个数',
    description: '学习和差问题的基本公式及其应用。',
    knowledgePoints: ['g3-sum-diff']
  },
  {
    id: 'g3-planting-trees',
    title: '植树问题',
    grade: 3, category: 'olympiad', difficulty: 3,
    path: 'planting-trees',
    icon: '🌳',
    summary: '直线与环形上的植树问题',
    description: '理解棵数与间隔数之间的关系，掌握三种基本类型。',
    knowledgePoints: ['g3-planting-trees']
  },
  {
    id: 'g3-period-problem',
    title: '周期问题',
    grade: 3, category: 'olympiad', difficulty: 3,
    path: 'grade-3/olympiad/period-problem',
    icon: '🔄',
    summary: '发现周期规律并解决问题',
    description: '培养发现周期规律的能力。',
    knowledgePoints: ['g3-period-problem']
  },
  {
    id: 'g3-restore-problem',
    title: '还原问题',
    grade: 3, category: 'olympiad', difficulty: 3,
    path: 'grade-3/olympiad/restore-problem',
    icon: '⏪',
    summary: '从结果倒推原来的数',
    description: '培养逆向思维能力。',
    knowledgePoints: ['g3-restore-problem']
  },
  {
    id: 'g3-clever-perimeter',
    title: '巧求周长',
    grade: 3, category: 'olympiad', difficulty: 3,
    path: 'grade-3/olympiad/clever-perimeter',
    icon: '📏',
    summary: '用平移法巧求不规则图形周长',
    description: '学会用平移法将不规则图形转化为规则图形。',
    knowledgePoints: ['g3-clever-perimeter']
  },
  {
    id: 'g3-area-basic',
    title: '面积初步',
    grade: 3, category: 'olympiad', difficulty: 3,
    path: 'grade-3/olympiad/area-basic',
    icon: '◻️',
    summary: '面积的概念与计算方法',
    description: '深入理解面积概念，掌握面积计算技巧。',
    knowledgePoints: ['g3-area-basic']
  },
  {
    id: 'g3-odd-even',
    title: '奇偶性',
    grade: 3, category: 'olympiad', difficulty: 2,
    path: 'grade-3/olympiad/odd-even',
    icon: '🔢',
    summary: '奇数和偶数的性质与应用',
    description: '理解奇偶性的基本概念和运算规律。',
    knowledgePoints: ['g3-odd-even']
  },
  {
    id: 'g3-vertical-puzzle',
    title: '竖式谜',
    grade: 3, category: 'olympiad', difficulty: 3,
    path: 'grade-3/olympiad/vertical-puzzle',
    icon: '❓',
    summary: '补全竖式中的缺失数字',
    description: '培养分析能力和逻辑推理。',
    knowledgePoints: ['g3-vertical-puzzle']
  },
  {
    id: 'g3-add-multiply-principle',
    title: '加乘原理',
    grade: 3, category: 'olympiad', difficulty: 3,
    path: 'grade-3/olympiad/add-multiply-principle',
    icon: '🔀',
    summary: '加法原理与乘法原理初步',
    description: '理解分类计数和分步计数的基本思想。',
    knowledgePoints: ['g3-add-multiply-principle']
  },

  // ======== 四年级 校内基础（7个） ========
  {
    id: 'g4-large-number',
    title: '大数的认识',
    grade: 4, category: 'basic', difficulty: 2,
    path: 'grade-4/basic/large-number',
    icon: '💯',
    summary: '认识亿以内的数',
    description: '掌握大数的读写和比较。',
    knowledgePoints: ['g4-large-number']
  },
  {
    id: 'g4-operation-laws',
    title: '运算定律',
    grade: 4, category: 'basic', difficulty: 2,
    path: 'grade-4/basic/operation-laws',
    icon: '⚖️',
    summary: '加法乘法交换律、结合律、分配律',
    description: '理解运算定律，能进行简便计算。',
    knowledgePoints: ['g4-operation-laws']
  },
  {
    id: 'g4-decimal-multiply',
    title: '小数乘法',
    grade: 4, category: 'basic', difficulty: 3,
    path: 'grade-4/basic/decimal-multiply',
    icon: '🔢',
    summary: '小数乘整数、小数乘小数',
    description: '掌握小数乘法的计算方法。',
    knowledgePoints: ['g4-decimal-multiply']
  },
  {
    id: 'g4-parallel-vertical',
    title: '平行与垂直',
    grade: 4, category: 'basic', difficulty: 2,
    path: 'grade-4/basic/parallel-vertical',
    icon: '📐',
    summary: '认识平行线和垂线',
    description: '理解平行与垂直的概念，能画平行线和垂线。',
    knowledgePoints: ['g4-parallel-vertical']
  },
  {
    id: 'g4-triangle-classify',
    title: '三角形分类',
    grade: 4, category: 'basic', difficulty: 2,
    path: 'grade-4/basic/triangle-classify',
    icon: '🔺',
    summary: '按角和边对三角形分类',
    description: '认识锐角、直角、钝角三角形及等腰、等边三角形。',
    knowledgePoints: ['g4-triangle-classify']
  },
  {
    id: 'g4-bar-chart',
    title: '条形统计图',
    grade: 4, category: 'basic', difficulty: 1,
    path: 'grade-4/basic/bar-chart',
    icon: '📊',
    summary: '认识并绘制条形统计图',
    description: '学会用条形统计图表示数据。',
    knowledgePoints: ['g4-bar-chart']
  },
  {
    id: 'g4-average',
    title: '平均数',
    grade: 4, category: 'basic', difficulty: 2,
    path: 'grade-4/basic/average',
    icon: '📈',
    summary: '理解平均数的意义和求法',
    description: '掌握移多补少法和公式法求平均数。',
    knowledgePoints: ['g4-average']
  },

  // ======== 四年级 奥数专题（17个） ========
  {
    id: 'g4-decimal-clever-calc',
    title: '小数巧算',
    grade: 4, category: 'olympiad', difficulty: 3,
    path: 'grade-4/olympiad/decimal-clever-calc',
    icon: '🧮',
    summary: '小数的简便运算技巧',
    description: '运用运算定律进行小数巧算。',
    knowledgePoints: ['g4-decimal-clever-calc']
  },
  {
    id: 'g4-new-operation',
    title: '定义新运算',
    grade: 4, category: 'olympiad', difficulty: 3,
    path: 'grade-4/olympiad/new-operation',
    icon: '🆕',
    summary: '理解并运用自定义运算',
    description: '培养阅读理解能力和迁移能力。',
    knowledgePoints: ['g4-new-operation']
  },
  {
    id: 'g4-profit-loss-problem',
    title: '盈亏问题',
    grade: 4, category: 'olympiad', difficulty: 4,
    path: 'grade-4/olympiad/profit-loss-problem',
    icon: '💰',
    summary: '分配中的盈与亏',
    description: '理解盈亏问题的基本模型。',
    knowledgePoints: ['g4-profit-loss-problem']
  },
  {
    id: 'g4-chicken-rabbit',
    title: '鸡兔同笼',
    grade: 4, category: 'olympiad', difficulty: 4,
    path: 'chicken-rabbit',
    icon: '🐔',
    summary: '经典的鸡兔同笼问题与多种解法',
    description: '学习假设法、方程法、画图法解决鸡兔同笼问题。',
    knowledgePoints: ['g4-chicken-rabbit']
  },
  {
    id: 'g4-page-number',
    title: '页码问题',
    grade: 4, category: 'olympiad', difficulty: 3,
    path: 'grade-4/olympiad/page-number',
    icon: '📖',
    summary: '计算页码中数字的个数',
    description: '培养分类计数能力。',
    knowledgePoints: ['g4-page-number']
  },
  {
    id: 'g4-matrix-problem',
    title: '方阵问题',
    grade: 4, category: 'olympiad', difficulty: 3,
    path: 'grade-4/olympiad/matrix-problem',
    icon: '🔲',
    summary: '实心方阵与空心方阵',
    description: '理解方阵的特点，掌握相关计算。',
    knowledgePoints: ['g4-matrix-problem']
  },
  {
    id: 'g4-inclusion-exclusion',
    title: '容斥原理',
    grade: 4, category: 'olympiad', difficulty: 3,
    path: 'grade-4/olympiad/inclusion-exclusion',
    icon: '🔀',
    summary: '两个集合的容斥原理',
    description: '理解包含与排除的思想。',
    knowledgePoints: ['g4-inclusion-exclusion']
  },
  {
    id: 'g4-equal-area',
    title: '等积变形',
    grade: 4, category: 'olympiad', difficulty: 4,
    path: 'modules/geometry/equal-area',
    icon: '🔺',
    summary: '等底等高的三角形面积相等',
    description: '理解等积变形的原理和应用。',
    knowledgePoints: ['g4-equal-area']
  },
  {
    id: 'g4-half-model',
    title: '一半模型',
    grade: 4, category: 'olympiad', difficulty: 4,
    path: 'grade-4/olympiad/half-model',
    icon: '✂️',
    summary: '三角形面积是平行四边形的一半',
    description: '掌握一半模型的基本形式。',
    knowledgePoints: ['g4-half-model']
  },
  {
    id: 'g4-cut-paste-method',
    title: '割补法',
    grade: 4, category: 'olympiad', difficulty: 3,
    path: 'grade-4/olympiad/cut-paste-method',
    icon: '✂️',
    summary: '割补法求面积',
    description: '学会用割补法将不规则图形转化为规则图形。',
    knowledgePoints: ['g4-cut-paste-method']
  },
  {
    id: 'g4-angle-calc',
    title: '角的计算',
    grade: 4, category: 'olympiad', difficulty: 3,
    path: 'grade-4/olympiad/angle-calc',
    icon: '📐',
    summary: '利用三角形内角和求角度',
    description: '掌握三角形内角和及外角性质。',
    knowledgePoints: ['g4-angle-calc']
  },
  {
    id: 'g4-divisibility',
    title: '整除特征',
    grade: 4, category: 'olympiad', difficulty: 3,
    path: 'modules/calculation/divisibility',
    icon: '🔢',
    summary: '常见数的整除特征',
    description: '掌握2、3、5、9、11等数的整除特征。',
    knowledgePoints: ['g4-divisibility']
  },
  {
    id: 'g4-prime-composite',
    title: '质数与合数',
    grade: 4, category: 'olympiad', difficulty: 3,
    path: 'grade-4/olympiad/prime-composite',
    icon: '🔢',
    summary: '质数、合数的判断',
    description: '理解质数与合数的概念，能判断一个数是质数还是合数。',
    knowledgePoints: ['g4-prime-composite']
  },
  {
    id: 'g4-prime-factorization',
    title: '分解质因数',
    grade: 4, category: 'olympiad', difficulty: 3,
    path: 'grade-4/olympiad/prime-factorization',
    icon: '🔨',
    summary: '短除法分解质因数',
    description: '掌握分解质因数的方法。',
    knowledgePoints: ['g4-prime-factorization']
  },
  {
    id: 'g4-gcd-lcm',
    title: '最大公因数与最小公倍数',
    grade: 4, category: 'olympiad', difficulty: 3,
    path: 'grade-4/olympiad/gcd-lcm',
    icon: '⚖️',
    summary: '求最大公因数和最小公倍数',
    description: '掌握短除法求最大公因数和最小公倍数。',
    knowledgePoints: ['g4-gcd-lcm']
  },
  {
    id: 'g4-pigeonhole',
    title: '抽屉原理',
    grade: 4, category: 'olympiad', difficulty: 4,
    path: 'grade-4/olympiad/pigeonhole',
    icon: '📦',
    summary: '最简单的抽屉原理',
    description: '理解抽屉原理的基本形式。',
    knowledgePoints: ['g4-pigeonhole']
  },
  {
    id: 'g4-logic-advanced',
    title: '逻辑推理进阶',
    grade: 4, category: 'olympiad', difficulty: 4,
    path: 'grade-4/olympiad/logic-advanced',
    icon: '🧠',
    summary: '复杂的逻辑推理问题',
    description: '综合运用多种方法进行逻辑推理。',
    knowledgePoints: ['g4-logic-advanced']
  },

  // ======== 五年级 校内基础（6个） ========
  {
    id: 'g5-simple-equation',
    title: '简易方程',
    grade: 5, category: 'basic', difficulty: 3,
    path: 'equation-intro',
    icon: '🔤',
    summary: '一元一次方程的解法与应用',
    description: '掌握移项、合并同类项，能用方程解应用题。',
    knowledgePoints: ['g5-simple-equation']
  },
  {
    id: 'g5-fraction-meaning',
    title: '分数的意义',
    grade: 5, category: 'basic', difficulty: 2,
    path: 'grade-5/basic/fraction-meaning',
    icon: '🍕',
    summary: '分数与除法的关系',
    description: '深入理解分数的意义。',
    knowledgePoints: ['g5-fraction-meaning']
  },
  {
    id: 'g5-polygon-area',
    title: '多边形面积',
    grade: 5, category: 'basic', difficulty: 3,
    path: 'grade-5/basic/polygon-area',
    icon: '◻️',
    summary: '平行四边形、三角形、梯形面积',
    description: '掌握多边形面积公式的推导和应用。',
    knowledgePoints: ['g5-polygon-area']
  },
  {
    id: 'g5-cube-cuboid',
    title: '长方体和正方体',
    grade: 5, category: 'basic', difficulty: 3,
    path: 'grade-5/basic/cube-cuboid',
    icon: '📦',
    summary: '表面积和体积的计算',
    description: '理解表面积和体积的概念，掌握计算方法。',
    knowledgePoints: ['g5-cube-cuboid']
  },
  {
    id: 'g5-probability',
    title: '可能性',
    grade: 5, category: 'basic', difficulty: 1,
    path: 'grade-5/basic/probability',
    icon: '🎲',
    summary: '事件发生的可能性大小',
    description: '理解可能性的概念，能描述可能性大小。',
    knowledgePoints: ['g5-probability']
  },
  {
    id: 'g5-fraction-add-sub',
    title: '分数加减法',
    grade: 5, category: 'basic', difficulty: 2,
    path: 'fraction-add-sub',
    icon: '➗',
    summary: '同分母与异分母分数的加减',
    description: '掌握通分、约分，熟练进行分数加减运算。',
    knowledgePoints: ['g5-fraction-add-sub']
  },

  // ======== 五年级 奥数专题（20个） ========
  {
    id: 'g5-fraction-split',
    title: '分数的拆分',
    grade: 5, category: 'olympiad', difficulty: 4,
    path: 'fraction-split',
    icon: '🧩',
    summary: '分数单位分拆与裂项技巧',
    description: '学习分数拆分的基本方法，包括单位分数拆分。',
    knowledgePoints: ['g5-fraction-split']
  },
  {
    id: 'g5-compare-estimate',
    title: '比较与估算',
    grade: 5, category: 'olympiad', difficulty: 3,
    path: 'grade-5/olympiad/compare-estimate',
    icon: '⚖️',
    summary: '分数、小数的大小比较',
    description: '掌握多种比较方法。',
    knowledgePoints: ['g5-compare-estimate']
  },
  {
    id: 'g5-complex-fraction',
    title: '繁分数化简',
    grade: 5, category: 'olympiad', difficulty: 4,
    path: 'grade-5/olympiad/complex-fraction',
    icon: '🔢',
    summary: '从最底层开始逐层化简',
    description: '掌握繁分数化简的方法。',
    knowledgePoints: ['g5-complex-fraction']
  },
  {
    id: 'g5-fraction-word-problem',
    title: '分数应用题',
    grade: 5, category: 'olympiad', difficulty: 4,
    path: 'grade-5/olympiad/fraction-word-problem',
    icon: '📝',
    summary: '分数应用题的综合解法',
    description: '掌握量率对应等解题方法。',
    knowledgePoints: ['g5-fraction-word-problem']
  },
  {
    id: 'g5-engineering-problem',
    title: '工程问题',
    grade: 5, category: 'olympiad', difficulty: 4,
    path: 'grade-5/olympiad/engineering-problem',
    icon: '🏗️',
    summary: '工作效率、时间、工作量',
    description: '理解工程问题的基本模型。',
    knowledgePoints: ['g5-engineering-problem']
  },
  {
    id: 'g5-concentration-problem',
    title: '浓度问题',
    grade: 5, category: 'olympiad', difficulty: 4,
    path: 'grade-5/olympiad/concentration-problem',
    icon: '🧪',
    summary: '溶质、溶剂、溶液的关系',
    description: '掌握浓度问题的基本公式。',
    knowledgePoints: ['g5-concentration-problem']
  },
  {
    id: 'g5-profit-loss',
    title: '利润与亏损',
    grade: 5, category: 'olympiad', difficulty: 4,
    path: 'profit-loss',
    icon: '💰',
    summary: '成本、售价、利润、折扣的关系',
    description: '理解利润问题中的基本概念与常见模型。',
    knowledgePoints: ['g5-profit-loss']
  },
  {
    id: 'g5-cow-grass-problem',
    title: '牛吃草问题',
    grade: 5, category: 'olympiad', difficulty: 5,
    path: 'grade-5/olympiad/cow-grass-problem',
    icon: '🐄',
    summary: '草生长与牛吃草的动态平衡',
    description: '理解牛吃草问题的基本模型。',
    knowledgePoints: ['g5-cow-grass-problem']
  },
  {
    id: 'g5-ratio-proportion',
    title: '比和比例应用题',
    grade: 5, category: 'olympiad', difficulty: 4,
    path: 'grade-5/olympiad/ratio-proportion',
    icon: '📊',
    summary: '按比例分配与比例应用',
    description: '掌握比和比例的应用题解法。',
    knowledgePoints: ['g5-ratio-proportion']
  },
  {
    id: 'g5-butterfly-model',
    title: '蝴蝶模型',
    grade: 5, category: 'olympiad', difficulty: 4,
    path: 'grade-5/olympiad/butterfly-model',
    icon: '🦋',
    summary: '梯形中的蝴蝶模型',
    description: '掌握蝴蝶模型的面积比例关系。',
    knowledgePoints: ['g5-butterfly-model']
  },
  {
    id: 'g5-swallowtail-model',
    title: '燕尾模型',
    grade: 5, category: 'olympiad', difficulty: 4,
    path: 'grade-5/olympiad/swallowtail-model',
    icon: '🐦',
    summary: '三角形中的燕尾模型',
    description: '掌握燕尾模型的面积比例关系。',
    knowledgePoints: ['g5-swallowtail-model']
  },
  {
    id: 'g5-birdhead-model',
    title: '鸟头模型',
    grade: 5, category: 'olympiad', difficulty: 4,
    path: 'grade-5/olympiad/birdhead-model',
    icon: '🐦',
    summary: '共角三角形的面积比',
    description: '掌握鸟头模型的面积比例关系。',
    knowledgePoints: ['g5-birdhead-model']
  },
  {
    id: 'g5-hourglass-model',
    title: '沙漏模型',
    grade: 5, category: 'olympiad', difficulty: 4,
    path: 'grade-5/olympiad/hourglass-model',
    icon: '⏳',
    summary: '梯形中的沙漏模型',
    description: '掌握沙漏模型的相似比关系。',
    knowledgePoints: ['g5-hourglass-model']
  },
  {
    id: 'g5-solid-geometry-advanced',
    title: '立体几何进阶',
    grade: 5, category: 'olympiad', difficulty: 4,
    path: 'grade-5/olympiad/solid-geometry-advanced',
    icon: '📦',
    summary: '立体图形的表面积与体积综合',
    description: '掌握立体几何的综合问题。',
    knowledgePoints: ['g5-solid-geometry-advanced']
  },
  {
    id: 'g5-number-theory',
    title: '数论初步',
    grade: 5, category: 'olympiad', difficulty: 5,
    path: 'number-theory',
    icon: '🔢',
    summary: '整除、质数、合数与奇偶性',
    description: '学习数论基础概念与常见整除特征。',
    knowledgePoints: ['g5-number-theory']
  },
  {
    id: 'g5-congruence-theorem',
    title: '同余定理',
    grade: 5, category: 'olympiad', difficulty: 5,
    path: 'grade-5/olympiad/congruence-theorem',
    icon: '🔢',
    summary: '同余的概念与性质',
    description: '理解同余的概念和基本性质。',
    knowledgePoints: ['g5-congruence-theorem']
  },
  {
    id: 'g5-perfect-square',
    title: '完全平方数',
    grade: 5, category: 'olympiad', difficulty: 4,
    path: 'grade-5/olympiad/perfect-square',
    icon: '🔲',
    summary: '完全平方数的性质',
    description: '掌握完全平方数的性质和判定。',
    knowledgePoints: ['g5-perfect-square']
  },
  {
    id: 'g5-indeterminate-equation',
    title: '不定方程入门',
    grade: 5, category: 'olympiad', difficulty: 4,
    path: 'grade-5/olympiad/indeterminate-equation',
    icon: '❓',
    summary: '二元一次不定方程',
    description: '学会解简单的不定方程。',
    knowledgePoints: ['g5-indeterminate-equation']
  },
  {
    id: 'g5-permutation-combination',
    title: '排列组合初步',
    grade: 5, category: 'olympiad', difficulty: 4,
    path: 'grade-5/olympiad/permutation-combination',
    icon: '🔀',
    summary: '排列与组合的基本概念',
    description: '理解排列与组合的区别。',
    knowledgePoints: ['g5-permutation-combination']
  },
  {
    id: 'g5-number-array',
    title: '数阵图',
    grade: 5, category: 'olympiad', difficulty: 4,
    path: 'grade-5/olympiad/number-array',
    icon: '🔢',
    summary: '将数填入图形使满足条件',
    description: '培养逻辑推理和尝试能力。',
    knowledgePoints: ['g5-number-array']
  },
  {
    id: 'g5-complex-logic',
    title: '复杂逻辑推理',
    grade: 5, category: 'olympiad', difficulty: 5,
    path: 'grade-5/olympiad/complex-logic',
    icon: '🧠',
    summary: '综合逻辑推理问题',
    description: '综合运用多种推理方法。',
    knowledgePoints: ['g5-complex-logic']
  },

  // ======== 六年级 校内基础（8个） ========
  {
    id: 'g6-fraction-multiply-divide',
    title: '分数乘除法',
    grade: 6, category: 'basic', difficulty: 3,
    path: 'grade-6/basic/fraction-multiply-divide',
    icon: '✖️',
    summary: '分数乘整数、分数乘分数、分数除法',
    description: '掌握分数乘除法的计算方法。',
    knowledgePoints: ['g6-fraction-multiply-divide']
  },
  {
    id: 'g6-ratio-proportion',
    title: '比和比例',
    grade: 6, category: 'basic', difficulty: 3,
    path: 'grade-6/basic/ratio-proportion',
    icon: '📊',
    summary: '比的基本性质与比例应用',
    description: '理解比和比例的概念，能解决比例应用题。',
    knowledgePoints: ['g6-ratio-proportion']
  },
  {
    id: 'g6-percentage',
    title: '百分数',
    grade: 6, category: 'basic', difficulty: 2,
    path: 'grade-6/basic/percentage',
    icon: '%',
    summary: '百分数的意义与应用',
    description: '理解百分数的含义，会进行百分数计算。',
    knowledgePoints: ['g6-percentage']
  },
  {
    id: 'g6-circle-area',
    title: '圆的周长与面积',
    grade: 6, category: 'basic', difficulty: 3,
    path: 'circle-area',
    icon: '⭕',
    summary: '圆的认识、周长与面积计算',
    description: '掌握圆的基本性质，计算圆的周长和面积。',
    knowledgePoints: ['g6-circle-area']
  },
  {
    id: 'g6-cylinder',
    title: '圆柱',
    grade: 6, category: 'basic', difficulty: 3,
    path: 'grade-6/basic/cylinder',
    icon: '🛢️',
    summary: '圆柱的表面积与体积',
    description: '掌握圆柱的表面积和体积计算。',
    knowledgePoints: ['g6-cylinder']
  },
  {
    id: 'g6-cone',
    title: '圆锥',
    grade: 6, category: 'basic', difficulty: 3,
    path: 'grade-6/basic/cone',
    icon: '🔺',
    summary: '圆锥的体积计算',
    description: '掌握圆锥的体积计算。',
    knowledgePoints: ['g6-cone']
  },
  {
    id: 'g6-negative-number',
    title: '负数',
    grade: 6, category: 'basic', difficulty: 2,
    path: 'grade-6/basic/negative-number',
    icon: '🔢',
    summary: '负数的认识与比较',
    description: '理解负数的含义，会比较大小。',
    knowledgePoints: ['g6-negative-number']
  },
  {
    id: 'g6-pie-chart',
    title: '扇形统计图',
    grade: 6, category: 'basic', difficulty: 2,
    path: 'grade-6/basic/pie-chart',
    icon: '🥧',
    summary: '认识并绘制扇形统计图',
    description: '学会用扇形统计图表示数据。',
    knowledgePoints: ['g6-pie-chart']
  },

  // ======== 六年级 奥数专题（16个） ========
  {
    id: 'g6-complex-fraction-split',
    title: '复杂分数裂项',
    grade: 6, category: 'olympiad', difficulty: 5,
    path: 'grade-6/olympiad/complex-fraction-split',
    icon: '🧩',
    summary: '复杂的分数裂项技巧',
    description: '掌握更复杂的分数裂项方法。',
    knowledgePoints: ['g6-complex-fraction-split']
  },
  {
    id: 'g6-travel-problem',
    title: '行程问题综合',
    grade: 6, category: 'olympiad', difficulty: 5,
    path: 'travel-problem',
    icon: '🚗',
    summary: '相遇、追及与综合行程问题',
    description: '掌握"路程=速度×时间"及相遇、追及模型。',
    knowledgePoints: ['g6-travel-problem']
  },
  {
    id: 'g6-meet-chase',
    title: '相遇追及',
    grade: 6, category: 'olympiad', difficulty: 4,
    path: 'grade-6/olympiad/meet-chase',
    icon: '🏃',
    summary: '相遇问题与追及问题',
    description: '掌握相遇和追及的基本公式。',
    knowledgePoints: ['g6-meet-chase']
  },
  {
    id: 'g6-train-bridge',
    title: '火车过桥',
    grade: 6, category: 'olympiad', difficulty: 4,
    path: 'grade-6/olympiad/train-bridge',
    icon: '🚂',
    summary: '火车过桥、过隧道问题',
    description: '理解火车长度对行程的影响。',
    knowledgePoints: ['g6-train-bridge']
  },
  {
    id: 'g6-circular-track',
    title: '环形跑道',
    grade: 6, category: 'olympiad', difficulty: 4,
    path: 'grade-6/olympiad/circular-track',
    icon: '🏟️',
    summary: '环形跑道上的相遇追及',
    description: '掌握环形跑道上的行程问题。',
    knowledgePoints: ['g6-circular-track']
  },
  {
    id: 'g6-boat-stream',
    title: '流水行船',
    grade: 6, category: 'olympiad', difficulty: 4,
    path: 'grade-6/olympiad/boat-stream',
    icon: '🚢',
    summary: '顺水、逆水速度问题',
    description: '理解水流对船速的影响。',
    knowledgePoints: ['g6-boat-stream']
  },
  {
    id: 'g6-ratio-travel',
    title: '比例解行程',
    grade: 6, category: 'olympiad', difficulty: 5,
    path: 'grade-6/olympiad/ratio-travel',
    icon: '📊',
    summary: '用比例方法解行程问题',
    description: '掌握比例法解行程问题。',
    knowledgePoints: ['g6-ratio-travel']
  },
  {
    id: 'g6-complex-engineering',
    title: '复杂工程问题',
    grade: 6, category: 'olympiad', difficulty: 4,
    path: 'grade-6/olympiad/complex-engineering',
    icon: '🏗️',
    summary: '多人合作、轮流工作等复杂工程',
    description: '掌握复杂工程问题的解法。',
    knowledgePoints: ['g6-complex-engineering']
  },
  {
    id: 'g6-complex-concentration',
    title: '复杂浓度问题',
    grade: 6, category: 'olympiad', difficulty: 4,
    path: 'grade-6/olympiad/complex-concentration',
    icon: '🧪',
    summary: '多次混合、蒸发等复杂浓度',
    description: '掌握复杂浓度问题的解法。',
    knowledgePoints: ['g6-complex-concentration']
  },
  {
    id: 'g6-complex-economic',
    title: '复杂经济问题',
    grade: 6, category: 'olympiad', difficulty: 4,
    path: 'grade-6/olympiad/complex-economic',
    icon: '💰',
    summary: '利润、折扣、利息综合',
    description: '掌握复杂经济问题的解法。',
    knowledgePoints: ['g6-complex-economic']
  },
  {
    id: 'g6-curve-geometry',
    title: '曲线几何综合',
    grade: 6, category: 'olympiad', difficulty: 5,
    path: 'grade-6/olympiad/curve-geometry',
    icon: '⭕',
    summary: '圆与扇形的综合问题',
    description: '掌握曲线几何的综合问题。',
    knowledgePoints: ['g6-curve-geometry']
  },
  {
    id: 'g6-general-horse',
    title: '几何最值（将军饮马）',
    grade: 6, category: 'olympiad', difficulty: 5,
    path: 'grade-6/olympiad/general-horse',
    icon: '🐴',
    summary: '利用对称求最短路径',
    description: '掌握将军饮马问题的解法。',
    knowledgePoints: ['g6-general-horse']
  },
  {
    id: 'g6-number-system',
    title: '进位制',
    grade: 6, category: 'olympiad', difficulty: 4,
    path: 'grade-6/olympiad/number-system',
    icon: '🔢',
    summary: '二进制、八进制等进位制',
    description: '理解不同进位制的转换。',
    knowledgePoints: ['g6-number-system']
  },
  {
    id: 'g6-indeterminate-advanced',
    title: '不定方程进阶',
    grade: 6, category: 'olympiad', difficulty: 5,
    path: 'grade-6/olympiad/indeterminate-advanced',
    icon: '❓',
    summary: '更复杂的不定方程',
    description: '掌握不定方程的进阶解法。',
    knowledgePoints: ['g6-indeterminate-advanced']
  },
  {
    id: 'g6-coloring-problem',
    title: '染色问题',
    grade: 6, category: 'olympiad', difficulty: 5,
    path: 'grade-6/olympiad/coloring-problem',
    icon: '🎨',
    summary: '用染色法证明存在性',
    description: '掌握染色法的基本思想。',
    knowledgePoints: ['g6-coloring-problem']
  },
  {
    id: 'g6-winning-strategy',
    title: '必胜策略',
    grade: 6, category: 'olympiad', difficulty: 5,
    path: 'grade-6/olympiad/winning-strategy',
    icon: '🏆',
    summary: '博弈游戏中的必胜策略',
    description: '掌握博弈论的基本思想。',
    knowledgePoints: ['g6-winning-strategy']
  },
  {
    id: 'g6-primary-middle-bridge',
    title: '小初衔接',
    grade: 6, category: 'olympiad', difficulty: 3,
    path: 'grade-6/olympiad/primary-middle-bridge',
    icon: '🌉',
    summary: '小学到初中的过渡内容',
    description: '为初中学习做好准备。',
    knowledgePoints: ['g6-primary-middle-bridge']
  },
  {
    id: 'g6-geometry-model',
    title: '几何模型',
    grade: 6, category: 'olympiad', difficulty: 4,
    path: 'geometry-model',
    icon: '🔺',
    summary: '等积变换、一半模型与蝴蝶模型',
    description: '了解常见几何模型，灵活解决面积问题。',
    knowledgePoints: ['g6-geometry-model']
  }
]

function parseCustomBlocks(markdown: string): { content: string; cards: CardBlock[] } {
  const cards: CardBlock[] = []
  let content = markdown

  CARD_TYPES.forEach(type => {
    const regex = new RegExp(`:::${type}-card\\b([\\s\\S]*?):::`, 'g')
    content = content.replace(regex, (_, inner) => {
      const titleMatch = inner.match(/###\\s+(.+)/)
      const title = titleMatch ? titleMatch[1].trim() : ''
      const bodyContent = inner
        .replace(/###\\s+.+\\n?/, '')
        .replace(/:::[\\w-]*\\n?/g, '')
        .trim()

      if (type === 'variant') {
        const variantIndex = cards.filter(c => c.type === 'variant').length + 1
        cards.push({ type, title, content: bodyContent, variantIndex })
      } else {
        cards.push({ type, title, content: bodyContent })
      }

      return ''
    })
  })

  return { content: content.trim(), cards }
}

function renderMarkdown(text: string): string {
  const renderer = new marked.Renderer()

  renderer.heading = (text: string, depth: number) => {
    const id = String(text).toLowerCase().replace(/\\s+/g, '-')
    return `<h${depth} id="${id}">${text}</h${depth}>`
  }

  marked.setOptions({
    renderer,
    gfm: true,
    breaks: true,
    smartLists: true,
    sanitize: false
  } as any)
  return marked.parse(text) as string
}

export interface ParsedContent {
  raw: string
  html: string
  cards: CardBlock[]
  title?: string
  summary?: string
  prerequisites?: string[]
}

export function parseTopicMarkdown(markdown: string): ParsedContent {
  const { content, cards } = parseCustomBlocks(markdown)

  const titleMatch = content.match(/^#\\s+(.+)/m)
  const title = titleMatch ? titleMatch[1].trim() : undefined

  const summaryMatch = content.match(/##\\s+[\\u4e00-\\u9fa5]+\\n+([\\s\\S]+?)(?=##|$)/)
  const summary = summaryMatch ? summaryMatch[1].trim() : undefined

  const prerequisitesMatch = content.match(/- [^\\n]+/g)
  const prerequisites = prerequisitesMatch?.map(p => p.replace(/^-\\s+/, '').trim())

  return {
    raw: content,
    html: renderMarkdown(content),
    cards,
    title,
    summary,
    prerequisites
  }
}

export async function loadTopicContent(path: string): Promise<ParsedContent> {
  const url = `/content/${path}.md`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to load content: ${path}`)
  }

  const markdown = await response.text()
  return parseTopicMarkdown(markdown)
}

export function getCardComponent(type: string): string {
  const map: Record<string, string> = {
    story: 'StoryCard',
    concept: 'ConceptCard',
    example: 'ExampleCard',
    variant: 'VariantCard',
    mistake: 'MistakeCard',
    'parent-child': 'ParentChildCard'
  }
  return map[type] || 'div'
}

/**
 * 返回所有专题列表（给 LearningPage / LearningPath 使用）
 */
export function listTopics(): TopicIndex[] {
  return TOPIC_INDEX.map(meta => ({
    id: meta.id,
    title: meta.title,
    grade: meta.grade,
    category: meta.category,
    difficulty: meta.difficulty,
    summary: meta.summary,
    icon: meta.icon,
    path: meta.path
  }))
}

/**
 * 根据年级筛选专题
 */
export function getTopicByGrade(grade: 1 | 2 | 3 | 4 | 5 | 6): TopicIndex[] {
  return listTopics().filter(t => t.grade === grade)
}

/**
 * 根据分类筛选专题
 */
export function getTopicByCategory(category: 'basic' | 'olympiad'): TopicIndex[] {
  return listTopics().filter(t => t.category === category)
}

/**
 * 加载某个专题的完整数据（元信息 + 卡片内容）
 */
export async function loadTopic(id: string): Promise<KnowledgeTopic | null> {
  const meta = TOPIC_INDEX.find(t => t.id === id)
  if (!meta) return null

  try {
    const parsed = await loadTopicContent(meta.path)
    return {
      id: meta.id,
      title: meta.title,
      grade: meta.grade,
      category: meta.category,
      difficulty: meta.difficulty,
      summary: parsed.summary || meta.summary,
      prerequisites: parsed.prerequisites || [],
      cards: parsed.cards,
      exercises: meta.knowledgePoints
    }
  } catch (err) {
    console.error(`[contentLoader] Failed to load topic "${id}":`, err)
    return null
  }
}
