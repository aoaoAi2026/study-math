# -*- coding: utf-8 -*-
"""生成小学奥数总结考试题库 - 低年级综合 6个文件 (各15题)"""
import json, os

OUT = r"E:\internal_safe\study-math\public\content\question-bank\common"
os.makedirs(OUT, exist_ok=True)

DIFF = {1: (0.9, -1.5), 2: (1.0, -0.5), 3: (1.2, 0.5), 4: (1.4, 1.2), 5: (1.6, 2.0)}
DLABEL = {1: "入门", 2: "基础", 3: "进阶", 4: "拔高", 5: "竞赛"}

def q(pid, qtype, diff, stem, answer, acceptable=None, options=None,
      solution=None, hints=None, mistakes=None, kp=None, t=90, tags=None):
    a, b = DIFF[diff]
    if solution is None:
        solution = ["答案: " + str(answer)]
    if hints is None:
        hints = []
    if mistakes is None:
        mistakes = []
    if kp is None:
        kp = []
    if tags is None:
        tags = []
    if acceptable is None:
        acceptable = [str(answer)]
    if options is None:
        options = []
    return {"id": pid, "type": qtype, "difficulty": diff, "difficultyLabel": DLABEL[diff],
            "stem": stem, "image": "", "options": options, "answer": str(answer),
            "acceptableAnswers": [str(x) for x in acceptable], "solution": solution,
            "hints": hints, "commonMistakes": mistakes,
            "source": {"type": "原创", "name": "内部题库", "year": 2026},
            "knowledgePoints": kp, "estimatedTime": t,
            "irtParams": {"a": a, "b": b, "c": 0.25}, "tags": tags}

