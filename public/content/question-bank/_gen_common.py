# -*- coding: utf-8 -*-
"""生成小学奥数总结考试题库 19 个 common JSON 文件"""
import json
import os

OUTPUT_DIR = r"E:\internal_safe\study-math\public\content\question-bank\common"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 难度标签映射
DIFF_LABEL = {1: "入门", 2: "基础", 3: "进阶", 4: "拔高", 5: "竞赛"}

# 通用 IRT 参数（按难度）
IRT_BY_DIFF = {
    1: {"a": 0.9, "b": -1.5, "c": 0.25},
    2: {"a": 1.0, "b": -0.5, "c": 0.25},
    3: {"a": 1.2, "b": 0.5, "c": 0.25},
    4: {"a": 1.4, "b": 1.2, "c": 0.25},
    5: {"a": 1.6, "b": 2.0, "c": 0.25},
}


def make_q(qid, qtype, diff, stem, answer, acceptable=None, options=None,
           solution=None, hints=None, common_mistakes=None,
           knowledge_points=None, est_time=90, tags=None, image=""):
    if options is None:
        options = []
    if acceptable is None:
        acceptable = [str(answer)]
    if solution is None:
        solution = ["答案：" + str(answer)]
    if hints is None:
        hints = ["仔细读题", "尝试画图理解"]
    if common_mistakes is None:
        common_mistakes = []
    if knowledge_points is None:
        knowledge_points = []
    if tags is None:
        tags = []
    return {
        "id": qid,
        "type": qtype,
        "difficulty": diff,
        "difficultyLabel": DIFF_LABEL[diff],
        "stem": stem,
        "image": image,
        "options": options,
        "answer": str(answer),
        "acceptableAnswers": [str(x) for x in acceptable],
        "solution": solution,
        "hints": hints,
        "commonMistakes": common_mistakes,
        "source": {"type": "原创", "name": "内部题库", "year": 2026},
        "knowledgePoints": knowledge_points,
        "estimatedTime": est_time,
        "irtParams": IRT_BY_DIFF[diff],
        "tags": tags,
    }


def save(topic_id, topic_name, grade, category, questions):
    data = {
        "topicId": topic_id,
        "topicName": topic_name,
        "grade": grade,
        "category": category,
        "version": "1.0",
        "totalQuestions": len(questions),
        "questions": questions,
    }
    path = os.path.join(OUTPUT_DIR, topic_id + ".json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  ✓ {topic_id}.json ({len(questions)}题)")
    return len(questions)


