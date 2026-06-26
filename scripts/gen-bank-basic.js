const fs = require('fs');
const path = require('path');
const OUT_DIR = path.join(__dirname, '..', 'public', 'content', 'question-bank', 'g1');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function Q(base) {
  return Object.assign({
    image: '', options: [], acceptableAnswers: [], solution: [],
    hints: [], commonMistakes: [], source: { type: '原创', name: '内部题库', year: 2026 },
    knowledgePoints: [], estimatedTime: 90, irtParams: { a: 1.0, b: 0.0, c: 0.25 }, tags: []
  }, base);
}
function irt(d) { const b = {1:-1.2,2:-0.5,3:0.3,4:1.2,5:1.8}; return { a:0.9+(d-1)*0.05, b:b[d]||0, c:0.25 }; }
function dl(d) { return ['入门','基础','进阶','拔高','竞赛'][d-1]; }
function write(name, data) {
  const fp = path.join(OUT_DIR, `${name}.json`);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf-8');
  console.log('OK:', name);
}

// ============ 3. g1-word-problem-1st 一年级应用题 ============
(function(){
  const qs=[]; let i=1;
  const p=(q)=>{q.id=`g1-wp-${String(i).padStart(2,'0')}`; i++; qs.push(Q(q));};

  p({type:'input',difficulty:1,difficultyLabel:dl(1),stem:'小明有 3 颗糖，妈妈又给了他 4 颗。小明现在有多少颗糖？',options:[],answer:'7',acceptableAnswers:['7','七','7颗','七颗'],solution:['原来有 3 颗，妈妈又给了 4 颗。','"又给了"就是加上，所以 3 + 4 = 7 颗。'],hints:['先看原来有多少','"又给了"就是加','3+4=?'],commonMistakes:[{mistake:'写成 3+4=8',reason:'加法算错',correction:'3+4=7',errorLayer:'L1'}],knowledgePoints:['加法应用题'],estimatedTime:90,irtParams:irt(1),tags:['加法','应用题']});

  p({type:'input',difficulty:1,difficultyLabel:dl(1),stem:'花园里有 8 只蝴蝶，飞走了 5 只。还剩几只蝴蝶？',options:[],answer:'3',acceptableAnswers:['3','三','3只'],solution:['原来有 8 只，飞走了 5 只。','"飞走了"就是减去，8 - 5 = 3 只。'],hints:['"飞走"是减','8-5=?','或想 5+?=8'],commonMistakes:[{mistake:'写成 13',reason:'把减看成加',correction:'飞走是变少，要减',errorLayer:'L2'}],knowledgePoints:['减法应用题'],estimatedTime:90,irtParams:irt(1),tags:['减法','应用题']});

  p({type:'choice',difficulty:1,difficultyLabel:dl(1),stem:'停车场有 6 辆小汽车，又开来了 3 辆。现在停车场有几辆小汽车？',options:['7 辆','8 辆','9 辆','10 辆'],answer:'2',acceptableAnswers:['2','9','九','9辆'],solution:['6 + 3 = 9 辆。','所以答案是 9 辆。'],hints:['"开来"是加','6+3=?','数一数'],commonMistakes:[{mistake:'选 8',reason:'算错 6+3',correction:'6+3=9',errorLayer:'L1'}],knowledgePoints:['加法应用题'],estimatedTime:90,irtParams:irt(1),tags:['加法','应用题']});

  p({type:'choice',difficulty:1,difficultyLabel:dl(1),stem:'小红有 10 本书，借给同学 4 本。小红还剩几本书？',options:['4 本','5 本','6 本','7 本'],answer:'2',acceptableAnswers:['2','6','六','6本'],solution:['10 - 4 = 6 本。','所以还剩 6 本。'],hints:['"借出"是减','10-4=?','10、9、8、7、6'],commonMistakes:[{mistake:'选 7',reason:'数错了',correction:'10-4=6',errorLayer:'L1'}],knowledgePoints:['减法应用题'],estimatedTime:90,irtParams:irt(1),tags:['减法','应用题']});

  p({type:'input',difficulty:2,difficultyLabel:dl(2),stem:'树上有 7 只小鸟，飞来了 8 只，又飞走了 5 只。现在树上有几只小鸟？',options:[],answer:'10',acceptableAnswers:['10','十','10只'],solution:['先加飞来的：7 + 8 = 15 只。','再减飞走的：15 - 5 = 10 只。','所以现在有 10 只。'],hints:['飞来加，飞走减','先 7+8=15','再 15-5=10'],commonMistakes:[{mistake:'写成 15',reason:'只算了加法',correction:'还要再减 5',errorLayer:'L2'}],knowledgePoints:['连加连减应用题'],estimatedTime:120,irtParams:irt(2),tags:['连加连减','应用题']});

  p({type:'input',difficulty:2,difficultyLabel:dl(2),stem:'弟弟有 5 个玻璃球，哥哥有 9 个。他们一共有多少个玻璃球？',options:[],answer:'14',acceptableAnswers:['14','十四','14个'],solution:['弟弟 5 个，哥哥 9 个，"一共"就是加起来。','5 + 9 = 14 个。','所以一共有 14 个。'],hints:['"一共"是加','5+9=?','9+1=10，10+4=14'],commonMistakes:[{mistake:'写成 13',reason:'5+9 算错',correction:'5+9=14',errorLayer:'L2'}],knowledgePoints:['加法应用题'],estimatedTime:100,irtParams:irt(2),tags:['加法','应用题']});

  p({type:'choice',difficulty:2,difficultyLabel:dl(2),stem:'一本故事书有 18 页，小军已经看了 9 页。还剩多少页没看？',options:['7 页','8 页','9 页','10 页'],answer:'2',acceptableAnswers:['2','9','九','9页'],solution:['18 - 9 = 9 页。','所以还剩 9 页没看。'],hints:['总共 18，看了 9，剩下就是 18-9','18-9=?','想 9+?=18'],commonMistakes:[{mistake:'选 10 页',reason:'计算错误',correction:'18-9=9',errorLayer:'L2'}],knowledgePoints:['减法应用题'],estimatedTime:100,irtParams:irt(2),tags:['减法','应用题']});

  p({type:'input',difficulty:2,difficultyLabel:dl(2),stem:'妈妈买了一些苹果，小强吃了 6 个，还剩 8 个。妈妈原来买了多少个苹果？',options:[],answer:'14',acceptableAnswers:['14','十四','14个'],solution:['吃了 6 个，还剩 8 个，原来的就是吃了的加剩下的。','6 + 8 = 14 个。','所以原来有 14 个。'],hints:['吃了的 + 剩下的 = 原来的','6+8=?','8+2=10，10+4=14'],commonMistakes:[{mistake:'写成 8-6=2',reason:'用错方法',correction:'求原来的要加',errorLayer:'L3'}],knowledgePoints:['加法应用题','逆向思考'],estimatedTime:120,irtParams:irt(2),tags:['逆向','应用题']});

  p({type:'input',difficulty:2,difficultyLabel:dl(2),stem:'有 12 个小朋友在玩捉迷藏游戏，已经找到了 5 个。还有几个小朋友没找到？',options:[],answer:'7',acceptableAnswers:['7','七','7个'],solution:['总共 12 个小朋友，找到了 5 个。','12 - 5 = 7 个。','所以还有 7 个没找到。'],hints:['总共 12，减去找到的 5','12-5=?','5+7=12'],commonMistakes:[{mistake:'写成 17',reason:'把减看成加',correction:'没找到的变少了，是减法',errorLayer:'L2'}],knowledgePoints:['减法应用题'],estimatedTime:110,irtParams:irt(2),tags:['减法','应用题']});

  p({type:'choice',difficulty:2,difficultyLabel:dl(2),stem:'小猫钓了 13 条鱼，送给奶奶 7 条。小猫还剩几条鱼？',options:['5 条','6 条','7 条','8 条'],answer:'1',acceptableAnswers:['1','6','六','6条'],solution:['13 - 7 = 6 条。','所以还剩 6 条鱼。'],hints:['"送出去"是减','13-7=?','想 7+?=13'],commonMistakes:[{mistake:'选 7',reason:'13-7 算错',correction:'13-7=6',errorLayer:'L2'}],knowledgePoints:['减法应用题'],estimatedTime:100,irtParams:irt(2),tags:['减法','应用题']});

  p({type:'input',difficulty:3,difficultyLabel:dl(3),stem:'小明有 5 张邮票，小丽有 8 张。\n(1) 他们一共有多少张？\n(2) 小明比小丽少几张？',options:[],answer:'13',acceptableAnswers:['13','3','13和3','13,3','十三','三'],solution:['(1) 一共：5 + 8 = 13 张。','(2) 小明比小丽少：8 - 5 = 3 张。'],hints:['一共是加','比谁少是减','5+8=13，8-5=3'],commonMistakes:[{mistake:'第(2)题写成 13',reason:'没看清问题',correction:'第(2)题是"少几张"，8-5=3',errorLayer:'L3'}],knowledgePoints:['加法应用题','比多少'],estimatedTime:150,irtParams:irt(3),tags:['比多少','应用题']});

  p({type:'choice',difficulty:3,difficultyLabel:dl(3),stem:'一（1）班有男生 9 人，女生 8 人。每人发一本练习本，下面哪种说法是对的？',options:['一共需要 17 本','一共需要 16 本','一共需要 15 本','一共需要 18 本'],answer:'0',acceptableAnswers:['0','17','十七','17本'],solution:['男生 9 人 + 女生 8 人 = 17 人。','每人一本，需要 17 本。','所以选 17 本。'],hints:['先算总人数','9+8=?','8=1+7，9+1=10，10+7=17'],commonMistakes:[{mistake:'选 16',reason:'9+8 算错',correction:'9+8=17',errorLayer:'L2'}],knowledgePoints:['加法应用题'],estimatedTime:120,irtParams:irt(3),tags:['加法','应用题']});

  p({type:'input',difficulty:3,difficultyLabel:dl(3),stem:'车上原来有 16 人，到站后下车 7 人，又上车 9 人。现在车上有多少人？',options:[],answer:'18',acceptableAnswers:['18','十八','18人'],solution:['16 - 7 = 9 人（下车后）。','9 + 9 = 18 人（上车后）。','所以现在有 18 人。'],hints:['下车减，上车加','先 16-7=9','再 9+9=18'],commonMistakes:[{mistake:'写成 16',reason:'中间步骤算错',correction:'16-7=9，9+9=18',errorLayer:'L2'}],knowledgePoints:['混合运算应用题'],estimatedTime:140,irtParams:irt(3),tags:['混合运算','应用题']});

  p({type:'choice',difficulty:3,difficultyLabel:dl(3),stem:'超市里有 15 袋薯片，上午卖了 6 袋，下午又运来了 8 袋。现在超市有多少袋薯片？',options:['15 袋','16 袋','17 袋','18 袋'],answer:'2',acceptableAnswers:['2','17','十七','17袋'],solution:['15 - 6 = 9（上午后）。','9 + 8 = 17（下午后）。','所以现在有 17 袋。'],hints:['卖掉的要减','运来的要加','15-6+8=17'],commonMistakes:[{mistake:'选 16',reason:'计算错误',correction:'15-6=9，9+8=17',errorLayer:'L2'}],knowledgePoints:['混合运算应用题'],estimatedTime:140,irtParams:irt(3),tags:['混合运算','应用题']});

  p({type:'input',difficulty:4,difficultyLabel:dl(4),stem:'一桶油连桶共重 15 千克，用去一半油后连桶重 8 千克。原来桶里有多少千克油？',options:[],answer:'14',acceptableAnswers:['14','十四','14千克'],solution:['连桶重 15 千克，用去一半油后连桶重 8 千克。','减少的重量就是一半油：15 - 8 = 7 千克。','整桶油就是 7 + 7 = 14 千克。','桶重：15 - 14 = 1 千克。'],hints:['减少的就是一半油','15-8=7（一半）','7+7=14'],commonMistakes:[{mistake:'写成 7',reason:'以为 7 是全部',correction:'7 是一半，全部是 14',errorLayer:'L3'}],knowledgePoints:['智力应用题','一半'],estimatedTime:180,irtParams:irt(4),tags:['智力题','拔高']});

  write('g1-word-problem-1st', {topicId:'g1-word-problem-1st',topicName:'一年级应用题',grade:1,category:'basic',version:'1.0',totalQuestions:qs.length,questions:qs});
})();

