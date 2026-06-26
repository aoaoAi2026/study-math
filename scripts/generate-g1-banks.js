const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'public', 'content', 'question-bank', 'g1');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// 辅助：构造单个题目
function Q(base) {
  return Object.assign({
    image: '',
    options: [],
    acceptableAnswers: [],
    solution: [],
    hints: [],
    commonMistakes: [],
    source: { type: '原创', name: '内部题库', year: 2026 },
    knowledgePoints: [],
    estimatedTime: 90,
    irtParams: { a: 1.0, b: 0.0, c: 0.25 },
    tags: []
  }, base);
}

// 通用提示/易错模板生成器
function mkCommon(op, correct, wrong, reason, correction, layer = 'L2') {
  return [{ mistake: wrong, reason, correction, errorLayer: layer }];
}

// 为每题生成IRT参数
function irt(diff) {
  const bMap = { 1: -1.2, 2: -0.5, 3: 0.3, 4: 1.2, 5: 1.8 };
  return { a: 0.9 + (diff - 1) * 0.05, b: bMap[diff] || 0, c: 0.25 };
}
function diffLabel(diff) {
  return ['入门', '基础', '进阶', '拔高', '竞赛'][diff - 1];
}

// ===================== 题库1: g1-number-recognition 数的认识 =====================
function bankNumberRecognition() {
  const qs = [];
  let idx = 1;
  const push = (q) => { q.id = `g1-nr-${String(idx).padStart(2, '0')}`; idx++; qs.push(Q(q)); };

  // 难度1 4题
  push({ type: 'choice', difficulty: 1, difficultyLabel: '入门', stem: '数一数，下面一共有多少个苹果？\n🍎 🍎 🍎 🍎 🍎', options: ['3 个', '4 个', '5 个', '6 个'], answer: '2', acceptableAnswers: ['2', '5', '5个', '五个'], solution: ['小朋友，我们一个一个地数：1、2、3、4、5。', '数到最后一共是 5 个苹果。', '所以答案选 5 个。'], hints: ['用手指一个一个地点', '数完一个就数下一个', '别忘了数到最后一个哦'], commonMistakes: [{ mistake: '选了 4 个', reason: '数的时候漏了一个', correction: '一定要一个一个慢慢数', errorLayer: 'L1' }], knowledgePoints: ['数数', '10以内数的认识'], estimatedTime: 60, irtParams: irt(1), tags: ['数数', '入门'] });

  push({ type: 'fill', difficulty: 1, difficultyLabel: '入门', stem: '看图写数：\n🐰 🐰 🐰 🐰 🐰 🐰 🐰\n一共 ____ 只小兔。', options: [], answer: '7', acceptableAnswers: ['7', '七', '7只', '七只'], solution: ['我们来数小兔子：1、2、3、4、5、6、7。', '一共数到 7，所以填 7。'], hints: ['数一只就记一个数', '数完检查一遍', '不要多数也不要少数'], commonMistakes: [{ mistake: '写成 6 或 8', reason: '数的时候快了一点', correction: '慢慢数，数完再数一遍', errorLayer: 'L1' }], knowledgePoints: ['数数', '10以内数的认识'], estimatedTime: 60, irtParams: irt(1), tags: ['数数', '入门'] });

  push({ type: 'choice', difficulty: 1, difficultyLabel: '入门', stem: '数字 8 读作什么？', options: ['八', '九', '六', '十'], answer: '0', acceptableAnswers: ['0', '八'], solution: ['8 读作"八"。', '9 读作"九"，6 读作"六"，10 读作"十"。', '所以正确答案是"八"。'], hints: ['读一读数字 8', '想想 8 怎么念', '不要和 9 或 6 搞混'], commonMistakes: [{ mistake: '选了"九"', reason: '8 和 9 长得有点像', correction: '8 是两个圆，9 是上面一个圆下面一个尾巴', errorLayer: 'L2' }], knowledgePoints: ['数字读法', '10以内数的认识'], estimatedTime: 60, irtParams: irt(1), tags: ['读数', '入门'] });

  push({ type: 'fill', difficulty: 1, difficultyLabel: '入门', stem: '在□里填上合适的数：\n3、4、5、□、7', options: [], answer: '6', acceptableAnswers: ['6', '六'], solution: ['我们观察：3、4、5 后面是几呢？', '3 后面是 4，4 后面是 5，5 后面就是 6，6 后面是 7。', '所以应该填 6。'], hints: ['一个一个从小到大排', '5 后面是谁？', '数数看：3、4、5、？、7'], commonMistakes: [{ mistake: '填 7', reason: '把 7 前面的数搞混了', correction: '5 后面是 6，6 后面才是 7', errorLayer: 'L1' }], knowledgePoints: ['数的顺序', '10以内数的认识'], estimatedTime: 60, irtParams: irt(1), tags: ['数的顺序', '入门'] });

  // 难度2 6题
  push({ type: 'choice', difficulty: 2, difficultyLabel: '基础', stem: '10 前面的一个数是？', options: ['8', '9', '11', '12'], answer: '1', acceptableAnswers: ['1', '9', '九'], solution: ['从 1 数到 10：1、2、3、4、5、6、7、8、9、10。', '10 前面的一个数就是 9。', '11 和 12 是 10 后面的数。'], hints: ['想想 10 前面是什么？', '数到 10 前一个数就停', '9 后面才是 10'], commonMistakes: [{ mistake: '选 8', reason: '把"前一个"理解成"前两个"', correction: '前一个就是往前数一下', errorLayer: 'L2' }], knowledgePoints: ['数的顺序', '10以内数的认识'], estimatedTime: 80, irtParams: irt(2), tags: ['数的顺序', '基础'] });

  push({ type: 'fill', difficulty: 2, difficultyLabel: '基础', stem: '比 9 多 1 的数是 ____。', options: [], answer: '10', acceptableAnswers: ['10', '十'], solution: ['"比 9 多 1"就是 9 再加 1。', '9 + 1 = 10。', '所以答案是 10。'], hints: ['多 1 就是加 1', '数一下：9 后面是谁？', '9、10'], commonMistakes: [{ mistake: '写成 8', reason: '把"多"看成"少"', correction: '多就是加，少才是减', errorLayer: 'L2' }], knowledgePoints: ['数的大小', '10以内数的认识'], estimatedTime: 80, irtParams: irt(2), tags: ['数的大小', '基础'] });

  push({ type: 'choice', difficulty: 2, difficultyLabel: '基础', stem: '下面哪个数最大？', options: ['7', '9', '8', '6'], answer: '1', acceptableAnswers: ['1', '9', '九'], solution: ['我们把这些数排一排：6、7、8、9。', '排在最后的就是最大的。', '所以 9 是最大的。'], hints: ['把数从小学到大排', '越大的数越靠后', '9 比 8 大吗？对！'], commonMistakes: [{ mistake: '选 8', reason: '没认真看完所有选项', correction: '把 4 个数都比一比', errorLayer: 'L2' }], knowledgePoints: ['数的大小比较', '10以内数的认识'], estimatedTime: 80, irtParams: irt(2), tags: ['比较大小', '基础'] });

  push({ type: 'fill', difficulty: 2, difficultyLabel: '基础', stem: '数一数：\n★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★\n一共 ____ 颗星。', options: [], answer: '12', acceptableAnswers: ['12', '十二', '12颗'], solution: ['我们一个一个数：1、2、3、4、5、6、7、8、9、10、11、12。', '数到 12，就是 12 颗星。', '或者两个两个地数：2、4、6、8、10、12，也能得到 12。'], hints: ['慢慢数', '可以两个两个地数', '数完再数一遍'], commonMistakes: [{ mistake: '写成 11 或 13', reason: '数快了一点', correction: '仔细数，数完再检查', errorLayer: 'L1' }], knowledgePoints: ['数数', '20以内数的认识'], estimatedTime: 80, irtParams: irt(2), tags: ['数数', '基础'] });

  push({ type: 'choice', difficulty: 2, difficultyLabel: '基础', stem: '15 是由几个十和几个一组成的？', options: ['1 个十和 5 个一', '5 个十和 1 个一', '1 个十和 1 个一', '5 个十和 5 个一'], answer: '0', acceptableAnswers: ['0', '1个十和5个一'], solution: ['15 这个数，左边的 1 在十位，代表 1 个十。', '右边的 5 在个位，代表 5 个一。', '所以 15 = 1 个十 + 5 个一。'], hints: ['看看 15 的左边一位是什么？', '右边一位是什么？', '左边是十位，右边是个位'], commonMistakes: [{ mistake: '选 5 个十和 1 个一', reason: '把左右搞反了', correction: '十在左边，个在右边', errorLayer: 'L2' }], knowledgePoints: ['数的组成', '20以内数的认识'], estimatedTime: 90, irtParams: irt(2), tags: ['数的组成', '基础'] });

  push({ type: 'fill', difficulty: 2, difficultyLabel: '基础', stem: '按顺序填数：\n12、13、14、____、16', options: [], answer: '15', acceptableAnswers: ['15', '十五'], solution: ['这组数一个比一个多 1。', '12、13、14 后面是 15，15 后面是 16。', '所以填 15。'], hints: ['看看这些数变大还是变小？', '每次多 1', '14 后面是谁？'], commonMistakes: [{ mistake: '填 16', reason: '跳过一个', correction: '14 后面就是 15', errorLayer: 'L1' }], knowledgePoints: ['数的顺序', '20以内数的认识'], estimatedTime: 80, irtParams: irt(2), tags: ['数的顺序', '基础'] });

  // 难度3 4题
  push({ type: 'choice', difficulty: 3, difficultyLabel: '进阶', stem: '下面算式中，得数比 15 小的是？', options: ['10 + 8', '9 + 9', '7 + 7', '15 + 2'], answer: '2', acceptableAnswers: ['2', '7+7', '14'], solution: ['我们分别算一算：', '10+8=18，比 15 大。', '9+9=18，比 15 大。', '7+7=14，14 比 15 小，是答案。', '15+2=17，比 15 大。'], hints: ['先把每个算出来', '再和 15 比一比', '谁小就是谁'], commonMistakes: [{ mistake: '选 10+8', reason: '计算 10+8 算错了', correction: '10+8=18，比 15 大', errorLayer: 'L2' }], knowledgePoints: ['加法', '比较大小'], estimatedTime: 100, irtParams: irt(3), tags: ['计算', '比较', '进阶'] });

  push({ type: 'fill', difficulty: 3, difficultyLabel: '进阶', stem: '比 20 少 3 的数是 ____。', options: [], answer: '17', acceptableAnswers: ['17', '十七'], solution: ['"比 20 少 3"就是 20 减去 3。', '20 - 3 = 17。', '所以答案是 17。'], hints: ['少几就是减几', '20 减去 3', '可以用 20 数 3 个数：19、18、17'], commonMistakes: [{ mistake: '写成 13 或 23', reason: '把"少"理解成"多"，或把计算搞错', correction: '少是减，20-3=17', errorLayer: 'L2' }], knowledgePoints: ['减法', '数的大小'], estimatedTime: 100, irtParams: irt(3), tags: ['减法', '进阶'] });

  push({ type: 'choice', difficulty: 3, difficultyLabel: '进阶', stem: '把 8、20、15、9 从大到小排列，排在第三个的是？', options: ['8', '20', '15', '9'], answer: '3', acceptableAnswers: ['3', '9'], solution: ['先把 4 个数从大到小排：20、15、9、8。', '第一个是 20，第二个是 15，第三个是 9，第四个是 8。', '所以第三个是 9。'], hints: ['先排好顺序', '从大的开始', '第三个就找到了'], commonMistakes: [{ mistake: '选 8', reason: '把顺序排反了', correction: '从大到小是 20、15、9、8', errorLayer: 'L3' }], knowledgePoints: ['比较大小', '数的顺序'], estimatedTime: 110, irtParams: irt(3), tags: ['排序', '进阶'] });

  push({ type: 'fill', difficulty: 3, difficultyLabel: '进阶', stem: '一个数比 10 大，比 15 小，而且是双数，这个数是 ____。（写出一个就可以）', options: [], answer: '12', acceptableAnswers: ['12', '14', '十二', '十四'], solution: ['比 10 大，比 15 小的数有：11、12、13、14。', '其中双数是：12、14。', '所以可以填 12 或 14。'], hints: ['先列出 10 到 15 之间的数', '再挑双数（2、4、6、8、10...这样的）', '11 是单数，12 是双数'], commonMistakes: [{ mistake: '写成 11', reason: '忘了双数的意思', correction: '双数是能两个两个数完的数：2、4、6、8、10、12、14...', errorLayer: 'L3' }], knowledgePoints: ['单数双数', '比较大小'], estimatedTime: 120, irtParams: irt(3), tags: ['单双数', '进阶'] });

  // 难度4 1题
  push({ type: 'choice', difficulty: 4, difficultyLabel: '拔高', stem: '下面算式中，a 和 b 都是大于 0 的数。哪个是正确的？', options: ['如果 a + 5 = b + 6，那么 a 比 b 大', '如果 a + 5 = b + 6，那么 a 比 b 小', '如果 a + 5 = b + 6，那么 a = b', '无法判断 a 和 b 的大小'], answer: '0', acceptableAnswers: ['0'], solution: ['我们把算式看成：a + 5 = b + 6。', '两边都去掉 5，变成 a = b + 1。', '说明 a = b + 1，所以 a 比 b 大 1。', '因此 a 比 b 大。'], hints: ['两边都去掉同样多的数', '5 和 5 可以抵消', '剩下的比一比'], commonMistakes: [{ mistake: '选 a 比 b 小', reason: '看到 a 那边加的数小就以为 a 小', correction: '加的数小说明 a 本身要大一点', errorLayer: 'L3' }], knowledgePoints: ['等式', '数的大小'], estimatedTime: 150, irtParams: irt(4), tags: ['等式', '拔高'] });

  return { topicId: 'g1-number-recognition', topicName: '数的认识', grade: 1, category: 'basic', version: '1.0', totalQuestions: qs.length, questions: qs };
}