# ====================== 1. counting-game 趣味数数（15题） ======================
def gen_counting_game():
    qs = []
    # 难度1 x 3
    qs.append(make_q("cm-cg-01", "fill", 1,
                     "按规律填数：1、3、5、7、____、11",
                     "9", ["9", "九"],
                     solution=["这是一列单数（奇数），每个数比前一个多2。", "7+2=9。"],
                     hints=["看看每次多几", "这些都是单数"],
                     common_mistakes=[{"mistake": "写成8", "reason": "没看出是单数", "correction": "每次加2，7+2=9", "errorLayer": "L1"}],
                     knowledge_points=["奇数", "数列规律"], est_time=60, tags=["找规律", "单数"]))
    qs.append(make_q("cm-cg-02", "fill", 1,
                     "按规律填数：2、4、6、8、____、12",
                     "10", ["10", "十"],
                     solution=["这是双数序列，每次加2。", "8+2=10。"],
                     hints=["每次多2", "都是双数"],
                     common_mistakes=[{"mistake": "写成9", "reason": "没看出是双数规律", "correction": "每次加2, 8+2=10", "errorLayer": "L1"}],
                     knowledge_points=["偶数", "数列规律"], est_time=60, tags=["找规律", "双数"]))
    qs.append(make_q("cm-cg-03", "choice", 1,
                     "找规律：5、10、15、20、？下一个数是多少？",
                     "1", None,
                     options=["22", "25", "24", "30"],
                     solution=["每个数都是5的倍数，5×1=5，5×2=10，5×3=15，5×4=20，5×5=25。", "所以下一个数是25。"],
                     hints=["都是5的倍数", "5、10、15每次多5"],
                     common_mistakes=[{"mistake": "选22", "reason": "误认为每次加2", "correction": "每次加5, 20+5=25", "errorLayer": "L1"}],
                     knowledge_points=["5的倍数", "数列规律"], est_time=60, tags=["找规律"]))
    # 难度2 x 4
    qs.append(make_q("cm-cg-04", "fill", 2,
                     "找规律填数：1、4、9、16、____、36",
                     "25", ["25", "二十五"],
                     solution=["1=1×1，4=2×2，9=3×3，16=4×4，下一个是5×5=25。", "这是平方数序列。"],
                     hints=["看看1,4,9都是什么", "1×1=1, 2×2=4, 3×3=9", "下一个是5×5"],
                     common_mistakes=[{"mistake": "写成20", "reason": "误以为每次加5", "correction": "这是平方数，5×5=25", "errorLayer": "L2"}],
                     knowledge_points=["平方数", "数列规律"], est_time=90, tags=["找规律", "平方数"]))
    qs.append(make_q("cm-cg-05", "fill", 2,
                     "找规律：2、6、12、20、____、42",
                     "30", ["30", "三十"],
                     solution=["观察差：4、6、8、？、12，差也是一个等差数列。", "下一个差是10，所以20+10=30。", "也可以看成：1×2=2，2×3=6，3×4=12，4×5=20，5×6=30。"],
                     hints=["算一算相邻两个数的差", "差是4,6,8...每次多2", "也可以写成1×2, 2×3, 3×4..."],
                     common_mistakes=[{"mistake": "写成28", "reason": "差算错", "correction": "差是10, 20+10=30", "errorLayer": "L2"}],
                     knowledge_points=["差数列", "数列规律"], est_time=90, tags=["找规律", "差数列"]))
    qs.append(make_q("cm-cg-06", "choice", 2,
                     "一串珠子按"白、黑、白、黑、白、黑"排列，第20颗是什么颜色？",
                     "1", None,
                     options=["白色", "黑色", "红色", "无法确定"],
                     solution=["珠子是2个一循环（白、黑）。", "20÷2=10，正好10个完整循环，没有余数。", "所以第20颗是循环中第2个，即黑色。"],
                     hints=["几颗一重复？", "20除以2余几？", "余数是0就看最后一个"],
                     common_mistakes=[{"mistake": "选白色", "reason": "把第20颗当成第2颗前的那个", "correction": "20÷2=10余0，对应循环的最后一个（黑色）", "errorLayer": "L2"}],
                     knowledge_points=["周期问题"], est_time=90, tags=["周期", "找规律"]))
    qs.append(make_q("cm-cg-07", "fill", 2,
                     "有一列数：3、6、9、12、15...，第10个数是多少？",
                     "30", ["30", "三十"],
                     solution=["这是3的倍数：第1个3×1=3，第2个3×2=6，...，第10个3×10=30。"],
                     hints=["第1个是3×1", "第n个是3×n"],
                     common_mistakes=[{"mistake": "写成27", "reason": "数错个数", "correction": "第10个是3×10=30", "errorLayer": "L2"}],
                     knowledge_points=["等差数列", "倍数"], est_time=90, tags=["等差数列"]))
    # 难度3 x 5
    qs.append(make_q("cm-cg-08", "fill", 3,
                     "找规律：1、1、2、3、5、8、____、21",
                     "13", ["13", "十三"],
                     solution=["每个数等于它前面两个数之和。", "1+1=2，1+2=3，2+3=5，3+5=8，5+8=13。"],
                     hints=["试试把相邻两数加起来", "1+1=2, 1+2=3...", "5+8=? "],
                     common_mistakes=[{"mistake": "写成11", "reason": "以为每次加3", "correction": "前两数之和, 5+8=13", "errorLayer": "L2"}],
                     knowledge_points=["斐波那契数列"], est_time=100, tags=["斐波那契", "找规律"]))
    qs.append(make_q("cm-cg-09", "fill", 3,
                     "按规律填：1、2、4、8、16、____、64",
                     "32", ["32", "三十二"],
                     solution=["后一个数是前一个的2倍。", "16×2=32。"],
                     hints=["每个数是前面的几倍？", "1×2=2, 2×2=4..."],
                     common_mistakes=[{"mistake": "写成24", "reason": "误以为每次加8", "correction": "每次乘2, 16×2=32", "errorLayer": "L2"}],
                     knowledge_points=["等比数列"], est_time=100, tags=["等比数列"]))
    qs.append(make_q("cm-cg-10", "fill", 3,
                     "时钟现在显示的是整点，时针和分针正好重合。现在是几点？",
                     "12", ["12", "12点", "十二", "12时"],
                     solution=["整点时，分针指向12。", "时针要和分针重合，时针也必须指向12。", "所以现在是12点（12:00）。"],
                     hints=["整点时分针指向哪里？", "重合意味着两根针都在一个位置"],
                     common_mistakes=[{"mistake": "写成6点", "reason": "混淆重合与成一条直线", "correction": "只有12点时分针时针都指向12重合", "errorLayer": "L2"}],
                     knowledge_points=["时钟问题", "重合"], est_time=100, tags=["时钟"]))
    qs.append(make_q("cm-cg-11", "fill", 3,
                     "小明从1写到100，一共写了多少个数字"1"？",
                     "21", ["21", "二十一"],
                     solution=["个位上是1的数：1,11,21,...,91 共10个。",
                               "十位上是1的数：10,11,12,...,19 共10个。",
                               "百位上是1的数：100，1个。",
                               "合计：10+10+1=21个。"],
                     hints=["分别数：个位的1、十位的1、百位的1", "11中个位和十位都是1，要数两次"],
                     common_mistakes=[{"mistake": "写成20", "reason": "漏掉100中的百位1", "correction": "100也算1个1，共21个", "errorLayer": "L2"}],
                     knowledge_points=["页码问题", "数字统计"], est_time=120, tags=["页码"]))
    qs.append(make_q("cm-cg-12", "choice", 3,
                     "一队小朋友排队，小明前面有5人，后面有8人。这一队共有多少人？",
                     "2", None,
                     options=["12人", "13人", "14人", "15人"],
                     solution=["小明前面5人 + 小明1人 + 小明后面8人 = 14人。", "5+1+8=14人。"],
                     hints=["别忘了小明自己！", "前面5人+小明+后面8人"],
                     common_mistakes=[{"mistake": "选13人", "reason": "忘记加上小明自己", "correction": "5+1+8=14人", "errorLayer": "L2"}],
                     knowledge_points=["排队问题"], est_time=90, tags=["排队"]))
    # 难度4 x 2
    qs.append(make_q("cm-cg-13", "fill", 4,
                     "有一串数：1、3、6、10、15、____。下一个数是多少？",
                     "21", ["21", "二十一"],
                     solution=["相邻两数的差是：2、3、4、5、？，下一个差是6。", "所以15+6=21。", "这是三角形数列：1, 1+2, 1+2+3, ..."],
                     hints=["算一算差：2, 3, 4, 5...", "差也是一个数列"],
                     common_mistakes=[{"mistake": "写成20", "reason": "误以为差是5", "correction": "差序列是2,3,4,5,6，下一个数=15+6=21", "errorLayer": "L3"}],
                     knowledge_points=["三角形数", "差数列"], est_time=120, tags=["三角形数"]))
    qs.append(make_q("cm-cg-14", "fill", 4,
                     "一个数加上3，再乘3，再减3，再除以3，结果还是3。这个数是多少？",
                     "1", ["1", "一"],
                     solution=["用倒推法：从结果3出发。", "除以3之前：3×3=9。", "减3之前：9+3=12。",
                               "乘3之前：12÷3=4。", "加3之前：4-3=1。", "验证：(1+3)×3-3=9，9÷3=3。✓"],
                     hints=["倒过来想", "从结果3反推", "加3的反操作是减3"],
                     common_mistakes=[{"mistake": "写成3", "reason": "计算顺序错", "correction": "用倒推：((3×3)+3)÷3-3=1", "errorLayer": "L3"}],
                     knowledge_points=["倒推法", "还原问题"], est_time=150, tags=["倒推", "还原"]))
    # 难度5 x 1
    qs.append(make_q("cm-cg-15", "fill", 5,
                     "有一个三位数，十位上的数字是百位的2倍，个位上的数字是十位的2倍。这个数可能是多少？（写出最小的那个）",
                     "124", ["124"],
                     solution=["设百位数字为a，则十位=2a，个位=4a。",
                               "因为每个数字都必须≤9，且百位a≥1。",
                               "当a=1时：百=1，十=2，个=4，数=124 ✓",
                               "当a=2时：百=2，十=4，个=8，数=248 ✓",
                               "当a=3时：个=12，不合法。",
                               "所以最小的数是124。"],
                     hints=["设百位数字为a", "那么十位=2a，个位=4a", "每个数字都不能超过9"],
                     common_mistakes=[{"mistake": "写成248", "reason": "题目问的是最小的", "correction": "最小是124", "errorLayer": "L3"}],
                     knowledge_points=["数字问题", "位值原理"], est_time=180, tags=["数字", "位值"]))
    return qs


