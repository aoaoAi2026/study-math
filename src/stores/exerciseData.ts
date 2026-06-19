import type { Exercise } from '@/types/exercise'

export const EXERCISE_POOL: Exercise[] = [
  {
    id: 'sum-m-01', knowledgePoints: ['g3-sum-multiple'], type: 'choice', difficulty: 1,
    stem: '两数之和为 36，大数是小数的 3 倍。小数是多少？',
    options: ['6', '9', '12', '27'], answer: '1',
    solution: [{ description: '小数 = 36 ÷ (3+1) = 9' }],
    hints: ['先画线段图：小数 1 段，大数 3 段', '总段数 = 1+3 = 4'],
    commonMistakes: [{ mistake: '36÷3=12', reason: '忘记+1', correction: '36÷4=9', errorLayer: 'L2' }],
    irtParams: { a: 1, b: -1, c: 0.25 }, estimatedTime: 60,
  },
  {
    id: 'sum-m-02', knowledgePoints: ['g3-sum-multiple'], type: 'fill', difficulty: 2,
    stem: '苹果和梨共 80 个，苹果是梨的 4 倍。梨有 ___ 个，苹果有 ___ 个。',
    answer: '16',
    solution: [{ description: '梨 = 80 ÷ (4+1) = 16，苹果 = 16×4 = 64' }],
    hints: ['总段数 = 5', '每段 = 80÷5 = 16'],
    commonMistakes: [{ mistake: '80÷4=20', reason: '忘记+1', correction: '80÷5=16', errorLayer: 'L2' }],
    irtParams: { a: 1.2, b: 0, c: 0.2 }, estimatedTime: 90,
  },
  {
    id: 'diff-m-01', knowledgePoints: ['g3-diff-multiple'], type: 'choice', difficulty: 1,
    stem: '两数之差为 24，大数是小数的 4 倍。小数是多少？',
    options: ['6', '8', '12', '32'], answer: '1',
    solution: [{ description: '小数 = 24 ÷ (4-1) = 8' }],
    hints: ['差对应的段数 = 4-1 = 3', '每段 = 24÷3 = 8'],
    commonMistakes: [{ mistake: '24÷4=6', reason: '用倍数而不用倍数-1', correction: '24÷3=8', errorLayer: 'L2' }],
    irtParams: { a: 1, b: -0.5, c: 0.25 }, estimatedTime: 60,
  },
  {
    id: 'diff-m-02', knowledgePoints: ['g3-diff-multiple'], type: 'fill', difficulty: 2,
    stem: '哥哥比弟弟多 45 元，哥哥的钱是弟弟的 6 倍。弟弟有 ___ 元。',
    answer: '9',
    solution: [{ description: '弟弟 = 45 ÷ (6-1) = 9' }],
    hints: ['差 = 45 对应 5 段', '每段 = 45÷5 = 9'],
    commonMistakes: [{ mistake: '45÷6=7.5', reason: '倍数-1 概念不清', correction: '45÷5=9', errorLayer: 'L2' }],
    irtParams: { a: 1.2, b: 0.3, c: 0.2 }, estimatedTime: 90,
  },
  {
    id: 'sum-d-01', knowledgePoints: ['g3-sum-diff'], type: 'choice', difficulty: 1,
    stem: '两数之和为 30，两数之差为 10。较大的数是多少？',
    options: ['10', '15', '20', '25'], answer: '2',
    solution: [{ description: '大数 = (30+10)÷2 = 20' }],
    hints: ['大数 = (和+差)÷2', '小数 = (和-差)÷2'],
    commonMistakes: [{ mistake: '30÷2=15', reason: '忘记利用差', correction: '(30+10)÷2=20', errorLayer: 'L2' }],
    irtParams: { a: 1, b: -0.3, c: 0.25 }, estimatedTime: 60,
  },
  {
    id: 'sum-d-02', knowledgePoints: ['g3-sum-diff'], type: 'fill', difficulty: 2,
    stem: '两数之和为 64，两数之差为 18。较大数 = ___，较小数 = ___。',
    answer: '41',
    solution: [{ description: '大数 = (64+18)÷2 = 41，小数 = (64-18)÷2 = 23' }],
    hints: ['大数 = (和+差)÷2', '小数 = (和-差)÷2'],
    commonMistakes: [{ mistake: '64+18=82，82÷2=41 对的，但小数写成 41-18=23 错写成其他', reason: '计算错误', correction: '41 和 23', errorLayer: 'L3' }],
    irtParams: { a: 1.2, b: 0.5, c: 0.2 }, estimatedTime: 90,
  },
  {
    id: 'arith-01', knowledgePoints: ['g3-arithmetic-seq'], type: 'choice', difficulty: 1,
    stem: '等差数列 2, 5, 8, 11, ... 的第 10 项是多少？',
    options: ['26', '29', '32', '35'], answer: '1',
    solution: [{ description: '首项=2，公差=3，第10项 = 2 + 9×3 = 29' }],
    hints: ['公差 = 5-2 = 3', '第 n 项 = 首项 + (n-1)×公差'],
    commonMistakes: [{ mistake: '2+10×3=32', reason: '使用 n 而非 n-1', correction: '2+9×3=29', errorLayer: 'L2' }],
    irtParams: { a: 1, b: -0.2, c: 0.25 }, estimatedTime: 60,
  },
  {
    id: 'arith-02', knowledgePoints: ['g3-arithmetic-seq'], type: 'fill', difficulty: 2,
    stem: '等差数列 1, 4, 7, 10, ... 的前 10 项之和是 ___。',
    answer: '145',
    solution: [{ description: '末项 = 1+9×3 = 28，和 = (1+28)×10÷2 = 145' }],
    hints: ['先求末项', '和 = (首项+末项)×项数÷2'],
    commonMistakes: [{ mistake: '(1+28)×10=290', reason: '忘记÷2', correction: '290÷2=145', errorLayer: 'L3' }],
    irtParams: { a: 1.2, b: 0.4, c: 0.2 }, estimatedTime: 90,
  },
  {
    id: 'plant-01', knowledgePoints: ['g3-plant'], type: 'choice', difficulty: 1,
    stem: '一条小路长 30 米，每 5 米种 1 棵树，两端都种。共多少棵？',
    options: ['5', '6', '7', '8'], answer: '2',
    solution: [{ description: '间隔数 = 30÷5 = 6，棵数 = 6+1 = 7' }],
    hints: ['先求间隔数 = 距离÷间隔', '两端都种 → 棵数 = 间隔数+1'],
    commonMistakes: [{ mistake: '30÷5=6 不加 1', reason: '忽略"两端都种"', correction: '6+1=7', errorLayer: 'L1' }],
    irtParams: { a: 1, b: -0.5, c: 0.25 }, estimatedTime: 60,
  },
  {
    id: 'plant-02', knowledgePoints: ['g3-plant'], type: 'fill', difficulty: 2,
    stem: '圆形花园周长 48 米，每 4 米种 1 株花。共 ___ 株。',
    answer: '12',
    solution: [{ description: '封闭图形：棵数 = 间隔数 = 48÷4 = 12' }],
    hints: ['封闭图形：棵数 = 间隔数'],
    commonMistakes: [{ mistake: '48÷4+1=13', reason: '混淆直线和环形', correction: '48÷4=12', errorLayer: 'L2' }],
    irtParams: { a: 1.2, b: 0.3, c: 0.2 }, estimatedTime: 60,
  }
]

export function findByKnowledge(kp: string): Exercise[] {
  return EXERCISE_POOL.filter(e => e.knowledgePoints.includes(kp))
}

export function randomPick(pool: Exercise[], count: number): Exercise[] {
  const copy = pool.slice()
  const out: Exercise[] = []
  for (let i = 0; i < count && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length)
    out.push(copy.splice(idx, 1)[0])
  }
  return out
}