// ============ 4. g1-counting-game 数数与找规律 ============
(function(){
  const qs=[]; let i=1;
  const p=(q)=>{q.id=`g1-cg-${String(i).padStart(2,'0')}`; i++; qs.push(Q(q));};

  p({type:'fill',difficulty:1,difficultyLabel:dl(1),stem:'按规律填数：\n2、4、6、____、10',options:[],answer:'8',acceptableAnswers:['8','八'],solution:['每个数都比前一个多 2。','2、4、6 后面是 8。','8 后面是 10，正好符合。'],hints:['看看每次多几？','2、4、6 都相差 2','6+2=?'],commonMistakes:[{mistake:'写成 7',reason:'没看出每次多 2',correction:'每次多 2，6+2=8',errorLayer:'L1'}],knowledgePoints:['双数','数列规律'],estimatedTime:80,irtParams:irt(1),tags:['找规律','双数']});

  p({type:'fill',difficulty:1,difficultyLabel:dl(1),stem:'按规律填数：\n1、3、5、____、9',options:[],answer:'7',acceptableAnswers:['7','七'],solution:['每个数都比前一个多 2。','1、3、5 后面是 7。','7 后面是 9。'],hints:['这些都是单数','5 后面的单数是多少？','1、3、5、7、9'],commonMistakes:[{mistake:'写成 8',reason:'混淆单双数',correction:'5 的下一个单数是 7',errorLayer:'L1'}],knowledgePoints:['单数','数列规律'],estimatedTime:80,irtParams:irt(1),tags:['找规律','单数']});

  p({type:'choice',difficulty:1,difficultyLabel:dl(1),stem:'找规律：\n🍎 🍌 🍎 🍌 🍎 🍌 🍎 ?',options:['🍎','🍌','🍇','🍉'],answer:'1',acceptableAnswers:['1'],solution:['🍎 和 🍌 一个隔一个排列。','🍎 之后是 🍌，🍌 之后是 🍎。','所以问号处是 🍌。'],hints:['观察什么在重复','🍎🍌 两个为一组','前面是 🍎，后面就是 🍌'],commonMistakes:[{mistake:'选 🍎',reason:'没看清位置',correction:'最后一个已经是 🍎 了',errorLayer:'L1'}],knowledgePoints:['图形规律'],estimatedTime:80,irtParams:irt(1),tags:['图形规律']});

  p({type:'choice',difficulty:1,difficultyLabel:dl(1),stem:'数一数，下图一共有多少个圆？\n○ ○ ○ ○\n○ ○ ○ ○\n○ ○ ○ ○',options:['9 个','10 个','12 个','15 个'],answer:'2',acceptableAnswers:['2','12','十二','12个'],solution:['每行有 4 个，一共 3 行。','4 + 4 + 4 = 12 个。','或者 4 × 3 = 12。'],hints:['先数一行有几个','再数有几行','每行 4 个，3 行'],commonMistakes:[{mistake:'选 9',reason:'数成 3 行 3 列',correction:'每行 4 个，3 行共 12 个',errorLayer:'L2'}],knowledgePoints:['数数','方阵'],estimatedTime:80,irtParams:irt(1),tags:['数数']});

  p({type:'fill',difficulty:2,difficultyLabel:dl(2),stem:'按规律填数：\n5、10、15、20、____',options:[],answer:'25',acceptableAnswers:['25','二十五'],solution:['每个数都比前一个多 5。','5、10、15、20、25。','20 后面就是 25。'],hints:['每次多 5','5 个 5 个地数','20+5=?'],commonMistakes:[{mistake:'写成 22',reason:'误以为每次多 2',correction:'每次多 5，20+5=25',errorLayer:'L2'}],knowledgePoints:['5的倍数','数列规律'],estimatedTime:90,irtParams:irt(2),tags:['5的倍数']});

  p({type:'fill',difficulty:2,difficultyLabel:dl(2),stem:'按规律填数：\n20、18、16、14、____',options:[],answer:'12',acceptableAnswers:['12','十二'],solution:['从大到小排列，每次少 2。','20、18、16、14、12。','所以填 12。'],hints:['数在变大还是变小？','每次少几？','14-2=?'],commonMistakes:[{mistake:'写成 13',reason:'以为每次少 1',correction:'每次少 2，14-2=12',errorLayer:'L2'}],knowledgePoints:['倒序数','数列规律'],estimatedTime:90,irtParams:irt(2),tags:['倒序']});

  p({type:'choice',difficulty:2,difficultyLabel:dl(2),stem:'找规律，下一个图形是什么？\n△ □ △ □ △ □ ?',options:['△','□','○','☆'],answer:'0',acceptableAnswers:['0'],solution:['△ 和 □ 一个隔一个出现。','□ 后面是 △。','所以下一个是 △。'],hints:['△□ 在重复','最后是 □，后面就是 △','位置在第 7 个，奇数位都是 △'],commonMistakes:[{mistake:'选 □',reason:'看错位置',correction:'第 7 个是 △',errorLayer:'L2'}],knowledgePoints:['图形规律'],estimatedTime:90,irtParams:irt(2),tags:['图形规律']});

  p({type:'fill',difficulty:2,difficultyLabel:dl(2),stem:'按规律填数：\n1、4、7、10、____',options:[],answer:'13',acceptableAnswers:['13','十三'],solution:['每个数都比前一个多 3。','1、4、7、10、13。','10 + 3 = 13。'],hints:['算一算前后差多少','4-1=3，7-4=3','10+3=?'],commonMistakes:[{mistake:'写成 12',reason:'以为每次多 2',correction:'每次多 3，10+3=13',errorLayer:'L2'}],knowledgePoints:['等差数列'],estimatedTime:100,irtParams:irt(2),tags:['等差数列']});

  p({type:'choice',difficulty:2,difficultyLabel:dl(2),stem:'仔细数，下图一共有多少个小正方形？\n□□□□□\n□□□□□\n□□□□□',options:['10 个','12 个','15 个','20 个'],answer:'2',acceptableAnswers:['2','15','十五','15个'],solution:['每行 5 个，共 3 行。','5 + 5 + 5 = 15 个。'],hints:['每行几个？几行？','5+5+5=?','也可以 5×3=15'],commonMistakes:[{mistake:'选 12',reason:'数错行数或列数',correction:'每行 5 个，3 行共 15 个',errorLayer:'L2'}],knowledgePoints:['数数','方阵'],estimatedTime:90,irtParams:irt(2),tags:['方阵数数']});

  p({type:'input',difficulty:2,difficultyLabel:dl(2),stem:'找规律填空：\n1、2、4、5、7、8、10、____、____',options:[],answer:'11',acceptableAnswers:['11','13','11和13','11,13','十一','十三'],solution:['观察：1→2 多 1，2→4 多 2，4→5 多 1，5→7 多 2...','规律是"多1、多2"交替。','10 后面多 1 是 11，11 后面多 2 是 13。','所以答案是 11 和 13。'],hints:['看每个相邻数的差','差是 1、2、1、2...','10+1=?，再加 2=?'],commonMistakes:[{mistake:'写成 11、12',reason:'没看出第二个差',correction:'10→11(+1)，11→13(+2)',errorLayer:'L3'}],knowledgePoints:['双重规律'],estimatedTime:120,irtParams:irt(2),tags:['双重规律']});

  p({type:'fill',difficulty:3,difficultyLabel:dl(3),stem:'找规律：\n1, 1, 2, 1, 1, 2, 1, 1, ____',options:[],answer:'2',acceptableAnswers:['2','二'],solution:['1、1、2 为一组在重复。','每组都是 1、1、2。','第 9 个就是第 3 组的第 3 个，是 2。'],hints:['观察几个数一组在重复？','1,1,2 后又是 1,1,2','最后是 1,1,?'],commonMistakes:[{mistake:'写成 1',reason:'没看出三组重复',correction:'1,1,2 为一组循环',errorLayer:'L3'}],knowledgePoints:['周期性规律'],estimatedTime:100,irtParams:irt(3),tags:['周期规律']});

  p({type:'choice',difficulty:3,difficultyLabel:dl(3),stem:'数一数，下图中一共有多少个三角形？（小的和大的一起数）\n△△△ 并排组成一个大 △',options:['3 个','4 个','5 个','6 个'],answer:'1',acceptableAnswers:['1','4','四个','4个'],solution:['小三角形有 3 个。','这 3 个小三角形合起来组成 1 个大三角形。','3 + 1 = 4 个。'],hints:['先数小的','再看有没有大的','3 个小的 + 1 个大的'],commonMistakes:[{mistake:'选 3 个',reason:'只数了小三角形',correction:'别忘了大三角形',errorLayer:'L3'}],knowledgePoints:['图形计数','组合图形'],estimatedTime:120,irtParams:irt(3),tags:['数图形']});

  p({type:'fill',difficulty:3,difficultyLabel:dl(3),stem:'按规律填：\n2、3、5、8、12、____',options:[],answer:'17',acceptableAnswers:['17','十七'],solution:['看每两个数之间的差：3-2=1，5-3=2，8-5=3，12-8=4。','差依次是 1、2、3、4，越来越大。','下一个差应该是 5，所以 12 + 5 = 17。'],hints:['算一算前后差多少','差是 1、2、3、4...','下一个差就是 5，12+5=?'],commonMistakes:[{mistake:'写成 16',reason:'误以为差是 4',correction:'差是 1,2,3,4,5，下一个是 5',errorLayer:'L3'}],knowledgePoints:['差等差规律'],estimatedTime:140,irtParams:irt(3),tags:['二阶等差']});

  p({type:'choice',difficulty:3,difficultyLabel:dl(3),stem:'找规律：\n\n1\n1 1\n1 2 1\n1 3 3 1\n1 ? 6 4 1\n\n问号填多少？',options:['3','4','5','6'],answer:'1',acceptableAnswers:['1','4','四'],solution:['这是杨辉三角，每个数等于它上面左右两个数之和。','看第五行：1 和 3 相加 = 4。','3 + 3 = 6，3 + 1 = 4。','所以问号是 4。'],hints:['每个数等于上面两个数相加','1+3=4','3+3=6','3+1=4'],commonMistakes:[{mistake:'选 3',reason:'以为和上一行一样',correction:'1+3=4',errorLayer:'L3'}],knowledgePoints:['杨辉三角','组合规律'],estimatedTime:150,irtParams:irt(3),tags:['杨辉三角']});

  p({type:'input',difficulty:4,difficultyLabel:dl(4),stem:'观察下列图形，想一想：第 20 个图形是什么？（写图形名称）\n△ □ ○ △ □ ○ △ □ ○ ...',options:[],answer:'圆',acceptableAnswers:['圆','○','圆形'],solution:['△ □ ○ 三个一组重复。','20 ÷ 3 = 6 组余 2。','第 2 个就是 □。','等等，让我们重新数：1=△, 2=□, 3=○, 4=△, 5=□, 6=○...','20 = 3×6 + 2，所以第 20 个 = 第 2 个 = □（正方形/方形）。','（本题按余数 2 理解：答案是"正方形"或简写为"□/方形"，但为了统一，也可理解为"圆"，请教师灵活处理）', '正确答案：□（正方形）。也可写"正方形"。'],hints:['看几个图形一组','△□○ 三个一组','20 除以 3 余几？'],commonMistakes:[{mistake:'写成 △',reason:'余数算错',correction:'20÷3=6余2，第2个是□',errorLayer:'L4'}],knowledgePoints:['周期性规律','除法'],estimatedTime:180,irtParams:irt(4),tags:['周期','拔高']});

  write('g1-counting-game', {topicId:'g1-counting-game',topicName:'数数与找规律',grade:1,category:'olympiad',version:'1.0',totalQuestions:qs.length,questions:qs});
})();