# ====================== 2. addition-within-20 20以内加减法（15题） ======================
def gen_addition_within_20():
    qs = []
    # 难度1 x 3
    qs.append(make_q("cm-ad-01", "fill", 1, "5 + 3 = ?",
                     "8", ["8", "八"],
                     solution=["5加3等于8。"],
                     hints=["5个再加3个", "数手指：5,6,7,8"],
                     common_mistakes=[{"mistake": "写成7", "reason": "数错", "correction": "5+3=8", "errorLayer": "L1"}],
                     knowledge_points=["加法"], est_time=30, tags=["加法"]))
    qs.append(make_q("cm-ad-02", "fill", 1, "9 - 4 = ?",
                     "5", ["5", "五"],
                     solution=["9减4等于5。"],
                     hints=["从9倒数4个数"],
                     common_mistakes=[{"mistake": "写成6", "reason": "数错", "correction": "9-4=5", "errorLayer": "L1"}],
                     knowledge_points=["减法"], est_time=30, tags=["减法"]))
    qs.append(make_q("cm-ad-03", "choice", 1, "7 + 6 = ?",
                     "2", None, options=["12", "14", "13", "11"],
                     solution=["7+6=13。可以用凑十法：7+3=10，10+3=13。"],
                     hints=["7+3=10，再加3"],
                     common_mistakes=[{"mistake": "写成12", "reason": "凑十法算错", "correction": "7+3+3=13", "errorLayer": "L1"}],
                     knowledge_points=["凑十法", "进位加法"], est_time=40, tags=["凑十法"]))
    # 难度2 x 4
    qs.append(make_q("cm-ad-04", "fill", 2, "15 - 7 = ?",
                     "8", ["8", "八"],
                     solution=["15-7=8。可以用破十法：10-7=3，3+5=8。"],
                     hints=["10-7=3, 3+5=8", "也可以想7+?=15"],
                     common_mistakes=[{"mistake": "写成7", "reason": "退位错误", "correction": "15-7=8", "errorLayer": "L2"}],
                     knowledge_points=["退位减法"], est_time=45, tags=["退位减法"]))
    qs.append(make_q("cm-ad-05", "fill", 2, "8 + 5 + 2 = ?",
                     "15", ["15", "十五"],
                     solution=["8+5+2=15。可以先算8+2=10，再加5得15。"],
                     hints=["先凑十：8+2=10"],
                     common_mistakes=[{"mistake": "写成14", "reason": "计算失误", "correction": "(8+2)+5=15", "errorLayer": "L2"}],
                     knowledge_points=["连加", "巧算"], est_time=45, tags=["连加", "巧算"]))
    qs.append(make_q("cm-ad-06", "choice", 2, "17 - 5 - 2 = ?",
                     "0", None, options=["10", "11", "9", "12"],
                     solution=["17-5-2=10。也可以先把要减的加起来：17-(5+2)=10。"],
                     hints=["也可以先算5+2=7", "17-7=10"],
                     common_mistakes=[{"mistake": "写成11", "reason": "计算错误", "correction": "17-7=10", "errorLayer": "L2"}],
                     knowledge_points=["连减"], est_time=45, tags=["连减"]))
    qs.append(make_q("cm-ad-07", "fill", 2, "小明有9个苹果，吃了3个，妈妈又买了5个。现在有几个苹果？",
                     "11", ["11", "十一"],
                     solution=["原来9个，吃了3个剩 9-3=6个。", "妈妈又买5个：6+5=11个。"],
                     hints=["先减再加", "9-3=?, 再加5"],
                     common_mistakes=[{"mistake": "写成12", "reason": "顺序算错", "correction": "9-3+5=11", "errorLayer": "L2"}],
                     knowledge_points=["加减混合", "应用题"], est_time=60, tags=["应用题"]))
    # 难度3 x 5
    qs.append(make_q("cm-ad-08", "fill", 3, "在□里填数：7 + □ = 13",
                     "6", ["6", "六"],
                     solution=["□ = 13 - 7 = 6。", "验证：7+6=13 ✓"],
                     hints=["13-7=?", "想7加多少等于13"],
                     common_mistakes=[{"mistake": "写成5", "reason": "减法算错", "correction": "13-7=6", "errorLayer": "L2"}],
                     knowledge_points=["填空", "方程思想"], est_time=50, tags=["填空"]))
    qs.append(make_q("cm-ad-09", "fill", 3, "19 - □ - 6 = 7，□ = ?",
                     "6", ["6", "六"],
                     solution=["先算19-6=13，题目变成：13-□=7。", "所以□=13-7=6。"],
                     hints=["先把19-6算出来", "13-?=7"],
                     common_mistakes=[{"mistake": "写成7", "reason": "运算顺序错", "correction": "19-6-7=6", "errorLayer": "L2"}],
                     knowledge_points=["连减填空"], est_time=60, tags=["填空"]))
    qs.append(make_q("cm-ad-10", "choice", 3, "下列算式中，结果最大的是？",
                     "2", None, options=["8+7", "9+5", "9+7", "8+8"],
                     solution=["分别计算：8+7=15，9+5=14，9+7=16，8+8=16。", "9+7=16 和 8+8=16 相等最大，选项中 9+7 最大。"],
                     hints=["都算出来比一比", "9+7=16"],
                     common_mistakes=[{"mistake": "选8+8", "reason": "没看清选项顺序", "correction": "9+7=16 也是最大的", "errorLayer": "L2"}],
                     knowledge_points=["比较大小"], est_time=60, tags=["比较大小"]))
    qs.append(make_q("cm-ad-11", "fill", 3, "一本书，小红第一天看了8页，第二天比第一天多看3页，两天一共看了多少页？",
                     "19", ["19", "十九"],
                     solution=["第二天看了：8+3=11页。", "两天共：8+11=19页。"],
                     hints=["先求第二天看了多少页", "8+3=11"],
                     common_mistakes=[{"mistake": "写成11", "reason": "只算第二天", "correction": "两天共8+11=19页", "errorLayer": "L2"}],
                     knowledge_points=["两步应用题"], est_time=70, tags=["应用题"]))
    qs.append(make_q("cm-ad-12", "fill", 3, "巧算：1+2+3+4+5+6+7+8+9+10 = ?",
                     "55", ["55", "五十五"],
                     solution=["配对：1+10=11，2+9=11，3+8=11，4+7=11，5+6=11。", "共5对，11×5=55。"],
                     hints=["首尾配对", "有几对？每对和是多少？"],
                     common_mistakes=[{"mistake": "写成50", "reason": "对数算错", "correction": "5对×11=55", "errorLayer": "L2"}],
                     knowledge_points=["高斯求和", "等差数列"], est_time=90, tags=["高斯求和"]))
    # 难度4 x 2
    qs.append(make_q("cm-ad-13", "fill", 4, "□ + △ = 12，△ - 3 = 5，问□ = ?，△ = ?（用一个数字回答□即可）",
                     "4", ["4", "四"],
                     solution=["从第二个式子：△-3=5，得△=8。", "代入第一个：□+8=12，得□=4。"],
                     hints=["先求△", "△ = 5+3"],
                     common_mistakes=[{"mistake": "△算成7", "reason": "5-3=2再乱算", "correction": "△=8, □=4", "errorLayer": "L3"}],
                     knowledge_points=["等量代换", "方程组"], est_time=90, tags=["等量代换"]))
    qs.append(make_q("cm-ad-14", "fill", 4, "在1、2、3、4、5之间添上"+"或"-"，使结果等于5。\n1 □ 2 □ 3 □ 4 □ 5 = 5\n写出一种符号顺序（用+-表示，如+++-）",
                     "+-+-", ["+-+-", "+-+-+"],
                     solution=["试算：1+2-3+4-5 = -1 不对", "1+2+3+4-5 = 5 ✓  答案 +++-",
                               "1+2+3-4+5 = 7 不对", "1-2+3+4-5 = 1 不对",
                               "1+2+3+4-5 = 5 ✓  符号为+++-"],
                     hints=["全部加起来是15", "要让结果为5，需要减少10", "把某些"+"改成"-"，每改一个减少该数的2倍"],
                     common_mistakes=[{"mistake": "随便乱写", "reason": "没有方法", "correction": "1+2+3+4-5=5", "errorLayer": "L3"}],
                     knowledge_points=["巧填符号", "凑数"], est_time=150, tags=["填符号"]))
    # 难度5 x 1
    qs.append(make_q("cm-ad-15", "fill", 5,
                     "把1~9这九个数填到□里，每个数只用一次，使等式成立：□+□=□+□=□+□=□+□=□\n问中间那个单放的数(□)是多少？",
                     "5", ["5", "五"],
                     solution=["1~9的和是45。", "设单独的数为a，则剩下的8个数之和=45-a，且能分成4对相等的和。",
                               "45-a必须能被4整除。", "试：a=1时44÷4=11 ✓，但题目问单放的数。",
                               "a=5时40÷4=10 ✓。验证：1+9=2+8=3+7=4+6=10，余5=5 ✓。",
                               "所以单放的数是5。"],
                     hints=["先算1+2+...+9=45", "每对和相等，4对共8个数，剩下1个单放", "45减去单数要能被4整除"],
                     common_mistakes=[{"mistake": "写成1或9", "reason": "没验证是否能配成相等的对", "correction": "只有5时每对和为10成立", "errorLayer": "L3"}],
                     knowledge_points=["数字谜", "平均数"], est_time=180, tags=["数字谜"]))
    return qs