def save(tid, tname, grade, qs):
    data = {"topicId": tid, "topicName": tname, "grade": grade, "category": "review",
            "version": "1.0", "totalQuestions": len(qs), "questions": qs}
    with open(os.path.join(OUT, tid + ".json"), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  ✓ {tid} ({len(qs)}题)")

# ==== 1. counting-game 趣味数数 ====
qs = []
qs.append(q("cm-cg-01","fill",1,"按规律填数：2、4、6、8、____","10",["10","十"],
    solution=["这是连续的偶数，每次加2。","8 + 2 = 10。"],
    hints=["每次多几？","都是双数"],
    mistakes=[{"mistake":"写成9","reason":"以为每次加1","correction":"每次加2,8+2=10","errorLayer":"L1"}],
    kp=["偶数","数列规律"],t=45,tags=["找规律"]))
qs.append(q("cm-cg-02","fill",1,"按规律填数：10、15、20、25、____","30",["30","三十"],
    solution=["每次加5，都是5的倍数。","25 + 5 = 30。"],
    hints=["每次多5","数一数:10,15,20,25..."],
    mistakes=[{"mistake":"写成35","reason":"多加了","correction":"25+5=30","errorLayer":"L1"}],
    kp=["倍数","数列规律"],t=45,tags=["找规律"]))
qs.append(q("cm-cg-03","fill",1,"按规律填数：1、2、4、8、____","16",["16","十六"],
    solution=["后一个数是前一个数的2倍。","8 × 2 = 16。"],
    hints=["每个数是前面的几倍？","1×2=2,2×2=4..."],
    mistakes=[{"mistake":"写成12","reason":"误以为每次加4","correction":"8×2=16","errorLayer":"L1"}],
    kp=["等比数列"],t=45,tags=["找规律"]))
qs.append(q("cm-cg-04","fill",2,"按规律填数：1、4、9、16、____、36","25",["25","二十五"],
    solution=["每个数是位置序号的平方。","1=1×1,4=2×2,9=3×3,16=4×4,5×5=25。"],
    hints=["1=1×1,4=2×2,9=3×3","第5个是什么？"],
    mistakes=[{"mistake":"写成24","reason":"误以为每次加5,6,7","correction":"5×5=25","errorLayer":"L2"}],
    kp=["平方数","数列规律"],t=60,tags=["平方数"]))
qs.append(q("cm-cg-05","fill",2,"找规律填数：2、6、12、20、____、42","30",["30","三十"],
    solution=["相邻两数的差是：4、6、8、10、12。","20 + 10 = 30。","也可看成：1×2=2,2×3=6,3×4=12,4×5=20,5×6=30。"],
    hints=["算一算差","差:4,6,8...","也可写成n×(n+1)"],
    mistakes=[{"mistake":"写成28","reason":"差算成8","correction":"差是10,20+10=30","errorLayer":"L2"}],
    kp=["差数列"],t=60,tags=["找规律"]))
qs.append(q("cm-cg-06","fill",2,"找规律填数：1、1、2、3、5、8、____、21","13",["13","十三"],
    solution=["每个数等于它前面两个数的和。","5 + 8 = 13。这是斐波那契数列。"],
    hints=["1+1=2,1+2=3,2+3=5,3+5=8","接下来5+8=?"],
    mistakes=[{"mistake":"写成11","reason":"误以为每次加3","correction":"5+8=13","errorLayer":"L2"}],
    kp=["斐波那契数列"],t=60,tags=["找规律"]))
qs.append(q("cm-cg-07","choice",2,"一串珠子按白、黑、白、黑排列，第20颗是什么颜色？","1",
    options=["白色","黑色","红色","无法确定"],
    solution=["2个一循环(白、黑)。","20 ÷ 2 = 10，没有余数。","所以是循环的最后一个，即黑色。"],
    hints=["每几颗重复一次？","20除以几？","余数为0时看最后一个"],
    mistakes=[{"mistake":"选白色","reason":"误以为余1","correction":"20÷2=10余0,对应黑色","errorLayer":"L2"}],
    kp=["周期问题"],t=80,tags=["周期"]))
qs.append(q("cm-cg-08","fill",3,"找规律：1、3、6、10、15、____","21",["21","二十一"],
    solution=["相邻两数的差是2、3、4、5、6。","15 + 6 = 21。这是三角形数列。"],
    hints=["差:2,3,4,5...","15+6=?"],
    mistakes=[{"mistake":"写成20","reason":"误以为差是5","correction":"差是6,15+6=21","errorLayer":"L2"}],
    kp=["三角形数","差数列"],t=75,tags=["三角形数"]))
qs.append(q("cm-cg-09","fill",3,"小明从1写到100，一共写了多少个数字1？","21",["21","二十一"],
    solution=["个位上是1的数:1,11,21,...,91共10个。","十位上是1的数:10,11,...,19共10个。","百位上是1的数:100，1个。","合计:10+10+1=21个。"],
    hints=["分别数:个位的1、十位的1、百位的1","11中个位和十位都是1,要数两次"],
    mistakes=[{"mistake":"写成20","reason":"漏掉100中的百位1","correction":"100也算1个1,共21个","errorLayer":"L2"}],
    kp=["页码问题","数字统计"],t=120,tags=["页码"]))
qs.append(q("cm-cg-10","fill",3,"一串数:1、2、2、3、3、3、4、4、4、4、...第50个数是多少？","10",["10","十"],
    solution=["数字n出现n次。","前9个数累计:1+2+3+...+9=45。","前10个数累计:45+10=55。","第46到55个都是10，所以第50个是10。"],
    hints=["先算前n个数共有多少个","1+2+3+...+n=n(n+1)/2"],
    mistakes=[{"mistake":"写成9","reason":"算错累计数","correction":"前9个共45,第50个是10","errorLayer":"L2"}],
    kp=["数列","高斯求和"],t=100,tags=["计数"]))
qs.append(q("cm-cg-11","fill",3,"把1-9这九个数字填入□，每个数字只用一次，使等式成立：□+□=□+□=□+□=□+□=□。问中间单独的数是多少？","5",["5","五"],
    solution=["1到9的和是45。","设单独的数为a，剩下8个数之和=45-a，能分成4对相等的和。","45-a必须被4整除。","a=5时:45-5=40，40÷4=10。验证:1+9=2+8=3+7=4+6=10,余5✓"],
    hints=["先算1+2+...+9=?","45-a能被4整除","试一下哪些a可以?"],
    mistakes=[{"mistake":"写成1或9","reason":"没有验证每对和是否相等","correction":"只有5时每对和为10成立","errorLayer":"L2"}],
    kp=["数字谜","平均数"],t=150,tags=["数字谜"]))
qs.append(q("cm-cg-12","fill",4,"一列数:1、2、3、2、3、4、3、4、5、4、5、6、...前100个数的和是多少？","1815",["1815"],
    solution=["每3个一组:(1,2,3),(2,3,4),(3,4,5),...,每组和是6,9,12,...是首项6公差3的等差数列。","前99个数=33组，第33组=(33,34,35),和=102。","33组和=(6+102)×33÷2=1782。","第100个数=34。总和=1782+33=1815。"],
    hints=["每3个一组看看","每组和:6,9,12...是等差数列"],
    mistakes=[{"mistake":"写成1782","reason":"忘了加第100个数","correction":"前99个=1782,第100个=33,共1815","errorLayer":"L3"}],
    kp=["数列分组","等差数列求和"],t=180,tags=["分组求和"]))
qs.append(q("cm-cg-13","fill",4,"一个数加上3，再乘3，再减3，再除以3，结果还是3。这个数是多少？","1",["1","一"],
    solution=["用倒推法:从3出发。","除以3之前:3×3=9。","减3之前:9+3=12。","乘3之前:12÷3=4。","加3之前:4-3=1。","验证:(1+3)×3-3=9,9÷3=3✓"],
    hints=["倒过来想!","从结果反推","加3的反操作是减3"],
    mistakes=[{"mistake":"写成3","reason":"计算顺序错","correction":"((3×3)+3)÷3-3=1","errorLayer":"L3"}],
    kp=["倒推法","还原问题"],t=120,tags=["倒推"]))
qs.append(q("cm-cg-14","fill",4,"一个数列：1、2、2、3、3、3、4、4、4、4、...中，数20出现多少次？它是第几个数开始？","20",["20","二十"],
    solution=["数n出现n次，所以20出现20次。","1到19的数出现次数之和是1+2+...+19=190。","所以20是从第191个数开始出现。"],
    hints=["数n出现几次？","1+2+...+19=?"],
    mistakes=[{"mistake":"写成19","reason":"数错出现次数","correction":"20出现20次","errorLayer":"L3"}],
    kp=["数列计数"],t=120,tags=["计数"]))
qs.append(q("cm-cg-15","fill",5,"有一个三位数，十位上的数字是百位的2倍，个位上的数字是十位的2倍。这个数可能是多少？(写出最小的那个)","124",["124"],
    solution=["设百位数字为a，则十位=2a，个位=4a。","每个数字≤9，且百位a≥1。","a=1时:百=1,十=2,个=4,数=124✓","a=2时:百=2,十=4,个=8,数=248✓","最小的数是124。"],
    hints=["设百位为a","十位=2a,个位=4a","每个数字不超过9"],
    mistakes=[{"mistake":"写成248","reason":"题目问最小的","correction":"最小是124","errorLayer":"L3"}],
    kp=["数字问题","位值原理"],t=180,tags=["数字"]))
save("counting-game","趣味数数","低年级复习",qs)

# ==== 2. addition-within-20 20以内加减法 ====
qs=[]
qs.append(q("cm-ad-01","fill",1,"5 + 3 = ?","8",["8","八"],solution=["5+3=8"],hints=["数手指:5,6,7,8"],
    mistakes=[{"mistake":"写成7","reason":"数错","correction":"5+3=8","errorLayer":"L1"}],kp=["加法"],t=30,tags=["加法"]))
qs.append(q("cm-ad-02","fill",1,"9 - 4 = ?","5",["5","五"],solution=["9-4=5"],hints=["从9倒数4个数"],
    mistakes=[{"mistake":"写成6","reason":"数错","correction":"9-4=5","errorLayer":"L1"}],kp=["减法"],t=30,tags=["减法"]))
qs.append(q("cm-ad-03","fill",1,"7 + 6 = ?","13",["13","十三"],solution=["7+6=13。凑十法:7+3=10,10+3=13"],
    hints=["7+3=10,再加3"],mistakes=[{"mistake":"写成12","reason":"凑十法算错","correction":"7+3+3=13","errorLayer":"L1"}],
    kp=["进位加法","凑十法"],t=40,tags=["凑十法"]))
qs.append(q("cm-ad-04","fill",2,"15 - 7 = ?","8",["8","八"],solution=["15-7=8。破十法:10-7=3,3+5=8"],
    hints=["10-7=3,3+5=8","想7+?=15"],mistakes=[{"mistake":"写成7","reason":"退位错误","correction":"15-7=8","errorLayer":"L2"}],
    kp=["退位减法","破十法"],t=45,tags=["退位减法"]))
qs.append(q("cm-ad-05","fill",2,"8 + 5 + 2 = ?","15",["15","十五"],solution=["8+5+2=15。先算8+2=10凑十,再加5=15"],
    hints=["先凑十:8+2=10"],mistakes=[{"mistake":"写成14","reason":"计算失误","correction":"(8+2)+5=15","errorLayer":"L2"}],
    kp=["连加","巧算"],t=45,tags=["连加"]))
qs.append(q("cm-ad-06","fill",2,"17 - 5 - 2 = ?","10",["10","十"],solution=["17-5-2=10 或 17-(5+2)=10"],
    hints=["也可以先算5+2=7","17-7=10"],mistakes=[{"mistake":"写成11","reason":"17-5算成12","correction":"17-7=10","errorLayer":"L2"}],
    kp=["连减"],t=45,tags=["连减"]))
qs.append(q("cm-ad-07","fill",2,"在□里填数：7 + □ = 13","6",["6","六"],solution=["□=13-7=6 验证:7+6=13✓"],
    hints=["13-7=?","想7加多少等于13"],mistakes=[{"mistake":"写成5","reason":"减法算错","correction":"13-7=6","errorLayer":"L2"}],
    kp=["填空","方程思想"],t=50,tags=["填空"]))
qs.append(q("cm-ad-08","fill",3,"巧算：1+2+3+4+5+6+7+8+9+10 = ?","55",["55","五十五"],
    solution=["首尾配对:1+10=11,2+9=11,...共5对","11×5=55 或 (1+10)×10÷2=55"],
    hints=["首尾配对","每对和相同","有多少对?"],
    mistakes=[{"mistake":"写成50","reason":"对数算错","correction":"5对×11=55","errorLayer":"L2"}],
    kp=["高斯求和","等差数列"],t=90,tags=["高斯求和"]))
qs.append(q("cm-ad-09","fill",3,"一本书共20页，小华第一天看了5页，第二天看了7页。还剩多少页没看？","8",["8","八"],
    solution=["20-5-7=8页 或 20-(5+7)=8页"],hints=["总-第一天-第二天"],
    mistakes=[{"mistake":"写成9","reason":"20-12算错","correction":"20-12=8","errorLayer":"L2"}],
    kp=["连减应用题"],t=60,tags=["应用题"]))
qs.append(q("cm-ad-10","fill",3,"哥哥有9颗糖，比弟弟多3颗。弟弟有几颗糖？","6",["6","六"],
    solution=["哥哥比弟弟多3颗，弟弟比哥哥少3颗。弟弟=9-3=6颗。"],
    hints=["比...多=反方向比...少","哥=弟+3,所以弟=哥-3"],
    mistakes=[{"mistake":"写成12","reason":"看到多就加","correction":"弟弟=9-3=6","errorLayer":"L2"}],
    kp=["比多比少","应用题"],t=60,tags=["比多比少"]))
qs.append(q("cm-ad-11","fill",3,"小明从家到学校要走15分钟。他要在8点到校，最晚几点几分从家出发？","7:45",["7:45","7点45","7点45分","7时45分"],
    solution=["8时-15分=7时45分。"],hints=["用到校时间减走路时间","8:00-15分钟"],
    mistakes=[{"mistake":"写成8:15","reason":"方向搞反","correction":"8:00-15分=7:45","errorLayer":"L2"}],
    kp=["时间计算"],t=70,tags=["时间"]))
qs.append(q("cm-ad-12","fill",4,"□ + △ = 12，△ - 3 = 5，问□ = ?(回答□的值)","4",["4","四"],
    solution=["从第二个式子:△-3=5,得△=8。","代入第一个:□+8=12,得□=4。"],
    hints=["先求△","△=5+3"],
    mistakes=[{"mistake":"△算成7","reason":"5-3=2再乱算","correction":"△=8,□=4","errorLayer":"L3"}],
    kp=["等量代换","方程组"],t=90,tags=["等量代换"]))
qs.append(q("cm-ad-13","fill",4,"一桶油连桶重15千克，倒出一半油后连桶重8千克。原来油重多少千克？(回答油重)","14",["14","十四"],
    solution=["倒出一半油减少了:15-8=7千克,这就是一半油的重量。","整桶油:7×2=14千克。"],
    hints=["减少的重量是一半油","15-8=7是一半油的重量"],
    mistakes=[{"mistake":"写成7","reason":"把一半当整桶","correction":"油=2×7=14千克","errorLayer":"L3"}],
    kp=["还原问题"],t=120,tags=["还原"]))
qs.append(q("cm-ad-14","fill",4,"一排小朋友从左数小明排第5，从右数小明排第6。这一排共多少人？","10",["10","十"],
    solution=["5+6-1=10人。小明被数了两次，要减1。"],
    hints=["画个图","小明被数了两次"],
    mistakes=[{"mistake":"写成11","reason":"忘了减1","correction":"5+6-1=10","errorLayer":"L2"}],
    kp=["排队问题"],t=80,tags=["排队"]))
qs.append(q("cm-ad-15","fill",5,"小明、小红、小刚三人共有糖18颗。小明给小红2颗后，小红再给小刚3颗，小刚再给小明1颗，这时三人糖数相等。问小明原来有多少颗糖？","7",["7","七"],
    solution=["最后三人相等，各有18÷3=6颗。","用倒推法求小明:最后6颗，之前他收到小刚给的1颗，所以之前是5颗。","再往前，小明曾给小红2颗，所以原来=5+2=7颗。"],
    hints=["最后每人6颗","用倒推:给出去的加回来,收到的减回去","小明:6-1+2=7"],
    mistakes=[{"mistake":"写成6","reason":"没倒推","correction":"倒推:6-1+2=7","errorLayer":"L3"}],
    kp=["还原问题","倒推法"],t=180,tags=["倒推","还原"]))
save("addition-within-20","20以内加减法","低年级核心",qs)

# ==== 3. word-problem-1st 一年级应用题 ====
qs=[]
qs.append(q("cm-wp-01","fill",1,"小明有5支铅笔，小红有3支铅笔。他们一共有多少支铅笔？",
    "8",["8","八"],solution=["5+3=8支"],hints=["一共→加法"],
    mistakes=[{"mistake":"写成2","reason":"误用减法","correction":"一共用加法,5+3=8","errorLayer":"L1"}],
    kp=["加法应用题"],t=50,tags=["一共"]))
qs.append(q("cm-wp-02","fill",1,"树上有10只鸟，飞走了4只。还剩多少只？",
    "6",["6","六"],solution=["10-4=6只"],hints=["还剩→减法"],
    mistakes=[{"mistake":"写成14","reason":"误用加法","correction":"还剩用减法,10-4=6","errorLayer":"L1"}],
    kp=["减法应用题"],t=50,tags=["还剩"]))
qs.append(q("cm-wp-03","fill",1,"妈妈买了8个苹果，爸爸又买了7个。现在一共有多少个苹果？",
    "15",["15","十五"],solution=["8+7=15个"],hints=["一共→加法"],
    mistakes=[{"mistake":"写成14","reason":"8+7算成14","correction":"8+7=15","errorLayer":"L1"}],
    kp=["加法应用题"],t=50,tags=["一共"]))
qs.append(q("cm-wp-04","fill",2,"一本书有18页，小亮已经看了9页。还剩多少页没看？",
    "9",["9","九"],solution=["18-9=9页"],hints=["总页数-看了的=没看的"],
    mistakes=[{"mistake":"写成8","reason":"18-9算错","correction":"18-9=9","errorLayer":"L2"}],
    kp=["减法应用题"],t=60,tags=["还剩"]))
qs.append(q("cm-wp-05","fill",2,"停车场有15辆车，开走了7辆，又开来了3辆。现在停车场有多少辆车？",
    "11",["11","十一"],solution=["15-7+3=11辆"],hints=["开走-开来+"],
    mistakes=[{"mistake":"写成12","reason":"15-7算成9","correction":"15-7+3=11","errorLayer":"L2"}],
    kp=["加减混合应用题"],t=60,tags=["加减混合"]))
qs.append(q("cm-wp-06","fill",2,"红花有8朵，黄花比红花多5朵。黄花有多少朵？",
    "13",["13","十三"],solution=["黄花=红花+5=8+5=13朵"],
    hints=["比...多→加"],mistakes=[{"mistake":"写成11","reason":"8+5算错","correction":"8+5=13","errorLayer":"L2"}],
    kp=["比多比少"],t=60,tags=["比多比少"]))
qs.append(q("cm-wp-07","fill",2,"哥哥有9颗糖，比弟弟多3颗。弟弟有几颗糖？",
    "6",["6","六"],solution=["哥哥比弟弟多3颗,弟弟=9-3=6颗。"],
    hints=["哥比弟多→弟比哥少","弟=哥-3"],
    mistakes=[{"mistake":"写成12","reason":"看到多就加","correction":"弟弟=9-3=6","errorLayer":"L2"}],
    kp=["比多比少"],t=60,tags=["比多比少"]))
qs.append(q("cm-wp-08","fill",3,"小军有17个玻璃球，送给小刚几个后还剩9个。他送给小刚多少个？",
    "8",["8","八"],solution=["17-9=8个"],hints=["原来-送出=剩下"],
    mistakes=[{"mistake":"写成7","reason":"17-9算错","correction":"17-9=8","errorLayer":"L2"}],
    kp=["减法应用"],t=60,tags=["还剩"]))
qs.append(q("cm-wp-09","fill",3,"一本书共20页，小华第一天看了5页，第二天看了7页。还剩多少页没看？",
    "8",["8","八"],solution=["20-5-7=8页,或20-(5+7)=8页"],
    hints=["总-第一天-第二天"],
    mistakes=[{"mistake":"写成9","reason":"20-12算错","correction":"20-12=8","errorLayer":"L2"}],
    kp=["连减应用题"],t=60,tags=["连减"]))
qs.append(q("cm-wp-10","fill",3,"有16个同学去划船，每条船坐4人。需要几条船？",
    "4",["4","四"],solution=["16÷4=4条"],
    hints=["就是求16里有几个4"],
    mistakes=[{"mistake":"写成20","reason":"误用乘法","correction":"除法,16÷4=4","errorLayer":"L2"}],
    kp=["除法应用"],t=70,tags=["除法"]))
qs.append(q("cm-wp-11","fill",3,"每本笔记本5元，小明买了8本还剩3元。他原来有多少钱？",
    "43",["43","四十三"],solution=["8本花了5×8=40元","原来有40+3=43元。"],
    hints=["先算花了多少钱"],
    mistakes=[{"mistake":"写成37","reason":"5×8算成35","correction":"5×8+3=43","errorLayer":"L2"}],
    kp=["乘加应用"],t=70,tags=["乘法应用"]))
qs.append(q("cm-wp-12","fill",4,"一排小朋友从左数小明排第5，从右数小明排第6。这一排共多少人？",
    "10",["10","十"],solution=["5+6-1=10人。小明被数了两次,要减1。"],
    hints=["画个图","小明被数了两次"],
    mistakes=[{"mistake":"写成11","reason":"忘了减1","correction":"5+6-1=10","errorLayer":"L2"}],
    kp=["排队问题"],t=80,tags=["排队"]))
qs.append(q("cm-wp-13","fill",4,"把一根绳子对折后再对折，从中间剪一刀。绳子被剪成了几段？",
    "5",["5","五"],solution=["对折两次后有4层,从中间剪一刀。","两端各1段,中间被折点相连,共5段。","公式:对折n次,从中间剪1刀→2^n+1段。2²+1=5段。"],
    hints=["拿根绳子试试或画图","对折2次后有4层"],
    mistakes=[{"mistake":"写成4","reason":"以为每层一刀","correction":"对折2次剪一刀=5段","errorLayer":"L3"}],
    kp=["剪绳子","折剪问题"],t=120,tags=["折剪"]))
qs.append(q("cm-wp-14","fill",4,"3只鸡3天下3个蛋，9只鸡9天下几个蛋？",
    "27",["27","二十七"],
    solution=["3只鸡3天→3个蛋→1只鸡3天→1个蛋→1只鸡1天→1/3个蛋。","9只鸡9天:9×9×(1/3)=27个蛋。","或:鸡数×3,天数×3,蛋数×9倍。3×9=27个。"],
    hints=["先求1只鸡1天下几个","别被绕晕了!","鸡和天数各放大3倍,蛋×9倍"],
    mistakes=[{"mistake":"写成9","reason":"简单放大3倍","correction":"鸡和天数各×3,蛋×9=27","errorLayer":"L3"}],
    kp=["归一问题"],t=100,tags=["归一"]))
qs.append(q("cm-wp-15","fill",5,"小朋友排队做早操，从前面数小红排第8，从后面数小红排第9。这一队一共多少人？如果每两人之间相隔1米，这一队从头到尾共多少米？(回答米数)","16",["16","十六"],
    solution=["人数=8+9-1=16人。","16人之间有16-1=15个间隔,每个1米,共15米。"],
    hints=["总人数=从前数+从后数-1(小红被数2次)","n人有n-1个间隔"],
    mistakes=[{"mistake":"写成16米","reason":"人数与间隔数混淆","correction":"人数16,间隔数=16-1=15米","errorLayer":"L3"}],
    kp=["排队问题","植树问题思想"],t=150,tags=["排队","植树"]))
save("word-problem-1st","一年级应用题入门","低年级复习",qs)

# ==== 4. multiplication-table-common 乘法口诀 ====
qs=[]
qs.append(q("cm-mt-01","fill",1,"6 × 7 = ?","42",["42","四十二"],solution=["六七四十二"],
    hints=["六六三十六,加6就是六七"],
    mistakes=[{"mistake":"写成48","reason":"和六八搞混","correction":"六七四十二","errorLayer":"L1"}],
    kp=["乘法口诀"],t=30,tags=["乘法"]))
qs.append(q("cm-mt-02","fill",1,"8 × 9 = ?","72",["72","七十二"],solution=["八九七十二"],
    hints=["九九八十一减9"],mistakes=[{"mistake":"写成63","reason":"七九搞混","correction":"八九七十二","errorLayer":"L1"}],
    kp=["乘法口诀"],t=30,tags=["乘法"]))
qs.append(q("cm-mt-03","fill",1,"7 × 8 = ?","56",["56","五十六"],solution=["七八五十六"],
    hints=["7×7+7=56"],mistakes=[{"mistake":"写成54","reason":"和六九搞混","correction":"七八五十六","errorLayer":"L1"}],
    kp=["乘法口诀"],t=30,tags=["乘法"]))
qs.append(q("cm-mt-04","fill",2,"□ × 8 = 56，□ = ?","7",["7","七"],solution=["七八五十六,□=7 或 56÷8=7"],
    hints=["56÷8=?","想乘法口诀"],
    mistakes=[{"mistake":"写成6","reason":"六八四十八","correction":"七八五十六,填7","errorLayer":"L2"}],
    kp=["乘法填空"],t=40,tags=["填空"]))
qs.append(q("cm-mt-05","fill",2,"9 × 9 + 9 = ?","90",["90","九十"],solution=["9×9=81,81+9=90 或 10个9相加=90"],
    hints=["9个9加1个9=10个9"],mistakes=[{"mistake":"写成89","reason":"81+9算错","correction":"81+9=90","errorLayer":"L2"}],
    kp=["乘加混合"],t=45,tags=["混合运算"]))
qs.append(q("cm-mt-06","fill",2,"36 ÷ 6 × 2 = ?","12",["12","十二"],solution=["按顺序:36÷6=6,6×2=12"],
    hints=["从左到右","先除后乘"],
    mistakes=[{"mistake":"写成3","reason":"先算6×2","correction":"从左到右,36÷6×2=12","errorLayer":"L2"}],
    kp=["乘除混合"],t=50,tags=["混合运算"]))
qs.append(q("cm-mt-07","fill",2,"巧算：25 × 8 = ?","200",["200","二百"],
    solution=["记住:25×4=100。","25×8=25×4×2=100×2=200。"],
    hints=["记住25×4=100","8=4×2"],
    mistakes=[{"mistake":"写成180","reason":"25×8算错","correction":"25×8=200","errorLayer":"L2"}],
    kp=["巧算","25×4"],t=60,tags=["巧算"]))
qs.append(q("cm-mt-08","fill",3,"一个星期有7天。5个星期有多少天？",
    "35",["35","三十五"],solution=["7×5=35天,五七三十五"],
    hints=["7×5=?"],mistakes=[{"mistake":"写成28","reason":"四七二十八","correction":"五七三十五","errorLayer":"L2"}],
    kp=["乘法应用"],t=50,tags=["乘法应用"]))
qs.append(q("cm-mt-09","fill",3,"每本笔记本5元，小明买了8本还剩3元。他原来有多少钱？",
    "43",["43","四十三"],solution=["8本花了5×8=40元。原来有40+3=43元。"],
    hints=["先算花了多少钱"],mistakes=[{"mistake":"写成37","reason":"5×8算成35","correction":"5×8+3=43","errorLayer":"L2"}],
    kp=["乘加应用"],t=70,tags=["乘法应用"]))
qs.append(q("cm-mt-10","fill",3,"在括号里最大能填几？6 × ( ) < 32","5",["5","五"],
    solution=["6×5=30<32,6×6=36>32。最大填5。"],
    hints=["试一下五六三十、六六三十六"],
    mistakes=[{"mistake":"写成6","reason":"36>32不符合","correction":"最大填5","errorLayer":"L2"}],
    kp=["不等式填空"],t=60,tags=["不等式"]))
qs.append(q("cm-mt-11","fill",3,"3只鸡3天下3个蛋，9只鸡9天下几个蛋？",
    "27",["27","二十七"],solution=["3只鸡3天→3个蛋→1只鸡1天→1/3个蛋。","9只鸡9天:9×9×(1/3)=27个蛋。"],
    hints=["先求1只鸡1天下几个","别被绕晕了!"],
    mistakes=[{"mistake":"写成9","reason":"简单放大3倍","correction":"鸡和天数各×3,蛋×9=27","errorLayer":"L3"}],
    kp=["归一问题"],t=90,tags=["归一"]))
qs.append(q("cm-mt-12","fill",4,"计算：1+2+3+4+5+6+7+8+9 = ?","45",["45","四十五"],
    solution=["配对:(1+9)+(2+8)+(3+7)+(4+6)+5=10×4+5=45。","或9×5=45(中间数5乘9个数)。"],
    hints=["首尾配对","每对和10,4对+中间5"],
    mistakes=[{"mistake":"写成50","reason":"对数算错","correction":"4×10+5=45","errorLayer":"L3"}],
    kp=["高斯求和"],t=90,tags=["高斯求和"]))
qs.append(q("cm-mt-13","fill",4,"巧算：125 × 8 = ?","1000",["1000","一千"],
    solution=["记住:125×8=1000,125×4=500。"],
    hints=["125×8=(100×8)+(25×8)=800+200=1000"],
    mistakes=[{"mistake":"写成900","reason":"计算错误","correction":"125×8=1000","errorLayer":"L3"}],
    kp=["巧算","特殊乘法"],t=70,tags=["巧算"]))
qs.append(q("cm-mt-14","fill",4,"一个两位数，十位上的数字是个位的2倍，两个数字的和是9。这个两位数是多少？",
    "63",["63"],solution=["设个位数字为x,十位=2x。","2x+x=9,3x=9,x=3。","个位=3,十位=6,数=63。"],
    hints=["设个位为x,十位=2x","两数字和=3x=9"],
    mistakes=[{"mistake":"写成36","reason":"十位个位搞反","correction":"十位=6,个位=3,所以是63","errorLayer":"L3"}],
    kp=["位值原理","数字问题"],t=120,tags=["数字"]))
qs.append(q("cm-mt-15","fill",5,"一个自然数与它自己相加、相减、相乘、相除所得的和、差、积、商加起来恰好是100。这个自然数是多少？",
    "9",["9","九"],solution=["设这个数为x。相加=2x,相减=0,相乘=x²,相除=1。","总和:x²+2x+0+1=(x+1)²=100。","x+1=10,x=9。验证:18+0+81+1=100✓"],
    hints=["设为x,列方程","相加=2x,相减=0,相乘=x²,相除=1","x²+2x+1=(x+1)²=100"],
    mistakes=[{"mistake":"写成10","reason":"100是10²,但要(x+1)²=100","correction":"x+1=10,x=9","errorLayer":"L3"}],
    kp=["方程思想","完全平方"],t=180,tags=["方程"]))
save("multiplication-table-common","乘法口诀总结","二年级总结",qs)

# ==== 5. fraction-add-sub-common 分数加减法综合 ====
qs=[]
qs.append(q("cm-fa-01","fill",1,"1/5 + 2/5 = ?","3/5",["3/5","五分之三"],
    solution=["分母相同,分子相加:(1+2)/5=3/5。"],hints=["分母相同直接加分子"],
    mistakes=[{"mistake":"写成3/10","reason":"分母也加了","correction":"分母不变,(1+2)/5=3/5","errorLayer":"L1"}],
    kp=["同分母分数加法"],t=60,tags=["同分母"]))
qs.append(q("cm-fa-02","fill",1,"7/9 - 2/9 = ?","5/9",["5/9","九分之五"],
    solution=["(7-2)/9=5/9。"],hints=["分母不变,分子相减"],
    mistakes=[{"mistake":"写成5/0","reason":"分母也减了","correction":"(7-2)/9=5/9","errorLayer":"L1"}],
    kp=["同分母分数减法"],t=60,tags=["同分母"]))
qs.append(q("cm-fa-03","fill",1,"3/7 + 4/7 = ?","1",["1","7/7"],solution=["(3+4)/7=7/7=1。"],
    hints=["分子和=分母时=1"],
    mistakes=[{"mistake":"写成7/14","reason":"分子分母都加了","correction":"(3+4)/7=1","errorLayer":"L1"}],
    kp=["分数加法","分数=1"],t=60,tags=["同分母"]))
qs.append(q("cm-fa-04","fill",2,"1/2 + 1/3 = ?","5/6",["5/6","六分之五"],
    solution=["通分:分母最小公倍数=6。1/2=3/6,1/3=2/6。3/6+2/6=5/6。"],
    hints=["先通分","2和3的最小公倍数是6"],
    mistakes=[{"mistake":"写成2/5","reason":"分子分母分别加","correction":"通分后算:3/6+2/6=5/6","errorLayer":"L2"}],
    kp=["异分母加法"],t=70,tags=["异分母"]))
qs.append(q("cm-fa-05","fill",2,"5/6 - 1/3 = ?","1/2",["1/2","二分之一","3/6"],
    solution=["通分:1/3=2/6。5/6-2/6=3/6=1/2。"],hints=["先通分","5/6-2/6=3/6=1/2"],
    mistakes=[{"mistake":"写成4/3","reason":"没通分","correction":"5/6-2/6=1/2","errorLayer":"L2"}],
    kp=["异分母减法","约分"],t=70,tags=["异分母"]))
qs.append(q("cm-fa-06","fill",2,"2 + 3/4 = ?(用带分数回答)","2 3/4",["2 3/4","2又3/4","11/4"],
    solution=["整数加真分数直接写成带分数:2+3/4=2又3/4。"],
    hints=["整数+真分数=带分数"],
    mistakes=[{"mistake":"写成5/4","reason":"2和3/4的3加了","correction":"2+3/4=2又3/4","errorLayer":"L2"}],
    kp=["整数+分数"],t=70,tags=["带分数"]))
qs.append(q("cm-fa-07","fill",2,"2 1/3 + 1 2/3 = ?","4",["4","四"],
    solution=["2又1/3+1又2/3=(2+1)+(1/3+2/3)=3+1=4。"],
    hints=["整数部分加整数部分,分数加分数","1/3+2/3=1"],
    mistakes=[{"mistake":"写成3 3/3","reason":"没化简","correction":"3 3/3=4","errorLayer":"L2"}],
    kp=["带分数加法"],t=80,tags=["带分数"]))
qs.append(q("cm-fa-08","fill",3,"3 1/4 - 1 3/4 = ?","1 1/2",["1 1/2","3/2","1又1/2"],
    solution=["分数部分1/4<3/4,从整数部分借1:3又1/4=2又5/4。","2又5/4-1又3/4=(2-1)+(5/4-3/4)=1又2/4=1又1/2。"],
    hints=["分数部分不够减要借位","3 1/4=2 5/4"],
    mistakes=[{"mistake":"写成2 2/4","reason":"没借位就直接减","correction":"借位后算=1 1/2","errorLayer":"L2"}],
    kp=["带分数减法","借位"],t=90,tags=["带分数"]))
qs.append(q("cm-fa-09","fill",3,"1/2 + 1/4 + 1/8 + 1/16 = ?","15/16",["15/16"],
    solution=["通分到16:8/16+4/16+2/16+1/16=15/16。"],
    hints=["画图:正方形一半+1/4+1/8+1/16"],
    mistakes=[{"mistake":"写成7/8","reason":"加到1/8就停了","correction":"=15/16","errorLayer":"L2"}],
    kp=["连加","分数连加"],t=100,tags=["分数连加"]))
qs.append(q("cm-fa-10","fill",3,"一堆煤，第一天用去1/3，第二天用去1/4，还剩几分之几？",
    "5/12",["5/12"],solution=["把总量看作1。剩下=1-1/3-1/4=12/12-4/12-3/12=5/12。"],
    hints=["总量是1","1-1/3-1/4"],
    mistakes=[{"mistake":"写成7/12","reason":"1-1/3算错","correction":"1-4/12-3/12=5/12","errorLayer":"L2"}],
    kp=["分数应用题"],t=100,tags=["分数应用"]))
qs.append(q("cm-fa-11","fill",3,"一项工程甲独做10天完成，乙独做15天完成。两人合做几天完成？",
    "6",["6","六"],solution=["甲每天做1/10,乙每天做1/15。","两人一天共做:1/10+1/15=3/30+2/30=5/30=1/6。","1÷1/6=6天。"],
    hints=["把总工程看作1","甲效率1/10,乙1/15","合做效率=1/10+1/15=1/6"],
    mistakes=[{"mistake":"写成12.5","reason":"取(10+15)/2","correction":"1÷(1/10+1/15)=6天","errorLayer":"L3"}],
    kp=["工程问题"],t=120,tags=["工程问题"]))
qs.append(q("cm-fa-12","fill",4,"1/6 + 1/12 + 1/20 + 1/30 + 1/42 = ?","5/14",["5/14"],
    solution=["裂项:1/6=1/(2×3)=1/2-1/3,1/12=1/(3×4)=1/3-1/4...","=(1/2-1/3)+(1/3-1/4)+(1/4-1/5)+(1/5-1/6)+(1/6-1/7)","=1/2-1/7=5/14。"],
    hints=["裂项:1/(n×(n+1))=1/n-1/(n+1)","6=2×3,12=3×4,20=4×5..."],
    mistakes=[{"mistake":"硬算出错","reason":"没发现裂项","correction":"用裂项=1/2-1/7=5/14","errorLayer":"L3"}],
    kp=["分数裂项"],t=150,tags=["裂项"]))
qs.append(q("cm-fa-13","fill",4,"一桶水，第一次倒出1/2，第二次倒出剩下的1/3，第三次倒出剩下的1/4，还剩5升。原来有多少升？",
    "20",["20","二十"],
    solution=["剩余=x×(1-1/2)×(1-1/3)×(1-1/4)=x×1/2×2/3×3/4=x/4=5。","x=20升。"],
    hints=["用倒推法或直接算剩余","x×1/2×2/3×3/4=x/4=5"],
    mistakes=[{"mistake":"写成15","reason":"计算错误","correction":"x/4=5,x=20","errorLayer":"L3"}],
    kp=["还原问题","倒推法"],t=150,tags=["分数还原"]))
qs.append(q("cm-fa-14","fill",4,"2/3 + 3/4 + 4/5 + 5/6 = ?(用最简分数或带分数)","3 1/20",["3 1/20","61/20","3又1/20"],
    solution=["通分到60:2/3=40/60,3/4=45/60,4/5=48/60,5/6=50/60。","合计=(40+45+48+50)/60=183/60=61/20=3又1/20。"],
    hints=["通分到60","2/3=40/60,3/4=45/60,..."],
    mistakes=[{"mistake":"写成3 3/60","reason":"没约分","correction":"183/60=61/20=3又1/20","errorLayer":"L3"}],
    kp=["异分母加法","通分"],t=150,tags=["通分"]))
qs.append(q("cm-fa-15","fill",5,"计算：1/2 + 5/6 + 11/12 + 19/20 + 29/30 + 41/42 + 55/56 + 71/72 = ?(用最简带分数)","7 1/9",["7 1/9","64/9","7又1/9"],
    solution=["每项=1-1/(n(n+1)):1/2=1-1/2,5/6=1-1/6,11/12=1-1/12,...","原式=8-(1/2+1/6+1/12+...+1/72)","=8-(1/(1×2)+1/(2×3)+...+1/(8×9))","=8-(1-1/2+1/2-1/3+...+1/8-1/9)=8-(1-1/9)=8-8/9=72/9-8/9=64/9=7又1/9。"],
    hints=["每项=1-1/(n(n+1))","1/2=1-1/2,5/6=1-1/6,11/12=1-1/12...","用裂项:1/1×2+1/2×3+...=1-1/9"],
    mistakes=[{"mistake":"写成7 2/9","reason":"裂项算错","correction":"8-(1-1/9)=7+1/9=7又1/9","errorLayer":"L3"}],
    kp=["分数裂项","高级运算"],t=200,tags=["裂项"]))
save("fraction-add-sub-common","分数加减法综合","五年级总结",qs)

# ==== 6. equation-intro 方程入门 ====
qs=[]
qs.append(q("cm-eq-01","fill",1,"x + 5 = 12，x = ?","7",["7","七"],
    solution=["x=12-5=7。"],hints=["两边同时减5"],
    mistakes=[{"mistake":"写成17","reason":"把5加过去了","correction":"x=12-5=7","errorLayer":"L1"}],
    kp=["一元一次方程"],t=40,tags=["方程"]))
qs.append(q("cm-eq-02","fill",1,"x - 8 = 6，x = ?","14",["14","十四"],
    solution=["x=6+8=14。"],hints=["两边同时加8"],
    mistakes=[{"mistake":"写成2","reason":"8-6=2","correction":"x=6+8=14","errorLayer":"L1"}],
    kp=["一元一次方程"],t=40,tags=["方程"]))
qs.append(q("cm-eq-03","fill",1,"4x = 20，x = ?","5",["5","五"],
    solution=["x=20÷4=5。"],hints=["两边同时除以4"],
    mistakes=[{"mistake":"写成16","reason":"20-4=16","correction":"x=20÷4=5","errorLayer":"L1"}],
    kp=["一元一次方程"],t=40,tags=["方程"]))
qs.append(q("cm-eq-04","fill",2,"2x + 5 = 15，x = ?","5",["5","五"],
    solution=["2x=15-5=10。x=10÷2=5。"],hints=["先移项:2x=15-5","再除以2"],
    mistakes=[{"mistake":"写成10","reason":"忘了除以2","correction":"2x=10,x=5","errorLayer":"L2"}],
    kp=["一元一次方程"],t=60,tags=["方程"]))
qs.append(q("cm-eq-05","fill",2,"3x - 7 = 8，x = ?","5",["5","五"],
    solution=["3x=8+7=15。x=15÷3=5。"],hints=["先移项:3x=8+7","再除以3"],
    mistakes=[{"mistake":"写成1/3","reason":"移项错误","correction":"3x=15,x=5","errorLayer":"L2"}],
    kp=["一元一次方程"],t=60,tags=["方程"]))
qs.append(q("cm-eq-06","fill",2,"5(x - 3) = 15，x = ?","6",["6","六"],
    solution=["x-3=15÷5=3。x=3+3=6。"],
    hints=["先两边除以5","或者展开:5x-15=15,5x=30,x=6"],
    mistakes=[{"mistake":"写成3","reason":"只算到x-3=3","correction":"x=3+3=6","errorLayer":"L2"}],
    kp=["一元一次方程","括号"],t=60,tags=["方程"]))
qs.append(q("cm-eq-07","fill",2,"x/4 + 3 = 7，x = ?","16",["16","十六"],
    solution=["x/4=7-3=4。x=4×4=16。"],hints=["先移项:x/4=7-3","再乘以4"],
    mistakes=[{"mistake":"写成4","reason":"忘了乘4","correction":"x/4=4,x=16","errorLayer":"L2"}],
    kp=["一元一次方程","分数"],t=70,tags=["方程"]))
qs.append(q("cm-eq-08","fill",3,"4x + 8 = 2x + 14，x = ?","3",["3","三"],
    solution=["4x-2x=14-8。2x=6。x=3。"],
    hints=["把x移到一边,数移到另一边","4x-2x=14-8"],
    mistakes=[{"mistake":"写成6","reason":"忘了除以2","correction":"2x=6,x=3","errorLayer":"L2"}],
    kp=["一元一次方程","两边都有x"],t=80,tags=["方程"]))
qs.append(q("cm-eq-09","fill",3,"一个数的3倍比它的2倍多15，这个数是多少？",
    "15",["15","十五"],solution=["设这个数为x。3x-2x=15。x=15。"],
    hints=["设这个数为x","它的3倍=3x,它的2倍=2x","3x-2x=15"],
    mistakes=[{"mistake":"写成5","reason":"3x+2x=15","correction":"3x-2x=15,x=15","errorLayer":"L2"}],
    kp=["列方程解应用题"],t=90,tags=["方程应用"]))
qs.append(q("cm-eq-10","fill",3,"小明买了5本练习本和一支2元的铅笔，一共花了17元。每本练习本多少元？",
    "3",["3","三"],solution=["设每本练习本x元。5x+2=17。5x=15,x=3元。"],
    hints=["5本练习本+1支铅笔=17元","5x+2=17"],
    mistakes=[{"mistake":"写成3.8","reason":"(17-2)/5算错","correction":"5x=15,x=3","errorLayer":"L2"}],
    kp=["列方程解应用题"],t=90,tags=["方程应用"]))
qs.append(q("cm-eq-11","fill",3,"一个两位数，十位数字是个位数字的2倍，如果把十位数字与个位数字对调，得到的新数比原数小27。求原两位数。",
    "63",["63"],solution=["设个位数字为x,则十位数字为2x。原数=10×2x+x=21x。对调后新数=10x+2x=12x。","21x-12x=27,9x=27,x=3。原数=63。验证:63-36=27✓"],
    hints=["设个位为x,十位为2x","原数=10×2x+x=21x","新数=10x+2x=12x"],
    mistakes=[{"mistake":"写成36","reason":"十位个位搞反","correction":"原数=63","errorLayer":"L3"}],
    kp=["数字问题","方程"],t=120,tags=["方程","数字"]))
qs.append(q("cm-eq-12","fill",4,"小明的储蓄罐里有1角和5角的硬币共35枚，总值11元5角。问1角硬币有多少枚？",
    "15",["15","十五"],
    solution=["设1角硬币有x枚,则5角硬币有(35-x)枚。","总值:1×x+5×(35-x)=115角。","x+175-5x=115。-4x=-60,x=15。","所以1角硬币15枚,5角硬币20枚。"],
    hints=["设1角有x枚,5角有35-x枚","列方程:x+5(35-x)=115","注意单位统一"],
    mistakes=[{"mistake":"写成20","reason":"方程列错或解错","correction":"x=15","errorLayer":"L3"}],
    kp=["鸡兔同笼","方程应用"],t=120,tags=["方程"]))
qs.append(q("cm-eq-13","fill",4,"父亲今年32岁，儿子今年8岁。多少年后父亲的年龄是儿子的3倍？",
    "4",["4","四"],
    solution=["设x年后父亲年龄是儿子的3倍。32+x=3×(8+x)。","32+x=24+3x。32-24=3x-x。8=2x,x=4。","验证:36岁和12岁,36÷12=3✓"],
    hints=["设x年后","父亲32+x,儿子8+x","(32+x)=3(8+x)"],
    mistakes=[{"mistake":"写成8","reason":"32/8=4被直接当成答案","correction":"解方程得x=4","errorLayer":"L3"}],
    kp=["年龄问题","方程"],t=120,tags=["方程","年龄"]))
qs.append(q("cm-eq-14","fill",4,"一个长方形的长是宽的2倍，周长是30厘米。求面积。(回答平方厘米数)","50",["50","五十"],
    solution=["设宽为x,长=2x。周长=2(长+宽)=2(2x+x)=6x=30。x=5厘米。","宽=5厘米,长=10厘米。面积=10×5=50平方厘米。"],
    hints=["设宽为x,长=2x","周长=2(x+2x)=6x=30","面积=长×宽"],
    mistakes=[{"mistake":"写成100","reason":"2x×2x","correction":"长=10,宽=5,面积=50","errorLayer":"L3"}],
    kp=["几何应用","方程"],t=120,tags=["方程","几何"]))
qs.append(q("cm-eq-15","fill",5,"有一些鸡和兔在同一个笼子里，从上面数有20个头，从下面数有56只脚。问鸡有多少只？","12",["12","十二"],
    solution=["设鸡有x只,兔有(20-x)只。鸡脚2x,兔脚4(20-x)。","脚总数:2x+4(20-x)=56。2x+80-4x=56。-2x=-24,x=12。","鸡12只,兔8只。验证:12×2+8×4=24+32=56✓"],
    hints=["设鸡有x只,兔=20-x","每只鸡2脚,每只兔4脚","2x+4(20-x)=56"],
    mistakes=[{"mistake":"写成8","reason":"把兔数当成鸡数","correction":"鸡=12,兔=8","errorLayer":"L3"}],
    kp=["鸡兔同笼","方程应用"],t=150,tags=["方程","鸡兔同笼"]))
save("equation-intro","方程入门","五年级总结",qs)

print("\n低年级综合6个文件生成完成!")