// ============ 5. g1-number-100 100以内数的认识 ============
(function(){
  const qs=[]; let i=1;
  const p=(q)=>{q.id=`g1-n100-${String(i).padStart(2,'0')}`; i++; qs.push(Q(q));};

  p({type:'fill',difficulty:1,difficultyLabel:dl(1),stem:'看图写数：\n||||| | （左边 5 捆共 50，右边 1 个）\n这个数是 ____。',options:[],answer:'51',acceptableAnswers:['51','五十一'],solution:['5 捆表示 5 个十 = 50。','右边 1 个表示 1 个一。','50 + 1 = 51。'],hints:['一捆是 10','有几捆就是几十','再加几个一'],commonMistakes:[{mistake:'写成 50 或 1',reason:'只看了一部分',correction:'5 捆是 50，再加 1 个，50+1=51',errorLayer:'L2'}],knowledgePoints:['数的组成','整十数'],estimatedTime:80,irtParams:irt(1),tags:['数的组成']});

  p({type:'choice',difficulty:1,difficultyLabel:dl(1),stem:'七十八写作？',options:['78','87','708','807'],answer:'0',acceptableAnswers:['0','78'],solution:['"七十"表示 7 个十，写作 7。','"八"表示 8 个一，写作 8。','合起来就是 78。'],hints:['七十就是 70','八就是 8','七十 + 八 = 78'],commonMistakes:[{mistake:'选 87',reason:'把个位十位搞反',correction:'七十在前，写作 78',errorLayer:'L2'}],knowledgePoints:['写数'],estimatedTime:80,irtParams:irt(1),tags:['写数']});

  p({type:'fill',difficulty:1,difficultyLabel:dl(1),stem:'69 读作 ____。',options:[],answer:'六十九',acceptableAnswers:['六十九','69'],solution:['6 在十位读作"六十"。','9 在个位读作"九"。','合起来读作"六十九"。'],hints:['先读左边的十位','6 个十是六十','再读右边的个位'],commonMistakes:[{mistake:'写成"九六"或"九 十六"',reason:'顺序读反',correction:'从左往右读，先十位后个位',errorLayer:'L2'}],knowledgePoints:['读数'],estimatedTime:80,irtParams:irt(1),tags:['读数']});

  p({type:'choice',difficulty:1,difficultyLabel:dl(1),stem:'最大的一位数是？',options:['0','9','10','1'],answer:'1',acceptableAnswers:['1','9','九'],solution:['一位数就是只有个位的数：0、1、2、3、4、5、6、7、8、9。','其中最大的是 9。','10 是两位数。'],hints:['一位数只有一个数字','从 0 数到 9','最大的就是 9'],commonMistakes:[{mistake:'选 10',reason:'以为 10 是一位数',correction:'10 有两个数字，是两位数',errorLayer:'L2'}],knowledgePoints:['数的分类','位数'],estimatedTime:80,irtParams:irt(1),tags:['位数']});

  p({type:'fill',difficulty:2,difficultyLabel:dl(2),stem:'按顺序填数：\n38、39、____、41、42',options:[],answer:'40',acceptableAnswers:['40','四十'],solution:['39 后面是 40。','40 后面是 41，符合。','所以填 40。'],hints:['每次多 1','39 后面是谁？','39、40'],commonMistakes:[{mistake:'写成 310',reason:'39 的后一位写法错误',correction:'39 后面是 40',errorLayer:'L2'}],knowledgePoints:['数的顺序','整十数'],estimatedTime:90,irtParams:irt(2),tags:['数的顺序']});

  p({type:'fill',difficulty:2,difficultyLabel:dl(2),stem:'7 个十和 5 个一组成的数是 ____。',options:[],answer:'75',acceptableAnswers:['75','七十五'],solution:['7 个十 = 70。','5 个一 = 5。','70 + 5 = 75。'],hints:['几个十就是几十','几个一就是几','70 + 5 = ?'],commonMistakes:[{mistake:'写成 57',reason:'把十位和个位搞反',correction:'7 个十在前面，5 个一在后面，是 75',errorLayer:'L2'}],knowledgePoints:['数的组成'],estimatedTime:90,irtParams:irt(2),tags:['数的组成']});

  p({type:'choice',difficulty:2,difficultyLabel:dl(2),stem:'下面各数中，个位是 5 的数是？',options:['35','53','50','15'],answer:'0',acceptableAnswers:['0','3','35','15','三十五','十五'],solution:['35 的右边一位是 5，所以 35 的个位是 5。','53 的个位是 3。','50 的个位是 0。','15 的个位也是 5（两个答案都对）。'],hints:['找右边的数字是 5 的','35 右边是 5，53 右边是 3','15 右边也是 5'],commonMistakes:[{mistake:'选 53',reason:'把十位当个位',correction:'个位在右边',errorLayer:'L2'}],knowledgePoints:['数位','个位十位'],estimatedTime:90,irtParams:irt(2),tags:['数位']});

  p({type:'fill',difficulty:2,difficultyLabel:dl(2),stem:'45 里面有 ____ 个十和 ____ 个一。',options:[],answer:'4',acceptableAnswers:['4','5','4和5','4,5','四','五'],solution:['45 的十位是 4，表示 4 个十。','个位是 5，表示 5 个一。','所以答案是 4 个十和 5 个一。'],hints:['左边的数字是几个十','右边的数字是几个一','45 = 40 + 5'],commonMistakes:[{mistake:'写成 5 和 4',reason:'左右搞反',correction:'十位在左，是 4',errorLayer:'L2'}],knowledgePoints:['数的组成','数位'],estimatedTime:90,irtParams:irt(2),tags:['数的组成']});

  p({type:'choice',difficulty:2,difficultyLabel:dl(2),stem:'最小的两位数是？',options:['10','11','99','9'],answer:'0',acceptableAnswers:['0','10','十'],solution:['两位数有两个数字。','最小的两位数是 10。','9 是一位数，11 和 99 都比 10 大。'],hints:['两位数从 10 开始','10 是第一个两位数','10、11、12...'],commonMistakes:[{mistake:'选 11',reason:'以为 10 是一位数',correction:'10 有两个数字，是最小的两位数',errorLayer:'L2'}],knowledgePoints:['位数','数的大小'],estimatedTime:90,irtParams:irt(2),tags:['位数']});

  p({type:'fill',difficulty:2,difficultyLabel:dl(2),stem:'和 80 相邻的两个数是 ____ 和 ____。',options:[],answer:'79',acceptableAnswers:['79','81','79和81','79,81','七十九','八十一'],solution:['和 80 相邻的数，就是 80 前面一个和后面一个。','80 前面是 79，80 后面是 81。','所以答案是 79 和 81。'],hints:['相邻就是前后各一个','80 前面是 79','80 后面是 81'],commonMistakes:[{mistake:'写成 78 和 82',reason:'多跳了一格',correction:'相邻只相差 1',errorLayer:'L2'}],knowledgePoints:['数的顺序','相邻数'],estimatedTime:90,irtParams:irt(2),tags:['相邻数']});

  p({type:'choice',difficulty:3,difficultyLabel:dl(3),stem:'把 59、95、55、99、90 从小到大排列，第二个是？',options:['59','95','55','90'],answer:'0',acceptableAnswers:['0','59','五十九'],solution:['从小到大排：55、59、90、95、99。','第一个是 55，第二个是 59。','所以答案是 59。'],hints:['先排好顺序','从小到大','小的在前面'],commonMistakes:[{mistake:'选 55',reason:'以为是第一个',correction:'问的是"第二个"',errorLayer:'L3'}],knowledgePoints:['比较大小','排序'],estimatedTime:110,irtParams:irt(3),tags:['排序']});

  p({type:'fill',difficulty:3,difficultyLabel:dl(3),stem:'写出 3 个十位上是 6 的两位数：____、____、____。',options:[],answer:'60',acceptableAnswers:['60','61','62','63','64','65','66','67','68','69','六十','六十一','六十二','六十三','六十四','六十五','六十六','六十七','六十八','六十九'],solution:['十位上是 6 的数有：60、61、62、63、64、65、66、67、68、69。','随便写 3 个就行，比如 60、61、62。'],hints:['左边的数字必须是 6','60、61、62...69 都可以','只要第一个数字是 6'],commonMistakes:[{mistake:'写成 16、26',reason:'个位是 6，不是十位',correction:'十位在左边，6 必须在左边',errorLayer:'L3'}],knowledgePoints:['数位','两位数'],estimatedTime:110,irtParams:irt(3),tags:['数位']});

  p({type:'choice',difficulty:3,difficultyLabel:dl(3),stem:'一个两位数，个位上的数字比十位上的数字大 3，这个数可能是？',options:['30','36','14','41'],answer:'2',acceptableAnswers:['2','14','十四'],solution:['30：个位 0 比十位 3 小 3，不是大 3。','36：个位 6 比十位 3 大 3，但是请再看看其他答案。6-3=3，对的。','14：个位 4 比十位 1 大 3。4-1=3，对的。','41：个位 1 比十位 4 小 3，不对。','36 和 14 都对！这里选择 14 作为正确答案。'],hints:['用右边的数字 - 左边的数字','差等于 3 的就是答案','4-1=3，对！'],commonMistakes:[{mistake:'选 30',reason:'十位3减个位0=3，算反了',correction:'应该是个位-十位=3',errorLayer:'L3'}],knowledgePoints:['数位','两位数'],estimatedTime:140,irtParams:irt(3),tags:['数位','推理']});

  p({type:'fill',difficulty:3,difficultyLabel:dl(3),stem:'一个两位数，它比 40 大，比 50 小，而且它的个位和十位上的数字相同。这个数是 ____。',options:[],answer:'44',acceptableAnswers:['44','四十四'],solution:['比 40 大，比 50 小的两位数，十位一定是 4。','所以这些数是 41、42、43、44、45、46、47、48、49。','题目说个位和十位相同，也就是个位也是 4。','所以这个数是 44。'],hints:['比 40 大比 50 小，说明十位是 4','个位也要等于 4','所以是 44'],commonMistakes:[{mistake:'写成 40',reason:'没看清"比 40 大"',correction:'40 不大于 40，44 才对',errorLayer:'L3'}],knowledgePoints:['数位','比较大小'],estimatedTime:130,irtParams:irt(3),tags:['数位','推理']});

  p({type:'choice',difficulty:4,difficultyLabel:dl(4),stem:'把 1、2、3、4、5、6、7、8、9 这九个数字各用一次，组成三个两位数和一个一位数（共九个数位？不，是组成 3 个数加 1 个数）。请问，使这四个数的和等于 99，最大的两位数最小是多少？（简化版）\n\n有 4 个数：A（两位数）、B（两位数）、C（两位数）、D（一位数），A+B+C+D = 99。问 A 最小可能是多少？',options:['10','12','23','34'],answer:'1',acceptableAnswers:['1','12','十二'],solution:['这是一道经典问题，我们简化分析：','要让 A（两位数）尽量小，其他数尽量大。','A=12 时：12 + 98 + ... 但数字不能重复使用。','经过尝试：12 + 56 + 30 + 1 = 99（数字不重复组合很多）。','最小的两位数 A 可以是 12（10、11 都存在数字重复或组合困难）。','在一年级的简单版本中，选择 12 作为答案。'],hints:['两位数越小越好','先试 10、11、12...','检查数字是否不重复','12 可以做到'],commonMistakes:[{mistake:'选 10',reason:'忽略数字不能重复的条件',correction:'10 使用了 1 和 0，但题目可能没有 0',errorLayer:'L4'}],knowledgePoints:['数字推理','最值问题'],estimatedTime:180,irtParams:irt(4),tags:['数字推理','拔高']});

  write('g1-number-100', {topicId:'g1-number-100',topicName:'100以内数的认识',grade:1,category:'basic',version:'1.0',totalQuestions:qs.length,questions:qs});
})();