# ====================== 3. word-problem-1st 一年级应用题（15题） ======================
def gen_word_problem_1st():
    qs = []
    # 难度1 x 3
    qs.append(make_q("cm-wp-01", "fill", 1, "小明有5支铅笔，小红有3支铅笔。他们一共有多少支铅笔？",
                     "8", ["8", "八"],
                     solution=["5+3=8（支）"],
                     hints=["一共有→加法"],
                     common_mistakes=[{"mistake": "写成2", "reason": "误用减法", "correction": "一共用加法, 5+3=8", "errorLayer": "L1"}],
                     knowledge_points=["加法应用题"], est_time=60, tags=["一共"]))
    qs.append(make_q("cm-wp-02", "fill", 1, "树上有10只鸟，飞走了4只。还剩多少只？",
                     "6", ["6", "六"],
                     solution=["10-4=6（只）"],
                     hints=["还剩→减法"],
                     common_mistakes=[{"mistake": "写成14", "reason": "误用加法", "correction": "还剩用减法, 10-4=6", "errorLayer": "L1"}],
                     knowledge_points=["减法应用题"], est_time=60, tags=["还剩"]))
    qs.append(make_q("cm-wp-03", "choice", 1, "妈妈买了8个苹果，爸爸又买了7个。现在一共有多少个苹果？",
                     "2", None, options=["14个", "16个", "15个", "1个"],
                     solution=["8+7=15（个）"],
                     hints=["一共→加法"],
                     common_mistakes=[{"mistake": "选14个", "reason": "8+7算成14", "correction": "8+7=15", "errorLayer": "L1"}],
                     knowledge_points=["加法应用题"], est_time=60, tags=["一共"]))
    # 难度2 x 4
    qs.append(make_q("cm-wp-04", "fill", 2, "一本书有18页，小亮已经看了9页。还剩多少页没看？",
                     "9", ["9", "九"],
                     solution=["18-9=9（页）"],
                     hints=["总页数-看了的=没看的"],
                     common_mistakes=[{"mistake": "写成8", "reason": "18-9算错", "correction": "18-9=9", "errorLayer": "L2"}],
                     knowledge_points=["减法应用题"], est_time=70, tags=["还剩"]))
    qs.append(make_q("cm-wp-05", "fill", 2, "停车场有15辆车，开走了7辆，又开来了3辆。现在停车场有多少辆车？",
                     "11", ["11", "十一"],
                     solution=["15-7+3=11（辆）"],
                     hints=["开走-，开来+"],
                     common_mistakes=[{"mistake": "写成12", "reason": "15-7算成9", "correction": "15-7+3=11", "errorLayer": "L2"}],
                     knowledge_points=["加减混合"], est_time=70, tags=["加减混合"]))
    qs.append(make_q("cm-wp-06", "fill", 2, "哥哥有9颗糖，比弟弟多3颗。弟弟有几颗糖？",
                     "6", ["6", "六"],
                     solution=["哥哥比弟弟多3颗，弟弟就比哥哥少3颗。", "9-3=6（颗）。"],
                     hints=["比...多→反过来比...少", "哥=弟+3"],
                     common_mistakes=[{"mistake": "写成12", "reason": "看到'多'就加", "correction": "弟弟=9-3=6", "errorLayer": "L2"}],
                     knowledge_points=["比多比少"], est_time=70, tags=["比多比少"]))
    qs.append(make_q("cm-wp-07", "choice", 2, "红花有8朵，黄花比红花多5朵。黄花有多少朵？",
                     "1", None, options=["12朵", "13朵", "11朵", "3朵"],
                     solution=["黄花=红花+5=8+5=13朵。"],
                     hints=["比...多→加"],
                     common_mistakes=[{"mistake": "写成11", "reason": "8+5算错", "correction": "8+5=13", "errorLayer": "L2"}],
                     knowledge_points=["比多比少"], est_time=70, tags=["比多比少"]))
    # 难度3 x 5
    qs.append(make_q("cm-wp-08", "fill", 3, "小军有17个玻璃球，送给小刚几个后还剩9个。他送给小刚多少个？",
                     "8", ["8", "八"],
                     solution=["17-9=8（个）"],
                     hints=["原来-送出=剩下"],
                     common_mistakes=[{"mistake": "写成7", "reason": "17-9算错", "correction": "17-9=8", "errorLayer": "L2"}],
                     knowledge_points=["减法应用"], est_time=70, tags=["还剩"]))
    qs.append(make_q("cm-wp-09", "fill", 3, "一本书共20页，小华第一天看了5页，第二天看了7页。还剩多少页没看？",
                     "8", ["8", "八"],
                     solution=["20-5-7=8（页）", "或 20-(5+7)=8（页）"],
                     hints=["总-第一天-第二天"],
                     common_mistakes=[{"mistake": "写成9", "reason": "20-12算错", "correction": "20-12=8", "errorLayer": "L2"}],
                     knowledge_points=["连减应用"], est_time=70, tags=["连减"]))
    qs.append(make_q("cm-wp-10", "fill", 3, "小明从家到学校要走15分钟。他要在8点到校，最晚几点几分从家出发？",
                     "7:45", ["7:45", "7点45", "7点45分", "7时45分"],
                     solution=["8时-15分=7时45分。"],
                     hints=["用到校时间减走路时间", "8时-15分"],
                     common_mistakes=[{"mistake": "写成8:15", "reason": "方向搞反", "correction": "8:00-15分=7:45", "errorLayer": "L2"}],
                     knowledge_points=["时间计算"], est_time=80, tags=["时间"]))
    qs.append(make_q("cm-wp-11", "fill", 3, "一排小朋友从左数小明排第5，从右数小明排第6。这一排共多少人？",
                     "10", ["10", "十"],
                     solution=["5+6-1=10（人）", "小明被数了两次，要减1。"],
                     hints=["画个图", "小明被数了两次"],
                     common_mistakes=[{"mistake": "写成11", "reason": "忘了减1", "correction": "5+6-1=10", "errorLayer": "L2"}],
                     knowledge_points=["排队问题"], est_time=80, tags=["排队"]))
    qs.append(make_q("cm-wp-12", "choice", 3, "有16个同学去划船，每条船坐4人。需要几条船？",
                     "2", None, options=["3条", "5条", "4条", "2条"],
                     solution=["16÷4=4（条）"],
                     hints=["就是求16里有几个4"],
                     common_mistakes=[{"mistake": "写成20", "reason": "误用乘法", "correction": "除法, 16÷4=4", "errorLayer": "L2"}],
                     knowledge_points=["除法应用"], est_time=80, tags=["除法"]))
    # 难度4 x 2
    qs.append(make_q("cm-wp-13", "fill", 4, "把一根绳子对折后再对折，从中间剪一刀。绳子被剪成了几段？",
                     "5", ["5", "五"],
                     solution=["对折两次后有4层，从中间剪一刀。", "画出图示可以看到：两端各1段，中间被折点相连，共有5段。",
                               "公式：对折n次，从中间剪1刀 → 2^n+1段。这里2²+1=5段。"],
                     hints=["拿根绳子试试或画图", "对折2次后有4层", "公式：2^n+1"],
                     common_mistakes=[{"mistake": "写成4", "reason": "以为每层一刀", "correction": "对折2次剪一刀=5段", "errorLayer": "L3"}],
                     knowledge_points=["剪绳子", "折剪问题"], est_time=120, tags=["折剪"]))
    qs.append(make_q("cm-wp-14", "fill", 4, "一桶油连桶重15千克，倒出一半油后连桶重8千克。原来油重多少千克？桶重多少千克？（回答油重即可）",
                     "14", ["14", "十四"],
                     solution=["倒出一半油减少了：15-8=7千克，这就是一半油的重量。", "整桶油：7×2=14千克。", "桶重：15-14=1千克。"],
                     hints=["减少的重量是一半油", "15-8=7是一半油的重量"],
                     common_mistakes=[{"mistake": "写成7", "reason": "把一半当整桶", "correction": "油=2×7=14千克", "errorLayer": "L3"}],
                     knowledge_points=["还原问题"], est_time=120, tags=["还原"]))
    # 难度5 x 1
    qs.append(make_q("cm-wp-15", "fill", 5, "小明、小红、小刚三人共有糖18颗。小明给小红2颗后，小红再给小刚3颗，小刚再给小明1颗，这时三人糖数相等。问小明原来有多少颗糖？",
                     "7", ["7", "七"],
                     solution=["最后三人相等，各有18÷3=6颗。", "用倒推法求小明：小明最后6颗，之前他收到小刚给的1颗，所以之前是5颗。",
                               "再往前，小明曾给小红2颗，所以原来=5+2=7颗。"],
                     hints=["最后每人6颗", "用倒推：给出去的加回来，收到的减回去", "小明：6-1+2=7"],
                     common_mistakes=[{"mistake": "写成6", "reason": "没倒推", "correction": "倒推：6-1+2=7", "errorLayer": "L3"}],
                     knowledge_points=["还原问题", "倒推法"], est_time=180, tags=["倒推", "还原"]))
    return qs


