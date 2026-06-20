import type { Exercise } from '@/types/exercise'

type Q = Exercise
const mk = (q: Q): Q => q

/**
 * 题库
 * knowledgePoints 必须与 contentLoader.ts 中的 topic.id 保持一致
 */
export const EXERCISE_POOL: Exercise[] = [
  // ============= g1-addition-within-20 =============
  mk({ id: 'g1-add-01', knowledgePoints: ['g1-addition-within-20'], type: 'choice', difficulty: 1,
    stem: '9 + 5 = ?', options: ['12','13','14','15'], answer: '2',
    solution: [{ description: '9+1=10，10+4=14（凑十法）' }], hints: ['先把 9 凑成 10', '需要从 5 里拿 1 给 9'],
    commonMistakes: [{ mistake: '9+5=13', reason: '忘进位', correction: '9+1=10，10+4=14', errorLayer: 'L2' }],
    irtParams: { a: 1, b: -1, c: 0.25 }, estimatedTime: 30 }),
  mk({ id: 'g1-add-02', knowledgePoints: ['g1-addition-within-20'], type: 'fill', difficulty: 1,
    stem: '8 + 6 = ___', answer: '14',
    solution: [{ description: '8+2=10，10+4=14' }], hints: ['8 找 2 凑十', '6 拆成 2+4'],
    commonMistakes: [{ mistake: '13', reason: '算错', correction: '8+6=14', errorLayer: 'L2' }],
    irtParams: { a: 1, b: -1, c: 0.2 }, estimatedTime: 30 }),
  mk({ id: 'g1-add-03', knowledgePoints: ['g1-addition-within-20'], type: 'fill', difficulty: 2,
    stem: '15 - 7 = ___', answer: '8',
    solution: [{ description: '15-5=10，10-2=8（破十法）' }], hints: ['先减 5 得 10', '再减 2 得 8'],
    commonMistakes: [{ mistake: '7', reason: '退位错误', correction: '15-7=8', errorLayer: 'L2' }],
    irtParams: { a: 1.2, b: 0, c: 0.2 }, estimatedTime: 40 }),

  // ============= g1-word-problem-1st =============
  mk({ id: 'g1-wp-01', knowledgePoints: ['g1-word-problem-1st'], type: 'choice', difficulty: 2,
    stem: '小明有 8 颗糖，妈妈又给了他 5 颗。他现在有多少颗糖？', options: ['11','12','13','14'], answer: '2',
    solution: [{ description: '8+5=13' }], hints: ['"又给了"=加法'],
    commonMistakes: [{ mistake: '用了减法', reason: '关键词看错', correction: '加法：8+5=13', errorLayer: 'L1' }],
    irtParams: { a: 1, b: 0, c: 0.25 }, estimatedTime: 60 }),
  mk({ id: 'g1-wp-02', knowledgePoints: ['g1-word-problem-1st'], type: 'fill', difficulty: 2,
    stem: '书架上有 15 本书，借走了 7 本。还剩多少本？', answer: '8',
    solution: [{ description: '15-7=8' }], hints: ['"借走"=减法', '15-7=8'],
    commonMistakes: [{ mistake: '15+7=22', reason: '运算方向错', correction: '15-7=8', errorLayer: 'L1' }],
    irtParams: { a: 1.2, b: 0.3, c: 0.2 }, estimatedTime: 60 }),

  // ============= g1-counting-game =============
  mk({ id: 'g1-cg-01', knowledgePoints: ['g1-counting-game'], type: 'choice', difficulty: 1,
    stem: '1, 3, 5, 7, 9, ?  下一个数是？', options: ['10','11','12','13'], answer: '1',
    solution: [{ description: '每次 +2，9+2=11' }], hints: ['这是奇数序列', '相邻两数差 2'],
    commonMistakes: [{ mistake: '选 10', reason: '数错规律', correction: '差为 2，下一个是 11', errorLayer: 'L2' }],
    irtParams: { a: 1, b: -1, c: 0.25 }, estimatedTime: 30 }),
  mk({ id: 'g1-cg-02', knowledgePoints: ['g1-counting-game'], type: 'fill', difficulty: 2,
    stem: '2, 4, 6, 8, 10, ___', answer: '12',
    solution: [{ description: '每次 +2，10+2=12' }], hints: ['这是偶数序列'],
    commonMistakes: [{ mistake: '11', reason: '奇偶判断错', correction: '10+2=12', errorLayer: 'L2' }],
    irtParams: { a: 1.2, b: 0, c: 0.2 }, estimatedTime: 30 }),

  // ============= g2-multiplication-table =============
  mk({ id: 'g2-mul-01', knowledgePoints: ['g2-multiplication-table'], type: 'choice', difficulty: 1,
    stem: '7 × 8 = ?', options: ['54','56','58','64'], answer: '1',
    solution: [{ description: '七八五十六' }], hints: ['乘法口诀'],
    commonMistakes: [{ mistake: '54', reason: '口诀记错', correction: '7×8=56', errorLayer: 'L2' }],
    irtParams: { a: 1, b: -1, c: 0.25 }, estimatedTime: 30 }),
  mk({ id: 'g2-mul-02', knowledgePoints: ['g2-multiplication-table'], type: 'fill', difficulty: 2,
    stem: '9 × 9 = ___', answer: '81',
    solution: [{ description: '九九八十一' }], hints: ['最大的乘法口诀'],
    commonMistakes: [{ mistake: '72', reason: '和 9×8 混淆', correction: '9×9=81', errorLayer: 'L2' }],
    irtParams: { a: 1.2, b: 0, c: 0.2 }, estimatedTime: 30 }),
  mk({ id: 'g2-mul-03', knowledgePoints: ['g2-multiplication-table'], type: 'fill', difficulty: 2,
    stem: '6 × 7 = ___', answer: '42',
    solution: [{ description: '六七四十二' }], hints: ['六七？'],
    commonMistakes: [{ mistake: '48', reason: '和 6×8 混淆', correction: '6×7=42', errorLayer: 'L2' }],
    irtParams: { a: 1.2, b: 0.2, c: 0.2 }, estimatedTime: 30 }),

  // ============= g3-sum-multiple =============
  mk({ id: 'sum-m-01', knowledgePoints: ['g3-sum-multiple'], type: 'choice', difficulty: 2,
    stem: '两数之和为 36，大数是小数的 3 倍。小数是？', options: ['6','9','12','27'], answer: '1',
    solution: [{ description: '小数=36÷(3+1)=9' }], hints: ['总段数=1+3=4', '小数=和÷(倍数+1)'],
    commonMistakes: [{ mistake: '36÷3=12', reason: '忘记 +1', correction: '36÷4=9', errorLayer: 'L2' }],
    irtParams: { a: 1, b: -1, c: 0.25 }, estimatedTime: 60 }),
  mk({ id: 'sum-m-02', knowledgePoints: ['g3-sum-multiple'], type: 'fill', difficulty: 3,
    stem: '苹果和梨共 80 个，苹果是梨的 4 倍。梨___个。', answer: '16',
    solution: [{ description: '梨=80÷5=16，苹果=64' }], hints: ['总段数=5'],
    commonMistakes: [{ mistake: '80÷4=20', reason: '忘记+1', correction: '80÷5=16', errorLayer: 'L2' }],
    irtParams: { a: 1.2, b: 0, c: 0.2 }, estimatedTime: 90 }),
  mk({ id: 'sum-m-03', knowledgePoints: ['g3-sum-multiple'], type: 'fill', difficulty: 3,
    stem: '甲是乙的 2 倍，丙是甲的 3 倍，三数之和为 99。乙=___。', answer: '11',
    solution: [{ description: '乙 1 段、甲 2 段、丙 6 段，乙=99÷9=11' }], hints: ['设乙为 1 段', '共 1+2+6=9 段'],
    commonMistakes: [{ mistake: '16.5', reason: '倍数理解错', correction: '99÷9=11', errorLayer: 'L3' }],
    irtParams: { a: 1.4, b: 1, c: 0.2 }, estimatedTime: 120 }),

  // ============= g3-diff-multiple =============
  mk({ id: 'diff-m-01', knowledgePoints: ['g3-diff-multiple'], type: 'choice', difficulty: 2,
    stem: '两数之差为 24，大数是小数的 4 倍。小数是？', options: ['6','8','12','32'], answer: '1',
    solution: [{ description: '小数=24÷(4-1)=8' }], hints: ['差对应 4-1=3 段'],
    commonMistakes: [{ mistake: '24÷4=6', reason: '未用倍数-1', correction: '24÷3=8', errorLayer: 'L2' }],
    irtParams: { a: 1, b: -0.5, c: 0.25 }, estimatedTime: 60 }),
  mk({ id: 'diff-m-02', knowledgePoints: ['g3-diff-multiple'], type: 'fill', difficulty: 3,
    stem: '书架上层是下层的 5 倍，上层拿 60 本到下层则两层相等。原下层___本。', answer: '30',
    solution: [{ description: '上层比下层多 60×2=120 本，下=120÷4=30' }], hints: ['"移多少" 对应差的 2 倍'],
    commonMistakes: [{ mistake: '60÷4=15', reason: '忽略移后差为 2 倍', correction: '120÷4=30', errorLayer: 'L3' }],
    irtParams: { a: 1.3, b: 0.8, c: 0.2 }, estimatedTime: 120 }),

  // ============= g3-sum-diff =============
  mk({ id: 'sum-d-01', knowledgePoints: ['g3-sum-diff'], type: 'choice', difficulty: 2,
    stem: '两数之和为 30，两数之差为 10。较大数是？', options: ['10','15','20','25'], answer: '2',
    solution: [{ description: '大数=(30+10)÷2=20' }], hints: ['大数=(和+差)÷2'],
    commonMistakes: [{ mistake: '30÷2=15', reason: '未利用差', correction: '(30+10)÷2=20', errorLayer: 'L2' }],
    irtParams: { a: 1, b: -0.3, c: 0.25 }, estimatedTime: 60 }),
  mk({ id: 'sum-d-02', knowledgePoints: ['g3-sum-diff'], type: 'fill', difficulty: 3,
    stem: '语文和数学平均 90 分，数学比语文多 8 分。数学=___分。', answer: '94',
    solution: [{ description: '总分=180，数学=(180+8)÷2=94' }], hints: ['总分=平均×2'],
    commonMistakes: [{ mistake: '90+8=98', reason: '把平均当总分', correction: '180+8 后÷2', errorLayer: 'L3' }],
    irtParams: { a: 1.3, b: 0.6, c: 0.2 }, estimatedTime: 90 }),

  // ============= g3-planting-trees =============
  mk({ id: 'plant-01', knowledgePoints: ['g3-planting-trees'], type: 'choice', difficulty: 2,
    stem: '小路长 30 米，每 5 米种 1 棵，两端都种。共多少棵？', options: ['5','6','7','8'], answer: '2',
    solution: [{ description: '间隔=30÷5=6，棵数=6+1=7' }], hints: ['两端都种→棵数=间隔+1'],
    commonMistakes: [{ mistake: '30÷5=6', reason: '未+1', correction: '6+1=7', errorLayer: 'L1' }],
    irtParams: { a: 1, b: -0.5, c: 0.25 }, estimatedTime: 60 }),
  mk({ id: 'plant-02', knowledgePoints: ['g3-planting-trees'], type: 'fill', difficulty: 2,
    stem: '圆形花园周长 48 米，每 4 米种 1 株花。共___株。', answer: '12',
    solution: [{ description: '封闭图形：棵数=间隔=48÷4=12' }], hints: ['封闭：棵数=间隔'],
    commonMistakes: [{ mistake: '13', reason: '混淆直线与环形', correction: '48÷4=12', errorLayer: 'L2' }],
    irtParams: { a: 1.2, b: 0.3, c: 0.2 }, estimatedTime: 60 }),
  mk({ id: 'plant-03', knowledgePoints: ['g3-planting-trees'], type: 'fill', difficulty: 3,
    stem: '一座桥长 200 米，两侧栏杆每 2 米插 1 面旗，两端都插。共___面旗。', answer: '202',
    solution: [{ description: '一侧=200÷2+1=101，两侧=202' }], hints: ['两侧要×2'],
    commonMistakes: [{ mistake: '101', reason: '忘×2', correction: '101×2=202', errorLayer: 'L2' }],
    irtParams: { a: 1.3, b: 0.6, c: 0.2 }, estimatedTime: 90 }),

  // ============= g3-chicken-rabbit =============
  mk({ id: 'cr-01', knowledgePoints: ['g3-chicken-rabbit'], type: 'choice', difficulty: 3,
    stem: '鸡和兔共有 8 只，共有 22 条腿。兔有多少只？', options: ['2','3','4','5'], answer: '1',
    solution: [{ description: '假设全是鸡：8×2=16；差=22-16=6；兔=6÷2=3' }], hints: ['假设法', '每把一只鸡换成兔增加 2 条腿'],
    commonMistakes: [{ mistake: '4', reason: '差÷4 而非 ÷2', correction: '(22-16)÷2=3', errorLayer: 'L3' }],
    irtParams: { a: 1.2, b: 0.5, c: 0.25 }, estimatedTime: 90 }),
  mk({ id: 'cr-02', knowledgePoints: ['g3-chicken-rabbit'], type: 'fill', difficulty: 4,
    stem: '停车场有自行车和三轮车共 15 辆，共 38 个轮子。自行车___辆。', answer: '7',
    solution: [{ description: '假设全是自行车：30；差=8；三轮车=8，自行车=7' }], hints: ['每换一辆增加 1 个轮子'],
    commonMistakes: [{ mistake: '8', reason: '答案混淆', correction: '三轮车 8 辆，自行车 7 辆', errorLayer: 'L3' }],
    irtParams: { a: 1.4, b: 1.2, c: 0.2 }, estimatedTime: 120 }),

  // ============= g4-age-problem =============
  mk({ id: 'age-01', knowledgePoints: ['g4-age-problem'], type: 'choice', difficulty: 3,
    stem: '爸爸今年 36 岁，儿子 12 岁。几年前爸爸是儿子的 5 倍？', options: ['3','6','9','12'], answer: '1',
    solution: [{ description: '差=24，24÷(5-1)=6，12-6=6 年前' }], hints: ['年龄差不变'],
    commonMistakes: [{ mistake: '36÷5=7.2', reason: '不会用差倍', correction: '用差=24 求解', errorLayer: 'L3' }],
    irtParams: { a: 1.1, b: 0.3, c: 0.25 }, estimatedTime: 90 }),
  mk({ id: 'age-02', knowledgePoints: ['g4-age-problem'], type: 'fill', difficulty: 3,
    stem: '妈妈比小明大 28 岁，3 年后妈妈是小明的 5 倍。小明今年___岁。', answer: '4',
    solution: [{ description: '3 年后：28÷4=7，今年=7-3=4' }], hints: ['3 年后差仍为 28'],
    commonMistakes: [{ mistake: '7', reason: '忘记减 3 年', correction: '7-3=4', errorLayer: 'L2' }],
    irtParams: { a: 1.3, b: 0.7, c: 0.2 }, estimatedTime: 120 }),

  // ============= g4-area-perimeter =============
  mk({ id: 'ap-01', knowledgePoints: ['g4-area-perimeter'], type: 'choice', difficulty: 2,
    stem: '长方形长 8cm，宽 5cm。它的面积是多少？', options: ['13','26','40','80'], answer: '2',
    solution: [{ description: '面积=8×5=40 cm²' }], hints: ['面积=长×宽'],
    commonMistakes: [{ mistake: '26', reason: '与周长混淆', correction: '周长=26，面积=40', errorLayer: 'L1' }],
    irtParams: { a: 1, b: -0.3, c: 0.25 }, estimatedTime: 60 }),
  mk({ id: 'ap-02', knowledgePoints: ['g4-area-perimeter'], type: 'fill', difficulty: 2,
    stem: '正方形边长 6cm，周长=___cm，面积=___cm²。', answer: '24',
    solution: [{ description: '周长=4×6=24，面积=6×6=36' }], hints: ['正方形四边相等'],
    commonMistakes: [{ mistake: '36', reason: '周长填成面积', correction: '24 和 36', errorLayer: 'L1' }],
    irtParams: { a: 1.2, b: 0.2, c: 0.2 }, estimatedTime: 60 }),

  // ============= g5-profit-loss =============
  mk({ id: 'pl-01', knowledgePoints: ['g5-profit-loss'], type: 'choice', difficulty: 3,
    stem: '一件商品成本 80 元，以 100 元卖出。利润率是多少？', options: ['20%','25%','30%','80%'], answer: '1',
    solution: [{ description: '利润=100-80=20，利润率=20÷80=25%' }], hints: ['利润率=利润÷成本'],
    commonMistakes: [{ mistake: '20÷100=20%', reason: '除以售价而非成本', correction: '20÷80=25%', errorLayer: 'L2' }],
    irtParams: { a: 1.2, b: 0.5, c: 0.25 }, estimatedTime: 90 }),
  mk({ id: 'pl-02', knowledgePoints: ['g5-profit-loss'], type: 'fill', difficulty: 4,
    stem: '一件商品原价 200 元，打八折后便宜了___元。', answer: '40',
    solution: [{ description: '便宜=200×(1-0.8)=40' }], hints: ['八折=80%', '便宜=原价-售价'],
    commonMistakes: [{ mistake: '160', reason: '算成了现价', correction: '问"便宜多少"=200-160=40', errorLayer: 'L1' }],
    irtParams: { a: 1.3, b: 0.8, c: 0.2 }, estimatedTime: 90 }),

  // ============= g5-simple-equation =============
  mk({ id: 'eq-01', knowledgePoints: ['g5-simple-equation'], type: 'choice', difficulty: 2,
    stem: '解方程：3x + 5 = 20，x = ?', options: ['3','4','5','6'], answer: '2',
    solution: [{ description: '3x=15，x=5' }], hints: ['先移项', '两边同除以 3'],
    commonMistakes: [{ mistake: '3x=25', reason: '移项符号错', correction: '3x=20-5=15', errorLayer: 'L2' }],
    irtParams: { a: 1, b: -0.2, c: 0.25 }, estimatedTime: 60 }),
  mk({ id: 'eq-02', knowledgePoints: ['g5-simple-equation'], type: 'fill', difficulty: 3,
    stem: '一个数的 4 倍减去 10 等于 30，这个数是___。', answer: '10',
    solution: [{ description: '4x-10=30，4x=40，x=10' }], hints: ['设这个数为 x'],
    commonMistakes: [{ mistake: '8', reason: '4x=30+10 算错', correction: '40÷4=10', errorLayer: 'L2' }],
    irtParams: { a: 1.2, b: 0.4, c: 0.2 }, estimatedTime: 90 }),

  // ============= g5-fraction-split =============
  mk({ id: 'fs-01', knowledgePoints: ['g5-fraction-split'], type: 'fill', difficulty: 4,
    stem: '1/6 = 1/? + 1/?，较大的分母是___。', answer: '42',
    solution: [{ description: '1/6 = 1/7 + 1/42（公式：1/n = 1/(n+1) + 1/(n(n+1))）' }], hints: ['公式：1/n = 1/(n+1) + 1/(n(n+1))'],
    commonMistakes: [{ mistake: '12', reason: '猜测错误', correction: '1/7+1/42=1/6', errorLayer: 'L3' }],
    irtParams: { a: 1.4, b: 1.1, c: 0.2 }, estimatedTime: 150 }),

  // ============= g5-fraction-add-sub =============
  mk({ id: 'fas-01', knowledgePoints: ['g5-fraction-add-sub'], type: 'choice', difficulty: 2,
    stem: '1/2 + 1/3 = ?', options: ['2/5','1/5','5/6','2/6'], answer: '2',
    solution: [{ description: '1/2+1/3=3/6+2/6=5/6' }], hints: ['先通分', '分母 6'],
    commonMistakes: [{ mistake: '2/5', reason: '分子分母直接相加', correction: '先通分再相加', errorLayer: 'L2' }],
    irtParams: { a: 1, b: -0.3, c: 0.25 }, estimatedTime: 60 }),
  mk({ id: 'fas-02', knowledgePoints: ['g5-fraction-add-sub'], type: 'fill', difficulty: 3,
    stem: '3/4 - 1/6 = ___', answer: '7/12',
    solution: [{ description: '=9/12-2/12=7/12' }], hints: ['最小公分母 12'],
    commonMistakes: [{ mistake: '2/12', reason: '通分计算错', correction: '9/12-2/12=7/12', errorLayer: 'L2' }],
    irtParams: { a: 1.2, b: 0.4, c: 0.2 }, estimatedTime: 90 }),

  // ============= g5-number-theory =============
  mk({ id: 'nt-01', knowledgePoints: ['g5-number-theory'], type: 'choice', difficulty: 4,
    stem: '下列哪个是质数？', options: ['49','51','53','57'], answer: '2',
    solution: [{ description: '53 只能被 1 和自己整除' }], hints: ['质数只有 1 和自己两个因数', '49=7×7，51=3×17，57=3×19'],
    commonMistakes: [{ mistake: '51', reason: '51=3×17 容易忽略', correction: '53 是质数', errorLayer: 'L3' }],
    irtParams: { a: 1.3, b: 0.8, c: 0.25 }, estimatedTime: 90 }),
  mk({ id: 'nt-02', knowledgePoints: ['g5-number-theory'], type: 'fill', difficulty: 4,
    stem: '能被 2、3、5 同时整除的最小三位数是___。', answer: '120',
    solution: [{ description: '末位=0，数字和能被 3 整除，最小=120' }], hints: ['能被 2、5 整除→末位为 0', '能被 3 整除→各位数字和是 3 的倍数'],
    commonMistakes: [{ mistake: '100', reason: '100 不能被 3 整除', correction: '120', errorLayer: 'L2' }],
    irtParams: { a: 1.3, b: 0.9, c: 0.2 }, estimatedTime: 120 }),

  // ============= g5-geometry-model =============
  mk({ id: 'gm-01', knowledgePoints: ['g5-geometry-model'], type: 'choice', difficulty: 4,
    stem: '一个长方形长 10cm，宽 6cm。把它分成一个最大的正方形和一个小长方形。小长方形的面积是多少？',
    options: ['16','20','24','36'], answer: '2',
    solution: [{ description: '最大正方形边长=6，小长方形=10-6=4，面积=4×6=24' }], hints: ['最大正方形边长=宽'],
    commonMistakes: [{ mistake: '16', reason: '(10-6)² 算正方形', correction: '4×6=24', errorLayer: 'L2' }],
    irtParams: { a: 1.3, b: 0.7, c: 0.25 }, estimatedTime: 90 }),
  mk({ id: 'gm-02', knowledgePoints: ['g5-geometry-model'], type: 'fill', difficulty: 4,
    stem: '一个梯形上底 4cm，下底 8cm，高 5cm。面积=___cm²。', answer: '30',
    solution: [{ description: '(4+8)×5÷2=30' }], hints: ['梯形面积=(上底+下底)×高÷2'],
    commonMistakes: [{ mistake: '60', reason: '忘÷2', correction: '(4+8)×5÷2=30', errorLayer: 'L2' }],
    irtParams: { a: 1.3, b: 0.8, c: 0.2 }, estimatedTime: 90 }),

  // ============= g6-travel-problem =============
  mk({ id: 'tp-01', knowledgePoints: ['g6-travel-problem'], type: 'choice', difficulty: 4,
    stem: '甲乙两地相距 360 千米，一辆车从甲地以 60km/h 出发，另一辆从乙地以 40km/h 出发，相向而行。几小时后相遇？',
    options: ['3','3.6','4','6'], answer: '2',
    solution: [{ description: '相遇时间=360÷(60+40)=3.6 小时' }], hints: ['相遇：路程÷速度和'],
    commonMistakes: [{ mistake: '6', reason: '只算一辆车', correction: '要用速度和', errorLayer: 'L2' }],
    irtParams: { a: 1.3, b: 0.8, c: 0.25 }, estimatedTime: 120 }),
  mk({ id: 'tp-02', knowledgePoints: ['g6-travel-problem'], type: 'fill', difficulty: 5,
    stem: '甲每小时走 5 千米，乙每小时走 4 千米。乙先走 2 小时后甲再追，甲___小时追上乙。', answer: '8',
    solution: [{ description: '乙先走=8 千米，追及速度差=1km/h，8÷1=8' }], hints: ['追及时间=距离差÷速度差'],
    commonMistakes: [{ mistake: '10', reason: '用 5+4', correction: '速度差=1', errorLayer: 'L2' }],
    irtParams: { a: 1.4, b: 1.2, c: 0.2 }, estimatedTime: 150 }),

  // ============= g6-circle-area =============
  mk({ id: 'ci-01', knowledgePoints: ['g6-circle-area'], type: 'choice', difficulty: 3,
    stem: '圆半径 7cm，周长约多少？(π 取 3.14)', options: ['22','43.96','154','44'], answer: '1',
    solution: [{ description: 'C=2×3.14×7=43.96' }], hints: ['C=2πr'],
    commonMistakes: [{ mistake: '154', reason: '混淆周长和面积', correction: '43.96 cm', errorLayer: 'L1' }],
    irtParams: { a: 1, b: -0.3, c: 0.25 }, estimatedTime: 60 }),
  mk({ id: 'ci-02', knowledgePoints: ['g6-circle-area'], type: 'fill', difficulty: 3,
    stem: '圆直径 20cm，面积=___cm²。(π 取 3.14)', answer: '314',
    solution: [{ description: 'r=10，S=3.14×10²=314' }], hints: ['r=d÷2'],
    commonMistakes: [{ mistake: '1256', reason: '用 d 当 r', correction: 'r=10，3.14×100=314', errorLayer: 'L2' }],
    irtParams: { a: 1.2, b: 0.4, c: 0.2 }, estimatedTime: 90 }),
  mk({ id: 'ci-03', knowledgePoints: ['g6-circle-area'], type: 'fill', difficulty: 4,
    stem: '大圆 R=7cm，小圆 r=5cm。环形面积=___cm²。(π 取 3.14)', answer: '75.36',
    solution: [{ description: '3.14×(49-25)=3.14×24=75.36' }], hints: ['S环=π(R²-r²)'],
    commonMistakes: [{ mistake: '12.56', reason: '先算 R-r 再平方', correction: '先平方再差', errorLayer: 'L3' }],
    irtParams: { a: 1.4, b: 1, c: 0.2 }, estimatedTime: 120 })
]

/**
 * 根据知识点查找题目
 */
export function findByKnowledge(kp: string): Exercise[] {
  return EXERCISE_POOL.filter(e => e.knowledgePoints.includes(kp))
}

/**
 * 从池中随机抽取 count 道题
 */
export function randomPick(pool: Exercise[], count: number): Exercise[] {
  const copy = pool.slice()
  const out: Exercise[] = []
  for (let i = 0; i < count && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length)
    out.push(copy.splice(idx, 1)[0])
  }
  return out
}