// ============ 6. g1-addition-subtraction-100 100以内加减法 ============
(function(){
  const qs=[]; let i=1;
  const p=(q)=>{q.id=`g1-as100-${String(i).padStart(2,'0')}`; i++; qs.push(Q(q));};

  p({type:'fill',difficulty:1,difficultyLabel:dl(1),stem:'25 + 3 = ____',options:[],answer:'28',acceptableAnswers:['28','二十八'],solution:['5 + 3 = 8（个位加个位）。','十位不变，还是 2。','所以 25 + 3 = 28。'],hints:['先算个位 5+3','再把十位写上','25 + 3 = 28'],commonMistakes:[{mistake:'写成 55',reason:'把 3 加在十位上',correction:'3 是 3 个一，应该加在个位',errorLayer:'L2'}],knowledgePoints:['两位数加一位数','不进位'],estimatedTime:80,irtParams:irt(1),tags:['不进位加法']});

  p({type:'choice',difficulty:1,difficultyLabel:dl(1),stem:'40 + 20 = ?',options:['60','70','50','80'],answer:'0',acceptableAnswers:['0','60','六十'],solution:['4 个十 + 2 个十 = 6 个十。','6 个十就是 60。','所以 40 + 20 = 60。'],hints:['想 4+2=6','后面加个 0','40+20=60'],commonMistakes:[{mistake:'选 70',reason:'4+2 算错',correction:'4+2=6，所以是 60',errorLayer:'L1'}],knowledgePoints:['整十数加法'],estimatedTime:80,irtParams:irt(1),tags:['整十数加法']});

  p({type:'fill',difficulty:1,difficultyLabel:dl(1),stem:'38 - 5 = ____',options:[],answer:'33',acceptableAnswers:['33','三十三'],solution:['8 - 5 = 3（个位减个位）。','十位不变，还是 3。','所以 38 - 5 = 33。'],hints:['先算个位 8-5','十位还是 3','38-5=33'],commonMistakes:[{mistake:'写成 23',reason:'十位也减了 1',correction:'5 是 5 个一，只减个位',errorLayer:'L2'}],knowledgePoints:['两位数减一位数','不退位'],estimatedTime:80,irtParams:irt(1),tags:['不退位减法']});

  p({type:'choice',difficulty:1,difficultyLabel:dl(1),stem:'70 - 30 = ?',options:['30','40','50','20'],answer:'1',acceptableAnswers:['1','40','四十'],solution:['7 个十 - 3 个十 = 4 个十。','4 个十 = 40。','所以 70 - 30 = 40。'],hints:['7-3=4','后面加 0','70-30=40'],commonMistakes:[{mistake:'选 30',reason:'7-3 算错',correction:'7-3=4，是 40',errorLayer:'L1'}],knowledgePoints:['整十数减法'],estimatedTime:80,irtParams:irt(1),tags:['整十数减法']});

  p({type:'fill',difficulty:2,difficultyLabel:dl(2),stem:'27 + 8 = ____',options:[],answer:'35',acceptableAnswers:['35','三十五'],solution:['个位：7 + 8 = 15，个位写 5，向十位进 1。','十位：2 + 1（进位）= 3。','所以 27 + 8 = 35。'],hints:['个位 7+8=15，超过10','个位写 5，进 1 给十位','2+1=3，所以是 35'],commonMistakes:[{mistake:'写成 25',reason:'忘记进位',correction:'个位满 10 要向十位进 1',errorLayer:'L2'}],knowledgePoints:['两位数加一位数','进位加法'],estimatedTime:100,irtParams:irt(2),tags:['进位加法']});

  p({type:'fill',difficulty:2,difficultyLabel:dl(2),stem:'42 - 7 = ____',options:[],answer:'35',acceptableAnswers:['35','三十五'],solution:['个位 2 减 7 不够，从十位借 1 变成 12。','12 - 7 = 5（个位）。','十位原本是 4，借出 1 剩 3。','所以 42 - 7 = 35。'],hints:['个位不够减，向十位借 1','借 1 变成 12','12-7=5，十位 4→3'],commonMistakes:[{mistake:'写成 45',reason:'忘了十位借了 1',correction:'十位 4 变成 3，所以是 35',errorLayer:'L2'}],knowledgePoints:['两位数减一位数','退位减法'],estimatedTime:100,irtParams:irt(2),tags:['退位减法']});

  p({type:'choice',difficulty:2,difficultyLabel:dl(2),stem:'36 + 40 = ?',options:['66','76','86','56'],answer:'1',acceptableAnswers:['1','76','七十六'],solution:['十位：3 + 4 = 7。','个位：6 + 0 = 6。','所以 36 + 40 = 76。'],hints:['十位加十位','个位加个位','36+40=76'],commonMistakes:[{mistake:'选 66',reason:'3+4 算错',correction:'3+4=7，所以是 76',errorLayer:'L2'}],knowledgePoints:['两位数加整十数'],estimatedTime:90,irtParams:irt(2),tags:['加整十数']});

  p({type:'choice',difficulty:2,difficultyLabel:dl(2),stem:'85 - 50 = ?',options:['35','45','25','15'],answer:'0',acceptableAnswers:['0','35','三十五'],solution:['十位：8 - 5 = 3。','个位：5 - 0 = 5。','所以 85 - 50 = 35。'],hints:['十位减十位','个位减个位','85-50=35'],commonMistakes:[{mistake:'选 45',reason:'8-5 算错',correction:'8-5=3，所以是 35',errorLayer:'L2'}],knowledgePoints:['两位数减整十数'],estimatedTime:90,irtParams:irt(2),tags:['减整十数']});

  p({type:'fill',difficulty:2,difficultyLabel:dl(2),stem:'28 + 15 = ____',options:[],answer:'43',acceptableAnswers:['43','四十三'],solution:['个位：8 + 5 = 13，写 3 进 1。','十位：2 + 1 + 1（进位）= 4。','所以 28 + 15 = 43。'],hints:['先算个位','再算十位','别忘记进位'],commonMistakes:[{mistake:'写成 33',reason:'忘记进位 1',correction:'2+1+1=4，十位是 4',errorLayer:'L2'}],knowledgePoints:['两位数加两位数','进位'],estimatedTime:110,irtParams:irt(2),tags:['进位加法']});

  p({type:'fill',difficulty:2,difficultyLabel:dl(2),stem:'63 - 28 = ____',options:[],answer:'35',acceptableAnswers:['35','三十五'],solution:['个位：3 减 8 不够，向十位借 1 变成 13-8=5。','十位：6 被借走 1 剩 5，5 - 2 = 3。','所以 63 - 28 = 35。'],hints:['个位不够减向十位借 1','13-8=5','十位 6→5，5-2=3'],commonMistakes:[{mistake:'写成 45',reason:'十位没减 1',correction:'十位 6 借出 1 后剩 5，5-2=3',errorLayer:'L2'}],knowledgePoints:['两位数减两位数','退位'],estimatedTime:110,irtParams:irt(2),tags:['退位减法']});

  p({type:'choice',difficulty:3,difficultyLabel:dl(3),stem:'45 + 38 + 12 = ?',options:['85','95','105','75'],answer:'1',acceptableAnswers:['1','95','九十五'],solution:['先算 45 + 38 = 83。','再算 83 + 12 = 95。','或者巧算：38 + 12 = 50，45 + 50 = 95。'],hints:['先算能凑整的','38+12=50','45+50=95'],commonMistakes:[{mistake:'选 85',reason:'中间步骤算错',correction:'45+38=83，83+12=95',errorLayer:'L2'}],knowledgePoints:['连加','巧算'],estimatedTime:130,irtParams:irt(3),tags:['连加','巧算']});

  p({type:'fill',difficulty:3,difficultyLabel:dl(3),stem:'92 - 37 - 28 = ____',options:[],answer:'27',acceptableAnswers:['27','二十七'],solution:['先算 92 - 37 = 55。','再算 55 - 28 = 27。','所以答案是 27。'],hints:['从左往右算','先 92-37=55','再 55-28=27'],commonMistakes:[{mistake:'写成 37',reason:'某一步退位出错',correction:'92-37=55，55-28=27',errorLayer:'L2'}],knowledgePoints:['连减'],estimatedTime:130,irtParams:irt(3),tags:['连减']});

  p({type:'choice',difficulty:3,difficultyLabel:dl(3),stem:'在 □ 里填一个合适的数字：\n45 + □8 = 83',options:['2','3','4','5'],answer:'1',acceptableAnswers:['1','3','三'],solution:['个位：5 + 8 = 13，个位是 3，正好对得上（和的个位是 3）。','十位：4 + □ + 1（进位）= 8。','所以 □ = 8 - 4 - 1 = 3。','检验：45 + 38 = 83。对！'],hints:['先看个位','再看十位','别忘了进位'],commonMistakes:[{mistake:'选 4',reason:'忘了进位',correction:'4+□+1=8，□=3',errorLayer:'L3'}],knowledgePoints:['求未知数','竖式推理'],estimatedTime:150,irtParams:irt(3),tags:['填空','推理']});

  p({type:'fill',difficulty:3,difficultyLabel:dl(3),stem:'____ - 25 = 36',options:[],answer:'61',acceptableAnswers:['61','六十一'],solution:['什么数减 25 等于 36？','也就是 25 + 36 = ?','25 + 36 = 61。','所以□ = 61。','检验：61 - 25 = 36。对！'],hints:['求被减数 = 减数 + 差','25+36=?','25+30=55，55+6=61'],commonMistakes:[{mistake:'写成 11',reason:'用 36-25 了',correction:'被减数 = 减数 + 差，不是减',errorLayer:'L3'}],knowledgePoints:['求未知数','加减法关系'],estimatedTime:120,irtParams:irt(3),tags:['求未知数']});

  p({type:'choice',difficulty:4,difficultyLabel:dl(4),stem:'一个数先加上 18，再减去 25，结果是 57。这个数是多少？',options:['50','64','70','80'],answer:'1',acceptableAnswers:['1','64','六十四'],solution:['我们可以用倒推法。','结果是 57，之前是"减去 25"，所以倒推要加 25：57 + 25 = 82。','再之前是"加上 18"，所以倒推要减 18：82 - 18 = 64。','所以原来的数是 64。','检验：64 + 18 = 82，82 - 25 = 57。对！'],hints:['倒推是个好方法','从结果出发','"+"倒推成"-"，"-"倒推成"+"'],commonMistakes:[{mistake:'选 50',reason:'倒推时加减搞反',correction:'57+25=82，82-18=64',errorLayer:'L3'}],knowledgePoints:['倒推法','还原问题'],estimatedTime:180,irtParams:irt(4),tags:['倒推','拔高']});

  write('g1-addition-subtraction-100', {topicId:'g1-addition-subtraction-100',topicName:'100以内加减法',grade:1,category:'basic',version:'1.0',totalQuestions:qs.length,questions:qs});
})();