# ====================== 4. multiplication-table-common 乘法口诀（15题） ======================
def gen_multiplication_table():
    qs = []
    # 难度1 x 3
    qs.append(make_q("cm-mt-01", "fill", 1, "6 × 7 = ?",
                     "42", ["42", "四十二"],
                     solution=["六七四十二，所以6×7=42。"],
                     hints=["六六三十六，加6就是六七"],
                     common_mistakes=[{"mistake": "写成48", "reason": "和六八搞混", "correction": "六七四十二", "errorLayer": "L1"}],
                     knowledge_points=["乘法口诀"], est_time=30, tags=["乘法"]))
    qs.append(make_q("cm-mt-02", "fill", 1, "8 × 9 = ?",
                     "72", ["72", "七十二"],
                     solution=["八九七十二。"],
                     hints=["九九八十一减9"],
                     common_mistakes=[{"mistake": "写成63", "reason": "七九搞混", "correction": "八九七十二", "errorLayer": "L1"}],
                     knowledge_points=["乘法口诀"], est_time=30, tags=["乘法"]))
    qs.append(make_q("cm-mt-03", "choice", 1, "下面哪个算式的得数是24？",
                     "1", None, options=["5×5", "4×6", "3×7", "6×3"],
                     solution=["4×6=24，四六二十四。"],
                     hints=["都算一遍"],
                     common_mistakes=[{"mistake": "选6×3", "reason": "6×3=18不是24", "correction": "4×6=24", "errorLayer": "L1"}],
                     knowledge_points=["乘法口诀"], est_time=35, tags=["乘法"]))
    # 难度2 x 4
    qs.append(make_q("cm-mt-04", "fill", 2, "7 × 8 = ?",
                     "56", ["56", "五十六"],
                     solution=["七八五十六。"],
                     hints=["7×7+7=56"],
                     common_mistakes=[{"mistake": "写成54", "reason": "和六九搞混", "correction": "七八五十六", "errorLayer": "L2"}],
                     knowledge_points=["乘法口诀"], est_time=35, tags=["乘法"]))
    qs.append(make_q("cm-mt-05", "fill", 2, "□ × 8 = 56，□ = ?",
                     "7", ["7", "七"],
                     solution=["想乘法口诀：七八五十六，所以□=7。"],
                     hints=["56÷8=?"],
                     common_mistakes=[{"mistake": "写成6", "reason": "六八四十八", "correction": "七八五十六, 填7", "errorLayer": "L2"}],
                     knowledge_points=["乘法填空"], est_time=40, tags=["填空"]))
    qs.append(make_q("cm-mt-06", "fill", 2, "9 × 9 + 9 = ?",
                     "90", ["90", "九十"],
                     solution=["9×9=81，81+9=90。", "或看成10个9相加=90。"],
                     hints=["9个9加1个9=10个9"],
                     common_mistakes=[{"mistake": "写成89", "reason": "81+9算错", "correction": "81+9=90", "errorLayer": "L2"}],
                     knowledge_points=["乘加混合"], est_time=45, tags=["混合运算"]))
    qs.append(make_q("cm-mt-07", "choice", 2, "一个星期有7天。5个星期有多少天？",
                     "2", None, options=["28天", "30天", "35天", "40天"],
                     solution=["7×5=35（天），五七三十五。"],
                     hints=["7×5=?"],
                     common_mistakes=[{"mistake": "写成28", "reason": "四七二十八", "correction": "五七三十五", "errorLayer": "L2"}],
                     knowledge_points=["乘法应用"], est_time=50, tags=["乘法应用"]))
    # 难度3 x 5
    qs.append(make_q("cm-mt-08", "fill", 3, "36 ÷ 6 × 2 = ?",
                     "12", ["12", "十二"],
                     solution=["按顺序：36÷6=6，6×2=12。"],
                     hints=["从左到右", "先除后乘"],
                     common_mistakes=[{"mistake": "写成3", "reason": "先算6×2", "correction": "从左到右, 36÷6×2=12", "errorLayer": "L2"}],
                     knowledge_points=["乘除混合"], est_time=50, tags=["混合运算"]))
    qs.append(make_q("cm-mt-09", "fill", 3, "巧算：25 × 4 = ?；25 × 8 = ?（回答25×8）",
                     "200", ["200", "二百"],
                     solution=["25×4=100（记住这个！）", "25×8=25×4×2=100×2=200。"],
                     hints=["记住25×4=100", "8=4×2"],
                     common_mistakes=[{"mistake": "写成180", "reason": "25×8算错", "correction": "25×8=200", "errorLayer": "L2"}],
                     knowledge_points=["巧算", "25×4"], est_time=60, tags=["巧算"]))
    qs.append(make_q("cm-mt-10", "fill", 3, "每本笔记本5元，小明买了8本还剩3元。他原来有多少钱？",
                     "43", ["43", "四十三"],
                     solution=["8本花了5×8=40元。", "原来有40+3=43元。"],
                     hints=["先算花了多少钱"],
                     common_mistakes=[{"mistake": "写成37", "reason": "5×8算成35", "correction": "5×8+3=43", "errorLayer": "L2"}],
                     knowledge_points=["乘加应用"], est_time=70, tags=["乘法应用"]))
    qs.append(make_q("cm-mt-11", "fill", 3, "3只鸡3天下3个蛋，9只鸡9天下几个蛋？",
                     "27", ["27", "二十七"],
                     solution=["3只鸡3天下3个蛋 → 1只鸡3天下1个蛋 → 1只鸡1天下1/3个蛋。",
                               "9只鸡9天：9×9×(1/3)=27个蛋。",
                               "或者：鸡数×3，天数×3，蛋数×3×3=9倍。3×9=27个。"],
                     hints=["先求1只鸡1天下几个", "别被绕晕了！"],
                     common_mistakes=[{"mistake": "写成9", "reason": "简单放大3倍", "correction": "鸡和天数各放大3倍，蛋×9倍=27", "errorLayer": "L2"}],
                     knowledge_points=["归一问题"], est_time=90, tags=["归一"]))
    qs.append(make_q("cm-mt-12", "choice", 3, "在括号里最大能填几？\n6 × ( ) < 32",
                     "0", None, options=["5", "6", "4", "3"],
                     solution=["6×5=30<32，6×6=36>32。最大填5。"],
                     hints=["试一下五六三十、六六三十六"],
                     common_mistakes=[{"mistake": "选6", "reason": "36>32不符合", "correction": "最大填5", "errorLayer": "L2"}],
                     knowledge_points=["不等式填空"], est_time=60, tags=["不等式"]))
    # 难度4 x 2
    qs.append(make_q("cm-mt-13", "fill", 4, "把+、-、×、÷ 填到○里，使等式成立（每个符号只用一次）：\n6 ○ 3 ○ 2 = 6 ○ 2 ○ 3\n（按从左到右顺序回答符号，如+−×÷）",
                     "+-+",
                     ["+-+", "+ - +", "×÷+", "+-÷+", "×+÷-"],
                     solution=["试算：6+3-2=7，6+2+3=11 不对。",
                               "再试：6×3÷2=9，6+2+3=11 不对。",
                               "再试：6+3×2=12，6×2+3=15 不对。",
                               "再试：6+3-2=7，6+2-3=5 不对。",
                               "再试：6-3+2=5，6÷2+3=6 不对。",
                               "再试：6×3-2=16，6+2×3=12 不对。",
                               "答案可有多种。例如：6+3×2=12 和 6×2+0 不行。",
                               "正确答案示例：6+3×2=12 和 6×(2+0)不行。",
                               "简单答案：6-3+2=5 和 6÷(3-2)=6 都不成立。",
                               "验证：6×3÷2=9 和 6+3-0=9 答案：×÷+... 多种组合成立。",
                               "答案：6-3+2=5，6÷2+3=6，不对。",
                               "实际可填：6+3-2=7, 6-2+3=7 ✓ 符号 +- -+"
                              ],
                     hints=["从较大的数开始试", "两边都要等于同一个数", "答案不唯一"],
                     common_mistakes=[{"mistake": "乱填", "reason": "没有思路", "correction": "如6+3-2=7, 6-2+3=7", "errorLayer": "L3"}],
                     knowledge_points=["填符号", "巧算"], est_time=150, tags=["填符号"]))
    qs.append(make_q("cm-mt-14", "fill", 4, "计算：1+2+3+4+5+6+7+8+9 = ?",
                     "45", ["45", "四十五"],
                     solution=["配对：(1+9)+(2+8)+(3+7)+(4+6)+5 = 10+10+10+10+5 = 45。",
                               "或 9×5=45（中间数5乘9个数）。"],
                     hints=["首尾配对", "每对和10, 4对+中间5"],
                     common_mistakes=[{"mistake": "写成50", "reason": "对数算错", "correction": "4×10+5=45", "errorLayer": "L3"}],
                     knowledge_points=["高斯求和"], est_time=90, tags=["高斯求和"]))
    # 难度5 x 1
    qs.append(make_q("cm-mt-15", "fill", 5, "一个自然数与它自己相加、相减、相乘、相除所得的和、差、积、商加起来，恰好是100。这个自然数是多少？",
                     "9", ["9", "九"],
                     solution=["设这个数为x。", "相加：x+x=2x", "相减：x-x=0", "相乘：x×x=x²", "相除：x÷x=1",
                               "总和：x²+2x+0+1 = (x+1)² = 100", "x+1=10, x=9。",
                               "验证：18+0+81+1=100 ✓"],
                     hints=["设为x，列方程", "相加=2x, 相减=0, 相乘=x², 相除=1", "x²+2x+1=(x+1)²=100"],
                     common_mistakes=[{"mistake": "写成10", "reason": "100是10²，但要(x+1)²=100", "correction": "x+1=10, x=9", "errorLayer": "L3"}],
                     knowledge_points=["方程思想", "完全平方"], est_time=180, tags=["方程"]))
    return qs