// ===================== 题库2: g1-addition-within-20 20以内加减法 =====================
function bankAddWithin20() {
  const qs = [];
  let idx = 1;
  const push = (q) => { q.id = `g1-aw20-${String(idx).padStart(2, '0')}`; idx++; qs.push(Q(q)); };

  push({ type: 'fill', difficulty: 1, difficultyLabel: '入门', stem: '3 + 2 = ____', options: [], answer: '5', acceptableAnswers: ['5', '五'], solution: ['3 个加上 2 个，一起数：1、2、3、4、5。', '所以 3 + 2 = 5。'], hints: ['用手指头数一数', '3 后面再数 2 个：4、5', '画图也行'], commonMistakes: [{ mistake: '写成 4', reason: '少数了一个', correction: '3 后面是 4、5，共两个', errorLayer: 'L1' }], knowledgePoints: ['10以内加法'], estimatedTime: 60, irtParams: irt(1), tags: ['加法', '入门'] });

  push({ type: 'fill', difficulty: 1, difficultyLabel: '入门', stem: '7 - 4 = ____', options: [], answer: '3', acceptableAnswers: ['3', '三'], solution: ['7 个去掉 4 个，还剩：7、6、5、4（减 4 次），停在 3。', '所以 7 - 4 = 3。'], hints: ['从 7 往回数 4 个', '也可以想 4 + ? = 7', '4 + 3 = 7'], commonMistakes: [{ mistake: '写成 4', reason: '算成加法了', correction: '题目是减号，要做减法', errorLayer: 'L1' }], knowledgePoints: ['10以内减法'], estimatedTime: 60, irtParams: irt(1), tags: ['减法', '入门'] });

  push({ type: 'choice', difficulty: 1, difficultyLabel: '入门', stem: '4 + 5 = ?', options: ['8', '9', '10', '7'], answer: '1', acceptableAnswers: ['1', '9'], solution: ['4 + 5 = 9。', '可以这样想：4 往后数 5 个：5、6、7、8、9。', '所以答案是 9。'], hints: ['数数看', '4、5、6、7、8、9', '用手指帮助'], commonMistakes: [{ mistake: '选 8', reason: '数错了一个', correction: '认真数 5 下', errorLayer: 'L1' }], knowledgePoints: ['10以内加法'], estimatedTime: 60, irtParams: irt(1), tags: ['加法', '入门'] });

  push({ type: 'choice', difficulty: 1, difficultyLabel: '入门', stem: '10 - 3 = ?', options: ['6', '7', '8', '5'], answer: '1', acceptableAnswers: ['1', '7'], solution: ['10 减 3：从 10 往回数 3 个：9、8、7。', '所以 10 - 3 = 7。'], hints: ['往回数 3', '也可以想 3 + ? = 10', '3 + 7 = 10'], commonMistakes: [{ mistake: '选 6', reason: '多数了一次', correction: '10、9、8、7，数 3 次', errorLayer: 'L1' }], knowledgePoints: ['10以内减法'], estimatedTime: 60, irtParams: irt(1), tags: ['减法', '入门'] });

  push({ type: 'fill', difficulty: 2, difficultyLabel: '基础', stem: '8 + 5 = ____', options: [], answer: '13', acceptableAnswers: ['13', '十三'], solution: ['用凑十法：8 要 2 个变成 10。', '把 5 分成 2 和 3，先算 8 + 2 = 10，再算 10 + 3 = 13。', '所以 8 + 5 = 13。'], hints: ['凑十法：8 找 2', '把 5 分成 2 和 3', '8+2=10，10+3=13'], commonMistakes: [{ mistake: '写成 12', reason: '分解 5 时分错了', correction: '5 = 2 + 3，8 + 2 = 10，10 + 3 = 13', errorLayer: 'L2' }], knowledgePoints: ['20以内进位加法', '凑十法'], estimatedTime: 90, irtParams: irt(2), tags: ['凑十法', '基础'] });

  push({ type: 'fill', difficulty: 2, difficultyLabel: '基础', stem: '15 - 7 = ____', options: [], answer: '8', acceptableAnswers: ['8', '八'], solution: ['15 减 7：可以想 7 + ? = 15。', '7 + 8 = 15，所以 15 - 7 = 8。', '也可以用破十法：10 - 7 = 3，3 + 5 = 8。'], hints: ['想加算减', '7 加几等于 15？', '或用 10 先减 7'], commonMistakes: [{ mistake: '写成 7', reason: '想加算减时算错', correction: '7 + 8 = 15，不是 7 + 7 = 15', errorLayer: 'L2' }], knowledgePoints: ['20以内退位减法'], estimatedTime: 90, irtParams: irt(2), tags: ['退位减', '基础'] });

  push({ type: 'choice', difficulty: 2, difficultyLabel: '基础', stem: '9 + 4 = ?', options: ['12', '13', '14', '11'], answer: '1', acceptableAnswers: ['1', '13'], solution: ['9 + 1 = 10，把 4 分成 1 和 3。', '10 + 3 = 13。', '所以 9 + 4 = 13。'], hints: ['9 找 1 凑十', '4 里拿出 1 给 9', '剩下 3，10+3=13'], commonMistakes: [{ mistake: '选 12', reason: '计算错误', correction: '9+1=10，10+3=13', errorLayer: 'L2' }], knowledgePoints: ['20以内进位加法'], estimatedTime: 90, irtParams: irt(2), tags: ['凑十法', '基础'] });

  push({ type: 'choice', difficulty: 2, difficultyLabel: '基础', stem: '18 - 9 = ?', options: ['8', '9', '10', '7'], answer: '1', acceptableAnswers: ['1', '9'], solution: ['方法一：想 9 + ? = 18，9 + 9 = 18，所以 18 - 9 = 9。', '方法二：10 - 9 = 1，1 + 8 = 9。', '所以答案是 9。'], hints: ['想加算减', '9 + 9 = ?', '或用破十法'], commonMistakes: [{ mistake: '选 8', reason: '没认真计算', correction: '18 - 9 = 9', errorLayer: 'L2' }], knowledgePoints: ['20以内退位减法'], estimatedTime: 90, irtParams: irt(2), tags: ['退位减', '基础'] });

  push({ type: 'fill', difficulty: 2, difficultyLabel: '基础', stem: '____ + 6 = 12', options: [], answer: '6', acceptableAnswers: ['6', '六'], solution: ['什么数加上 6 等于 12？', '用 12 - 6 来算：12 - 6 = 6。', '所以括号里填 6。'], hints: ['想 12 减 6', '6 + 6 = 12', '或一个一个数上去'], commonMistakes: [{ mistake: '写成 18', reason: '把加看成了 12+6', correction: '题目是 ? + 6 = 12，不是 12 + 6', errorLayer: 'L2' }], knowledgePoints: ['求未知数', '加减法关系'], estimatedTime: 100, irtParams: irt(2), tags: ['求未知数', '基础'] });

  push({ type: 'fill', difficulty: 2, difficultyLabel: '基础', stem: '14 - ____ = 8', options: [], answer: '6', acceptableAnswers: ['6', '六'], solution: ['14 减去多少等于 8？', '14 - 8 = 6。', '所以括号里填 6。'], hints: ['14 减 8 是多少？', '8 + ? = 14', '8 + 6 = 14'], commonMistakes: [{ mistake: '写成 8', reason: '没弄清题意', correction: '14 - 6 = 8', errorLayer: 'L2' }], knowledgePoints: ['求未知数', '加减法关系'], estimatedTime: 100, irtParams: irt(2), tags: ['求未知数', '基础'] });

  push({ type: 'choice', difficulty: 3, difficultyLabel: '进阶', stem: '17 - 8 + 5 = ?', options: ['12', '13', '14', '15'], answer: '2', acceptableAnswers: ['2', '14'], solution: ['先算 17 - 8 = 9。', '再算 9 + 5 = 14。', '所以答案是 14。'], hints: ['从左往右算', '先算 17 - 8', '结果再加 5'], commonMistakes: [{ mistake: '选 13', reason: '17 - 8 算错成 8', correction: '17 - 8 = 9，9 + 5 = 14', errorLayer: 'L2' }], knowledgePoints: ['连加连减'], estimatedTime: 110, irtParams: irt(3), tags: ['连加连减', '进阶'] });

  push({ type: 'fill', difficulty: 3, difficultyLabel: '进阶', stem: '在□里填上合适的数：\n8 + □ = 16 - 5', options: [], answer: '3', acceptableAnswers: ['3', '三'], solution: ['先算右边：16 - 5 = 11。', '等式变成 8 + □ = 11。', '11 - 8 = 3，所以□填 3。'], hints: ['先算出右边的得数', '再想 8 加几等于那个数', '16-5=11，11-8=3'], commonMistakes: [{ mistake: '写成 11', reason: '只算了右边', correction: '11 是右边的得数，还要 11 - 8 = 3', errorLayer: 'L3' }], knowledgePoints: ['等式', '加减法关系'], estimatedTime: 120, irtParams: irt(3), tags: ['等式', '进阶'] });

  push({ type: 'choice', difficulty: 3, difficultyLabel: '进阶', stem: '下面算式中，得数最大的是？', options: ['7 + 6', '9 + 5', '8 + 7', '10 + 4'], answer: '2', acceptableAnswers: ['2'], solution: ['分别计算：', '7+6=13，9+5=14，8+7=15，10+4=14。', '15 最大，所以选 8+7。'], hints: ['每个都算一遍', '再比大小', '8+7=15'], commonMistakes: [{ mistake: '选 9+5', reason: '9+5=14，不是最大', correction: '8+7=15 最大', errorLayer: 'L2' }], knowledgePoints: ['加法', '比较大小'], estimatedTime: 110, irtParams: irt(3), tags: ['比较', '进阶'] });

  push({ type: 'fill', difficulty: 3, difficultyLabel: '进阶', stem: '9 + 3 + 4 = ____', options: [], answer: '16', acceptableAnswers: ['16', '十六'], solution: ['先算 9 + 3 = 12。', '再算 12 + 4 = 16。', '所以答案是 16。'], hints: ['从左到右一步一步', '9+3=12', '12+4=16'], commonMistakes: [{ mistake: '写成 15', reason: '中间步骤算错', correction: '9+3=12，12+4=16', errorLayer: 'L2' }], knowledgePoints: ['连加'], estimatedTime: 100, irtParams: irt(3), tags: ['连加', '进阶'] });

  push({ type: 'choice', difficulty: 4, difficultyLabel: '拔高', stem: '小明把 15 - □ = 7 中的□算成了 7，他错在哪里？', options: ['应该是 8，因为 15 - 7 = 8', '应该是 7，没错', '应该是 9', '应该是 6'], answer: '0', acceptableAnswers: ['0'], solution: ['15 - □ = 7，说明□ = 15 - 7 = 8。', '所以□应该是 8，小明算成 7 错了。', '我们验证：15 - 8 = 7，对的。'], hints: ['求减数 = 被减数 - 差', '15 - 7 = ?', '15-7=8'], commonMistakes: [{ mistake: '以为答案就是 7', reason: '把差当成了减数', correction: '差是 7，减数是 8', errorLayer: 'L3' }], knowledgePoints: ['求未知数', '加减法关系'], estimatedTime: 150, irtParams: irt(4), tags: ['纠错', '拔高'] });

  return { topicId: 'g1-addition-within-20', topicName: '20以内加减法', grade: 1, category: 'basic', version: '1.0', totalQuestions: qs.length, questions: qs };
}

// 写入文件
function writeBank(name, data) {
  const filePath = path.join(OUT_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`已生成: ${filePath}`);
}

writeBank('g1-number-recognition', bankNumberRecognition());
writeBank('g1-addition-within-20', bankAddWithin20());

console.log('第一批次完成（2个文件）');