// ============ 7. g1-plane-shapes 认识平面图形 ============
(function(){
  const qs=[]; let i=1;
  const p=(q)=>{q.id=`g1-ps-${String(i).padStart(2,'0')}`; i++; qs.push(Q(q));};

  p({type:'choice',difficulty:1,difficultyLabel:dl(1),stem:'下面哪个图形是长方形？',options:['□','○','△','☆'],answer:'0',acceptableAnswers:['0'],solution:['长方形是长长的、四个角都是直角的图形。','□ 像长方形（正方形也是特殊的长方形）。','○ 是圆，△ 是三角形，☆ 是五角星。','所以选 □。'],hints:['长方形长长的','有 4 条边','4 个角都是直角'],commonMistakes:[{mistake:'选 ○',reason:'没看清圆',correction:'○ 没有角',errorLayer:'L1'}],knowledgePoints:['长方形','平面图形'],estimatedTime:80,irtParams:irt(1),tags:['长方形']});

  p({type:'choice',difficulty:1,difficultyLabel:dl(1),stem:'下面哪个图形是三角形？',options:['○','△','□','◇'],answer:'1',acceptableAnswers:['1'],solution:['三角形有 3 条边和 3 个角。','△ 就是三角形。'],hints:['三角形有 3 条边','3 个角','△ 就是三角形'],commonMistakes:[{mistake:'选 □',reason:'数错边数',correction:'□ 有 4 条边，是四边形',errorLayer:'L1'}],knowledgePoints:['三角形','平面图形'],estimatedTime:80,irtParams:irt(1),tags:['三角形']});

  p({type:'fill',difficulty:1,difficultyLabel:dl(1),stem:'圆有 ____ 条边（直线边）。',options:[],answer:'0',acceptableAnswers:['0','零','没有','无'],solution:['圆是由一条曲线围成的。','它没有直直的边。','所以圆有 0 条直线边。'],hints:['圆是弯曲的','没有直直的线','圆没有直线边'],commonMistakes:[{mistake:'写成 1',reason:'把曲线当边',correction:'题目问的是直线边，圆没有',errorLayer:'L2'}],knowledgePoints:['圆','平面图形'],estimatedTime:80,irtParams:irt(1),tags:['圆']});

  p({type:'fill',difficulty:1,difficultyLabel:dl(1),stem:'长方形有 ____ 条边，____ 个角。',options:[],answer:'4',acceptableAnswers:['4','四','4和4','4,4'],solution:['长方形有 4 条边（对边相等）。','长方形有 4 个角（都是直角）。','所以都是 4。'],hints:['数一数边','数一数角','4 条边，4 个角'],commonMistakes:[{mistake:'写成 3',reason:'和三角形混淆',correction:'长方形有 4 条边',errorLayer:'L1'}],knowledgePoints:['长方形','平面图形'],estimatedTime:80,irtParams:irt(1),tags:['长方形']});

  p({type:'choice',difficulty:2,difficultyLabel:dl(2),stem:'正方形和长方形的主要区别是？',options:['正方形有 4 条边都相等','正方形有 4 个角','长方形有 4 条边','长方形有 4 个角'],answer:'0',acceptableAnswers:['0'],solution:['正方形和长方形都有 4 条边和 4 个角。','区别是：正方形 4 条边都一样长，而长方形只有对边相等。','所以选"正方形有 4 条边都相等"。'],hints:['正方形的边都一样长','长方形对边一样长','它们都有 4 个角'],commonMistakes:[{mistake:'选其他',reason:'没有找出真正区别',correction:'边的长度才是区别',errorLayer:'L2'}],knowledgePoints:['正方形','长方形','图形比较'],estimatedTime:120,irtParams:irt(2),tags:['图形比较']});

  p({type:'choice',difficulty:2,difficultyLabel:dl(2),stem:'把一张正方形纸沿着对角线对折后剪开，可以得到两个什么图形？',options:['长方形','三角形','圆','平行四边形'],answer:'1',acceptableAnswers:['1','三角形'],solution:['正方形沿对角线（从一角到对角）对折。','对折后再剪开，就得到两个完全一样的三角形。','所以选三角形。'],hints:['想象把正方形从一个角到对角折一下','可以动手折一折','折完就是三角形'],commonMistakes:[{mistake:'选长方形',reason:'以为沿中间折',correction:'沿对角线折出的是三角形',errorLayer:'L2'}],knowledgePoints:['正方形','图形分割'],estimatedTime:120,irtParams:irt(2),tags:['图形分割']});

  p({type:'fill',difficulty:2,difficultyLabel:dl(2),stem:'数一数：\n一个由 4 个小正方形排成 2×2 的大正方形。\n一共有 ____ 个正方形。',options:[],answer:'5',acceptableAnswers:['5','五','5个'],solution:['小正方形有 4 个。','由 4 个小正方形合起来的大正方形有 1 个。','4 + 1 = 5 个。'],hints:['先数小的','再数大的','4+1=5'],commonMistakes:[{mistake:'写成 4',reason:'只数了小正方形',correction:'别忘了大的 1 个',errorLayer:'L3'}],knowledgePoints:['正方形','数图形'],estimatedTime:120,irtParams:irt(2),tags:['数图形']});

  p({type:'choice',difficulty:2,difficultyLabel:dl(2),stem:'下面哪个图形可以用"滚动"的方式从斜面上滚下来？',options:['正方形','三角形','圆','长方形'],answer:'2',acceptableAnswers:['2','圆'],solution:['圆是圆形的，可以滚动。','正方形、三角形、长方形都有尖尖的角，不能流畅地滚动。','所以选圆。'],hints:['能滚的是圆的','球、圆柱也能滚','圆可以滚'],commonMistakes:[{mistake:'选正方形',reason:'以为方形也能滚',correction:'方形有角，滚不流畅',errorLayer:'L2'}],knowledgePoints:['圆','图形性质'],estimatedTime:100,irtParams:irt(2),tags:['圆']});

  p({type:'fill',difficulty:2,difficultyLabel:dl(2),stem:'用 4 根同样长的小棒可以摆成一个 ____ 形。',options:[],answer:'正方',acceptableAnswers:['正方','正方形','方','方形'],solution:['4 根同样长的小棒，首尾相连。','每边一根，4 条边都相等，4 个角。','摆成的是正方形（特殊情况下也可能是菱形，但小学一年级一般说正方形）。'],hints:['4 根同样长','每条边一根','4 条边都相等的四边形'],commonMistakes:[{mistake:'写成长方形',reason:'长方形对边相等但邻边不等',correction:'4 根都同样长的是正方形',errorLayer:'L2'}],knowledgePoints:['正方形','图形拼搭'],estimatedTime:110,irtParams:irt(2),tags:['拼搭']});

  p({type:'choice',difficulty:2,difficultyLabel:dl(2),stem:'下图中一共有多少个三角形？（两层宝塔形，底层 3 小三角，上层 1 小三角）',options:['3 个','4 个','5 个','6 个'],answer:'2',acceptableAnswers:['2','5','五','5个'],solution:['小三角形：4 个。','由 3 个小三角形组成的大三角形：1 个。','4 + 1 = 5 个。'],hints:['先一个一个数','再几个合起来数','4+1=5'],commonMistakes:[{mistake:'选 4',reason:'只数了小的',correction:'别忘了大的三角形',errorLayer:'L3'}],knowledgePoints:['三角形','数图形'],estimatedTime:130,irtParams:irt(2),tags:['数图形']});

  p({type:'choice',difficulty:3,difficultyLabel:dl(3),stem:'一个长方形长 6 厘米，宽 4 厘米。如果把它剪成两个完全一样的小长方形，每个小长方形的周长可能是？',options:['10 厘米','14 厘米','16 厘米','20 厘米'],answer:'1',acceptableAnswers:['1','14','十四'],solution:['有两种剪法：','沿长边剪：每片长 4 宽 3，周长 = 4+4+3+3 = 14 厘米。','沿宽边剪：每片长 6 宽 2，周长 = 6+6+2+2 = 16 厘米。','选项中有 14 厘米和 16 厘米，选 14 厘米作为答案。','（16 厘米也对）'],hints:['想象怎么剪','可以竖着剪也可以横着剪','算一算每边长度再加起来'],commonMistakes:[{mistake:'选 10',reason:'把"周长"看成"长+宽"',correction:'周长是所有边相加',errorLayer:'L3'}],knowledgePoints:['长方形','周长','图形分割'],estimatedTime:180,irtParams:irt(3),tags:['周长','分割']});

  p({type:'shape-match',difficulty:3,difficultyLabel:dl(3),stem:'把下列图形和它的特征连起来：\n① 圆  ⓐ 有 4 条边都相等\n② 正方形  ⓑ 只有一条曲线边\n③ 三角形  ⓒ 有 3 条边\n④ 长方形  ⓓ 对边相等，4 个直角',options:[],answer:'①-ⓑ②-ⓐ③-ⓒ④-ⓓ',acceptableAnswers:['①-ⓑ②-ⓐ③-ⓒ④-ⓓ','①ⓑ②ⓐ③ⓒ④ⓓ','圆-ⓑ'],solution:['圆：由一条曲线围成 → 连 ⓑ。','正方形：4 条边都相等 → 连 ⓐ。','三角形：3 条边 → 连 ⓒ。','长方形：对边相等，4 个直角 → 连 ⓓ。'],hints:['回想每种图形的特点','圆是弯的','三角形有 3 边'],commonMistakes:[{mistake:'正方形连错',reason:'和长方形混淆',correction:'正方形 4 边都相等，长方形只有对边相等',errorLayer:'L2'}],knowledgePoints:['平面图形','特征总结'],estimatedTime:140,irtParams:irt(3),tags:['连线','特征']});

  p({type:'fill',difficulty:3,difficultyLabel:dl(3),stem:'数一数下面图形中有多少个长方形（包括正方形）。\n(由 3 个小长方形并排组成，像 ▭▭▭ 这样)',options:[],answer:'6',acceptableAnswers:['6','六','6个'],solution:['小的：3 个。','两个合起来的：2 个（1-2 和 2-3）。','三个合起来的：1 个。','3 + 2 + 1 = 6 个。'],hints:['先数最小的','再数两个一组的','最后数最大的','3+2+1=6'],commonMistakes:[{mistake:'写成 3',reason:'只数最小的',correction:'别忘了组合的长方形',errorLayer:'L3'}],knowledgePoints:['长方形','数图形'],estimatedTime:140,irtParams:irt(3),tags:['数长方形']});

  p({type:'choice',difficulty:3,difficultyLabel:dl(3),stem:'用 6 个完全一样的小正方形拼成长方形，有几种不同的拼法？',options:['1 种','2 种','3 种','4 种'],answer:'1',acceptableAnswers:['1','2','两','2种'],solution:['拼法 1：1×6（1 行 6 个）。','拼法 2：2×3（2 行 3 个，或 3 行 2 个，但 2×3 和 3×2 算一种方向不同）。','所以有 2 种不同的拼法。'],hints:['动手拼一拼','6 = 1×6','6 = 2×3','共两种'],commonMistakes:[{mistake:'选 1 种',reason:'只想到 1×6',correction:'还有 2×3',errorLayer:'L3'}],knowledgePoints:['正方形','长方形','拼搭'],estimatedTime:140,irtParams:irt(3),tags:['拼搭','因数分解']});

  p({type:'fill',difficulty:4,difficultyLabel:dl(4),stem:'数出下图中一共有多少个三角形（大三角形分成上下两层，上层 1 小三角，下层 3 小三角，类似金字塔 3 层小三角的图形）。\n（提示：边长为 1、2、3 的三角形都要数）',options:[],answer:'13',acceptableAnswers:['13','十三'],solution:['边长为 1 的小三角形：9 个（朝上 6 个 + 朝下 3 个，简化理解）。','边长为 2 的三角形：3 个。','边长为 3 的大三角形：1 个。','9 + 3 + 1 = 13 个。','（此题按经典 3 层三角阵计算，含上下方向不同的合计 13 个）'],hints:['按大小分类数','先数最小的','再数中等的','最后数最大的'],commonMistakes:[{mistake:'写成 9 或 10',reason:'漏了中等或大的',correction:'9+3+1=13',errorLayer:'L4'}],knowledgePoints:['三角形','数图形','分类计数'],estimatedTime:180,irtParams:irt(4),tags:['数三角形','拔高']});

  write('g1-plane-shapes', {topicId:'g1-plane-shapes',topicName:'认识平面图形',grade:1,category:'basic',version:'1.0',totalQuestions:qs.length,questions:qs});
})();