# ====================== 5. fraction-add-sub-common 分数加减法综合（15题） ======================
def gen_fraction_add_sub():
    qs = []
    # 难度1 x 3
    qs.append(make_q("cm-fa-01", "fill", 1, "1/5 + 2/5 = ?",
                     "3/5", ["3/5", "五分之三"],
                     solution=["分母相同，分子相加：(1+2)/5=3/5。"],
                     hints=["分母相同直接加分子"],
                     common_mistakes=[{"mistake": "写成3/10", "reason": "分母也加了", "correction": "分母不变, (1+2)/5=3/5", "errorLayer": "L1"}],
                     knowledge_points=["同分母分数加法"], est_time=60, tags=["同分母"]))
    qs.append(make_q("cm-fa-02", "fill", 1, "7/9 - 2/9 = ?",
                     "5/9", ["5/9", "九分之五"],
                     solution=["(7-2)/9=5/9。"],
                     hints=["分母不变，分子相减"],
                     common_mistakes=[{"mistake": "写成5/0", "reason": "分母也减了", "correction": "(7-2)/9=5/9", "errorLayer": "L1"}],
                     knowledge_points=["同分母分数减法"], est_time=60, tags=["同分母"]))
    qs.append(make_q("cm-fa-03", "choice", 1, "3/7 + 4/7 = ?",
                     "0", None, options=["1", "7/14", "2/7", "1/2"],
                     solution=["(3+4)/7=7/7=1。"],
                     hints=["分子和=分母时=1"],
                     common_mistakes=[{"mistake": "写成7/14", "reason": "分子分母都加了", "correction": "(3+4)/7=1", "errorLayer": "L1"}],
                     knowledge_points=["分数加法", "分数=1"], est_time=60, tags=["同分母"]))
    # 难度2 x 4
    qs.append(make_q("cm-fa-04", "fill", 2, "1/2 + 1/3 = ?",
                     "5/6", ["5/6", "六分之五"],
                     solution=["通分：分母最小公倍数=6。", "1/2=3/6，1/3=2/6。", "3/6+2/6=5/6。"],
                     hints=["先通分", "2和3的最小公倍数是6"],
                     common_mistakes=[{"mistake": "写成2/5", "reason": "分子分母分别加", "correction": "通分后算: 3/6+2/6=5/6", "errorLayer": "L2"}],
                     knowledge_points=["异分母加法"], est_time=70, tags=["异分母"]))
    qs.append(make_q("cm-fa-05", "fill", 2, "5/6 - 1/3 = ?",
                     "1/2", ["1/2", "二分之一", "3/6"],
                     solution=["通分：1/3=2/6。", "5/6-2/6=3/6=1/2。"],
                     hints=["先通分", "5/6-2/6=3/6=1/2"],
                     common_mistakes=[{"mistake": "写成4/3", "reason": "没通分", "correction": "5/6-2/6=3/6=1/2", "errorLayer": "L2"}],
                     knowledge_points=["异分母减法", "约分"], est_time=70, tags=["异分母"]))
    qs.append(make_q("cm-fa-06", "fill", 2, "2 + 3/4 = ? （用带分数回答）",
                     "2 3/4", ["2 3/4", "2又3/4", "11/4"],
                     solution=["整数加真分数直接写成带分数：2+3/4=2又3/4。", "或 2=8/4, 8/4+3/4=11/4。"],
                     hints=["整数+真分数=带分数"],
                     common_mistakes=[{"mistake": "写成5/4", "reason": "2和3/4的3加了", "correction": "2+3/4=2又3/4", "errorLayer": "L2"}],
                     knowledge_points=["整数+分数"], est_time=70, tags=["带分数"]))
    qs.append(make_q("cm-fa-07", "choice", 2, "下面哪个分数最大？",
                     "2", None, options=["1/2", "2/3", "3/4", "1/3"],
                     solution=["通分到分母12：1/2=6/12，2/3=8/12，3/4=9/12，1/3=4/12。", "最大的是3/4。"],
                     hints=["通分到相同分母再比较", "或者和1比较差距"],
                     common_mistakes=[{"mistake": "选2/3", "reason": "比较错", "correction": "3/4=0.75最大", "errorLayer": "L2"}],
                     knowledge_points=["比较分数大小"], est_time=80, tags=["比较大小"]))
    # 难度3 x 5
    qs.append(make_q("cm-fa-08", "fill", 3, "2 1/3 + 1 2/3 = ?",
                     "4", ["4", "四"],
                     solution=["2又1/3+1又2/3=(2+1)+(1/3+2/3)=3+1=4。"],
                     hints=["整数部分加整数部分，分数加分数", "1/3+2/3=1"],
                     common_mistakes=[{"mistake": "写成3 3/3", "reason": "没化简", "correction": "3 3/3=4", "errorLayer": "L2"}],
                     knowledge_points=["带分数加法"], est_time=80, tags=["带分数"]))
    qs.append(make_q("cm-fa-09", "fill", 3, "3 1/4 - 1 3/4 = ?",
                     "1 1/2", ["1 1/2", "3/2", "1又1/2"],
                     solution=["分数部分1/4<3/4，从整数部分借1：3又1/4=2又5/4。",
                               "2又5/4-1又3/4=(2-1)+(5/4-3/4)=1又2/4=1又1/2。"],
                     hints=["分数部分不够减要借位", "3 1/4=2 5/4"],
                     common_mistakes=[{"mistake": "写成2 2/4", "reason": "没借位就直接减", "correction": "借位后算=1 1/2", "errorLayer": "L2"}],
                     knowledge_points=["带分数减法", "借位"], est_time=90, tags=["带分数", "借位"]))
    qs.append(make_q("cm-fa-10", "fill", 3, "1/2 + 1/4 + 1/8 + 1/16 = ?",
                     "15/16", ["15/16"],
                     solution=["通分到16：8/16+4/16+2/16+1/16=15/16。",
                               "或用1减剩余：原式=1-1/16=15/16。"],
                     hints=["画图：正方形一半+1/4+1/8+1/16", "剩下1/16, 所以=1-1/16"],
                     common_mistakes=[{"mistake": "写成7/8", "reason": "加到1/8就停了", "correction": "加1/16, =15/16", "errorLayer": "L2"}],
                     knowledge_points=["连加", "裂项"], est_time=100, tags=["分数连加"]))
    qs.append(make_q("cm-fa-11", "fill", 3, "一堆煤，第一天用去1/3，第二天用去1/4，还剩几分之几？",
                     "5/12", ["5/12"],
                     solution=["把总量看作1。剩下=1-1/3-1/4。",
                               "=12/12-4/12-3/12=5/12。"],
                     hints=["总量是1", "1-1/3-1/4"],
                     common_mistakes=[{"mistake": "写成7/12", "reason": "1-1/3算错", "correction": "1-4/12-3/12=5/12", "errorLayer": "L2"}],
                     knowledge_points=["分数应用题"], est_time=100, tags=["分数应用"]))
    qs.append(make_q("cm-fa-12", "choice", 3, "一项工程甲独做10天完成，乙独做15天完成。两人合做几天完成？",
                     "2", None, options=["8天", "5天", "6天", "12天"],
                     solution=["甲每天做1/10，乙每天做1/15。", "两人一天共做：1/10+1/15=3/30+2/30=5/30=1/6。",
                               "1÷1/6=6天。"],
                     hints=["把总工程看作1", "甲效率1/10, 乙1/15", "合做效率=1/10+1/15=1/6"],
                     common_mistakes=[{"mistake": "选(10+15)/2", "reason": "取平均", "correction": "1÷(1/10+1/15)=6天", "errorLayer": "L3"}],
                     knowledge_points=["工程问题"], est_time=120, tags=["工程问题"]))
    # 难度4 x 2
    qs.append(make_q("cm-fa-13", "fill", 4,
                     "1/6 + 1/12 + 1/20 + 1/30 + 1/42 = ?",
                     "5/14", ["5/14"],
                     solution=["注意：1/6=1/(2×3)=1/2-1/3，1/12=1/(3×4)=1/3-1/4...",
                               "=(1/2-1/3)+(1/3-1/4)+(1/4-1/5)+(1/5-1/6)+(1/6-1/7)",
                               "=1/2-1/7=5/14。"],
                     hints=["裂项：1/(n×(n+1))=1/n-1/(n+1)", "6=2×3, 12=3×4, 20=4×5..."],
                     common_mistakes=[{"mistake": "硬算出错", "reason": "没发现裂项", "correction": "用裂项=1/2-1/7=5/14", "errorLayer": "L3"}],
                     knowledge_points=["分数裂项"], est_time=150, tags=["裂项"]))
    qs.append(make_q("cm-fa-14", "fill", 4,
                     "一桶水，第一次倒出1/2，第二次倒出剩下的1/3，第三次倒出剩下的1/4，还剩5升。原来有多少升？",
                     "20", ["20", "二十"],
                     solution=["倒推法。设原来x升。", "第一次后剩x×(1-1/2)=x/2",
                               "第二次后剩(x/