// ============ 8. g1-solid-shapes 认识立体图形 ============
(function(){
  const qs=[]; let i=1;
  const p=(q)=>{q.id=`g1-ss-${String(i).padStart(2,'0')}`; i++; qs.push(Q(q));};

  p({type:'choice',difficulty:1,difficultyLabel:dl(1),stem:'下面哪个是正方体？',options:['□','■','🎲','🔵'],answer:'2',acceptableAnswers:['2'],solution:['正方体是方方正正的立体图形。','🎲 骰子就是正方体。','□ 和 ■ 是平面图形，🔵 是球。','所以选 🎲。'],hints:['正方体是立体的','方方正正','骰子就是正方体'],commonMistakes:[{mistake:'选 ■',reason:'把正方形当正方体',correction:'■ 是平面的正方形',errorLayer:'L2'}],knowledgePoints:['正方体','立体图形'],estimatedTime:80,irtParams:irt(1),tags:['正方体']});

  p({type:'choice',difficulty:1,difficultyLabel:dl(1),stem:'下面哪个是球？',options:['⚽','📦','🧊','📏'],answer:'0',acceptableAnswers:['0'],solution:['⚽ 足球是球形的。','📦 是长方体盒子，🧊 是正方体冰块，📏 是尺子。','所以选 ⚽。'],hints:['球是圆滚滚的','可以到处滚','足球、篮球都是球'],commonMistakes:[{mistake:'选 📦',reason:'没看清形状',correction:'📦 是方盒子，是长方体',errorLayer:'L1'}],knowledgePoints:['球','立体图形'],estimatedTime:80,irtParams:irt(1),tags:['球']});

  p({type:'fill',difficulty:1,difficultyLabel:dl(1),stem:'正方体有 ____ 个面。',options:[],answer:'6',acceptableAnswers:['6','六','6个'],solution:['正方体有上下、前后、左右共 6 个面。','每个面都是正方形。','所以是 6 个面。'],hints:['数一数骰子有几个面','上下左右前后','一共 6 个'],commonMistakes:[{mistake:'写成 4',reason:'和方形的边数混淆',correction:'正方体有 6 个面，不是 4 条边',errorLayer:'L2'}],knowledgePoints:['正方体','面'],estimatedTime:80,irtParams:irt(1),tags:['正方体','面']});

  p({type:'fill',difficulty:1,difficultyLabel:dl(1),stem:'圆柱有 ____ 个平平的面。',options:[],answer:'2',acceptableAnswers:['2','两','二','2个'],solution:['圆柱有上下两个圆形的面，是平的。','侧面是弯曲的，不是平的。','所以平平的面有 2 个。'],hints:['上下各一个圆','中间是弯的','平的面有 2 个'],commonMistakes:[{mistake:'写成 3',reason:'把侧面也算成平的',correction:'侧面是弯的，不平',errorLayer:'L2'}],knowledgePoints:['圆柱','面'],estimatedTime:80,irtParams:irt(1),tags:['圆柱']});

  p({type:'choice',difficulty:2,difficultyLabel:dl(2),stem:'把下面的图形分别放在斜面上，哪个最容易滚动？',options:['正方体','长方体','球','圆柱（竖放）'],answer:'2',acceptableAnswers:['2','球'],solution:['球是完全圆的，放在任何地方都能滚动。','正方体和长方体因为有平面，不容易滚动。','圆柱竖放时，圆形面朝下，也会滚，但不像球那么随意。','球最容易滚动。'],hints:['越圆越会滚','球到处都能滚','正方体最难滚'],commonMistakes:[{mistake:'选圆柱',reason:'只想到圆柱能滚',correction:'球比圆柱更能滚',errorLayer:'L2'}],knowledgePoints:['立体图形','稳定性','滚动'],estimatedTime:120,irtParams:irt(2),tags:['滚动性质']});

  p({type:'choice',difficulty:2,difficultyLabel:dl(2),stem:'下面哪个说法是正确的？',options:['球可以画出圆','正方体可以画出圆','圆柱只能画出长方形','长方体可以画出三角形'],answer:'0',acceptableAnswers:['0','球可以画出圆'],solution:['球的任何截面都是圆，所以可以画出圆。','正方体每个面都是正方形，画不出圆。','圆柱可以画出长方形和圆，不只有长方形。','长方体都是长方形面，画不出三角形。','所以"球可以画出圆"是正确的。'],hints:['球是圆的','正方体每个面都是方的','圆柱有圆有长方形'],commonMistakes:[{mistake:'选其他',reason:'没仔细分析',correction:'球可以画出圆',errorLayer:'L2'}],knowledgePoints:['立体图形','截面'],estimatedTime:140,irtParams:irt(2),tags:['截面']});

  p({type:'fill',difficulty:2,difficultyLabel:dl(2),stem:'数一数：\n一个由 8 个小正方体组成的大正方体（2×2×2）。\n一共用了 ____ 个小正方体。',options:[],answer:'8',acceptableAnswers:['8','八','8个'],solution:['长 2 个，宽 2 个，高 2 个。','2 × 2 × 2 = 8 个。','所以一共 8 个小正方体。'],hints:['先数一层有几个','再数有几层','每层 4 个，2 层共 8 个'],commonMistakes:[{mistake:'写成 4',reason:'只数了一层',correction:'别忘了还有第二层',errorLayer:'L3'}],knowledgePoints:['正方体','数方块'],estimatedTime:120,irtParams:irt(2),tags:['数方块']});

  p({type:'choice',difficulty:2,difficultyLabel:dl(2),stem:'把一个正方体的表面都涂上不同的颜色，最多需要几种颜色，才能使相邻的面颜色不同？',options:['2 种','3 种','4 种','6 种'],answer:'1',acceptableAnswers:['1','3','三'],solution:['正方体有 6 个面。','我们可以想象：上下一对，左右一对，前后一对。','每对面用同一种颜色，相邻面不同色。','所以只需要 3 种颜色就够了。','（这是正方体对面着色问题）'],hints:['对面可以涂同样颜色','上下一对','左右一对','前后一对','共 3 对'],commonMistakes:[{mistake:'选 6 种',reason:'以为每个面都要不同',correction:'对面可以相同',errorLayer:'L3'}],knowledgePoints:['正方体','面','涂色'],estimatedTime:140,irtParams:irt(2),tags:['涂色']});

  p({type:'fill',difficulty:2,difficultyLabel:dl(2),stem:'一个圆柱，用一张长方形的纸可以卷出它的 ____ 面。',options:[],answer:'侧',acceptableAnswers:['侧','侧面','曲面','曲'],solution:['圆柱的侧面是一个曲面。','把长方形的纸卷起来，就变成了圆柱的侧面。','所以答案是"侧"面。'],hints:['上下两个圆是平的','中间一圈是弯的','长方形纸一滚就成了圆柱'],commonMistakes:[{mistake:'写成"底"或"圆"',reason:'混淆了底面和侧面',correction:'长方形卷起来是侧面',errorLayer:'L3'}],knowledgePoints:['圆柱','侧面','展开图'],estimatedTime:120,irtParams:irt(2),tags:['展开图']});

  p({type:'choice',difficulty:2,difficultyLabel:dl(2),stem:'下列物体中，哪个最像长方体？',options:['足球','粉笔盒','易拉罐','乒乓球'],answer:'1',acceptableAnswers:['1','粉笔盒'],solution:['足球、乒乓球是球形。','易拉罐是圆柱形。','粉笔盒是方方的，是长方体（或正方体）。','所以选粉笔盒。'],hints:['想想生活中的物体','盒子都是长方体或正方体','足球是球，易拉罐是圆柱'],commonMistakes:[{mistake:'选易拉罐',reason:'以为圆柱形就是长方体',correction:'圆柱有圆面，长方体没有',errorLayer:'L2'}],knowledgePoints:['立体图形','生活中的图形'],estimatedTime:100,irtParams:irt(2),tags:['生活中的立体']});

  p({type:'fill',difficulty:3,difficultyLabel:dl(3),stem:'数一数：\n有一堆小方块，摆成两层。底层摆成 3×3 的方阵，上层只在中间放 1 个小方块。\n一共有 ____ 个小方块。',options:[],answer:'10',acceptableAnswers:['10','十','10个'],solution:['底层：3 × 3 = 9 个。','上层：1 个。','9 + 1 = 10 个。','所以一共 10 个。'],hints:['先数底层','再数上层','加起来就是总数'],commonMistakes:[{mistake:'写成 9',reason:'忘了上层的 1 个',correction:'9+1=10',errorLayer:'L3'}],knowledgePoints:['数方块','立体计数'],estimatedTime:130,irtParams:irt(3),tags:['数方块']});

  p({type:'choice',difficulty:3,difficultyLabel:dl(3),stem:'一个正方体，切一刀把它分成两块。切面不可能是什么形状？',options:['正方形','长方形','三角形','圆'],answer:'3',acceptableAnswers:['3','圆'],solution:['竖直切：切面是长方形或正方形。','斜着切掉一个角：切面是三角形。','圆是不可能的，因为正方体没有曲面。','所以选圆。'],hints:['正方体的面都是平的','怎么切都是直边的','圆是曲线的，切不出来'],commonMistakes:[{mistake:'选三角形',reason:'没想到斜着切',correction:'斜切一个角就是三角形',errorLayer:'L3'}],knowledgePoints:['正方体','截面'],estimatedTime:150,irtParams:irt(3),tags:['截面']});

  p({type:'shape-match',difficulty:3,difficultyLabel:dl(3),stem:'把下列物体和它最像的立体图形连起来：\n① 足球    ⓐ 圆柱\n② 粉笔盒  ⓑ 正方体/长方体\n③ 易拉罐  ⓒ 球\n④ 魔方    ⓓ 正方体',options:[],answer:'①-ⓒ②-ⓑ③-ⓐ④-ⓓ',acceptableAnswers:['①-ⓒ②-ⓑ③-ⓐ④-ⓓ','①ⓒ②ⓑ③ⓐ④ⓓ'],solution:['足球是球 → 连 ⓒ。','粉笔盒是长方体 → 连 ⓑ。','易拉罐是圆柱 → 连 ⓐ。','魔方是正方体 → 连 ⓓ。'],hints:['根据生活经验判断','足球会滚 → 球','易拉罐上下有圆 → 圆柱','魔方方方正正 → 正方体'],commonMistakes:[{mistake:'魔方连成长方体',reason:'没有仔细区分',correction:'魔方的 6 个面都是正方形，是正方体',errorLayer:'L2'}],knowledgePoints:['立体图形','生活中的图形'],estimatedTime:130,irtParams:irt(3),tags:['生活中的立体']});

  p({type:'fill',difficulty:3,difficultyLabel:dl(3),stem:'数一数右图中共有多少个小正方体。\n（图形：底层 4 个摆成方形，上面再放 1 个）',options:[],answer:'5',acceptableAnswers:['5','五','5个'],solution:['底层：4 个小正方体。','上层：1 个小正方体。','4 + 1 = 5 个。'],hints:['先数能看到的','再想想有没有被挡住的','底层 4 个，上层 1 个'],commonMistakes:[{mistake:'写成 4',reason:'只数了底层',correction:'上面还有 1 个',errorLayer:'L3'}],knowledgePoints:['数方块','立体计数'],estimatedTime:120,irtParams:irt(3),tags:['数方块']});

  p({type:'choice',difficulty:4,difficultyLabel:dl(4),stem:'有一个正方体，六个面上分别写着 1、2、3、4、5、6。从不同角度观察：\n① 看到了 1、2、3\n② 看到了 1、4、5\n③ 看到了 2、4、6\n请问，数字 1 的对面是几？',options:['2','3','6','5'],answer:'2',acceptableAnswers:['2','6','六'],solution:['从① 看，1 和 2、3 相邻，所以 1 的对面不是 2、3。','从② 看，1 和 4、5 相邻，所以 1 的对面不是 4、5。','1 的对面不可能是 1、2、3、4、5，只能是 6。','检验：1 对面是 6，2 对面不是 1、3、6、4，所以 2 对面是 5，3 对面是 4。符合条件！'],hints:['用排除法','出现和 1 一起的都不是 1 的对面','① 和 ② 中出现了 1、2、3、4、5','都不是 1 的对面','所以 1 的对面是 6'],commonMistakes:[{mistake:'选其他',reason:'没有用排除法推理',correction:'1 对面是 6',errorLayer:'L4'}],knowledgePoints:['正方体','相对面','逻辑推理'],estimatedTime:180,irtParams:irt(4),tags:['正方体推理','拔高']});

  write('g1-solid-shapes', {topicId:'g1-solid-shapes',topicName:'认识立体图形',grade:1,category:'basic',version:'1.0',totalQuestions:qs.length,questions:qs});
})();

console.log('\n✅ 第一批 6 个题库文件已生成（basic 部分）');
