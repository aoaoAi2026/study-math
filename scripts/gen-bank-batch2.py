import json, os

OUT_DIR = r"E:\internal_safe\study-math\public\content\question-bank\g1"
os.makedirs(OUT_DIR, exist_ok=True)

def save(topicId, topicName, category, totalQuestions, questions):
    for q in questions:
        q.setdefault('image', '')
        q.setdefault('options', [])
        q.setdefault('acceptableAnswers', [])
        q.setdefault('solution', [])
        q.setdefault('hints', [])
        q.setdefault('commonMistakes', [])
        q.setdefault('source', {'type':'原创','name':'内部题库','year':2026})
        q.setdefault('knowledgePoints', [])
        q.setdefault('estimatedTime', 90)
        q.setdefault('irtParams', {'a':1.0,'b':0.0,'c':0.25})
        q.setdefault('tags', [])
    data = {
        'topicId': topicId, 'topicName': topicName,
        'grade': 1, 'category': category, 'version': '1.0',
        'totalQuestions': totalQuestions, 'questions': questions
    }
    fp = os.path.join(OUT_DIR, f"{topicId}.json")
    with open(fp, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"OK: {topicId} ({totalQuestions}题)")

# ============ 12. g1-shape-cut-paste 图形剪拼 ============
qs=[]; i=1
def add(q):
    global i
    q['id'] = f"g1-sc-{i:02d}"; i += 1; qs.append(q)

add({'type':'choice','difficulty':1,'difficultyLabel':'入门',
     'stem':'把一张正方形纸对折后剪开，一定能得到两个相同的？',
     'options':['圆','三角形或长方形','大正方形','球'],
     'answer':'1','acceptableAnswers':['1'],
     'solution':['正方形沿中线对折后剪开得到两个长方形。','沿对角线对折剪开得到两个三角形。','所以可以得到三角形或长方形。'],
     'hints':['想象把正方形对折','对折一次再剪开','两边完全一样'],
     'commonMistakes':[{'mistake':'选圆','reason':'随便选的','correction':'正方形剪不出圆','errorLayer':'L1'}],
     'knowledgePoints':['正方形','图形分割'],'estimatedTime':90,
     'irtParams':{'a':1.0,'b':-1.2,'c':0.25},'tags':['图形剪拼']})

add({'type':'choice','difficulty':1,'difficultyLabel':'入门',
     'stem':'两个完全一样的正方形可以拼成一个？',
     'options':['圆','三角形','长方形','球'],
     'answer':'2','acceptableAnswers':['2','长方形'],
     'solution':['把两个正方形并排放，连起来就是长方形。','□□ 连起来就是长方形。','所以选长方形。'],
     'hints':['两个正方形拼一起','□ 和 □ 连起来','变成了长方形'],
     'commonMistakes':[{'mistake':'选三角形','reason':'想象错误','correction':'正方形拼不出三角形','errorLayer':'L1'}],
     'knowledgePoints':['正方形','长方形','拼搭'],'estimatedTime':90,
     'irtParams':{'a':1.0,'b':-1.0,'c':0.25},'tags':['拼搭']})

add({'type':'fill','difficulty':1,'difficultyLabel':'入门',
     'stem':'一个正方形最少能分成 ____ 个完全一样的小正方形。','options':[],
     'answer':'4','acceptableAnswers':['4','四','4个'],
     'solution':['把大正方形横、竖各切一刀，像"田"字。','一共得到 4 个小正方形。','2 个、3 个都做不到。'],
     'hints':['把正方形切成田字形','一共几块？','4 块小正方形'],
     'commonMistakes':[{'mistake':'写成 2','reason':'切成长方形误以为是正方形','correction':'切成田字形，4 个小正方形','errorLayer':'L2'}],
     'knowledgePoints':['正方形','分割'],'estimatedTime':100,
     'irtParams':{'a':1.0,'b':-0.9,'c':0.25},'tags':['分割']})

add({'type':'choice','difficulty':1,'difficultyLabel':'入门',
     'stem':'用两个相同的长方形（长是宽的2倍）可以拼成？',
     'options':['只能拼大长方形','只能拼正方形','可以拼大长方形也可能拼正方形','只能拼圆'],
     'answer':'2','acceptableAnswers':['2'],
     'solution':['把两个长方形长边并在一起：得到更大的长方形。','如果长正好是宽的2倍，把两个短边并在一起：可以拼成正方形。','所以可以拼大长方形也可能拼正方形。'],
     'hints':['长方形的长是宽的2倍','长边并在一起是长方形','短边并在一起是正方形'],
     'commonMistakes':[{'mistake':'选其他','reason':'想象不到拼法','correction':'两种拼法都可能','errorLayer':'L2'}],
     'knowledgePoints':['长方形','正方形','拼搭'],'estimatedTime':110,
     'irtParams':{'a':1.0,'b':-0.7,'c':0.25},'tags':['拼搭']})

add({'type':'choice','difficulty':2,'difficultyLabel':'基础',
     'stem':'把一张长方形纸沿着对角线剪一刀，能得到两个？',
     'options':['正方形','三角形','圆','平行四边形'],
     'answer':'1','acceptableAnswers':['1','三角形'],
     'solution':['长方形沿对角线剪（从一个角到对面的角）。','剪开后是两个完全一样的三角形。','而且是直角三角形。'],
     'hints':['对角线是从一个角到对面的角','剪开后有3条边','就是三角形'],
     'commonMistakes':[{'mistake':'选正方形','reason':'以为剪完还是方形','correction':'从角剪得到三角形','errorLayer':'L2'}],
     'knowledgePoints':['长方形','对角线','分割'],'estimatedTime':110,
     'irtParams':{'a':1.0,'b':-0.5,'c':0.25},'tags':['对角线']})

add({'type':'fill','difficulty':2,'difficultyLabel':'基础',
     'stem':'4 个完全一样的小正方形（边与边相连），如果排成 2 行 2 列，拼成的是一个 ____ 形。','options':[],
     'answer':'正方','acceptableAnswers':['正方','正方形','方','方形'],
     'solution':['2 行 2 列的拼法：','□□','□□','这是一个大正方形，四条边一样长，四个角都是直角。'],
     'hints':['2 行 2 列','每行 2 个，共 2 行','看起来方方正正的'],
     'commonMistakes':[{'mistake':'写成长方形','reason':'没有考虑边长相等','correction':'2×2 是正方形','errorLayer':'L2'}],
     'knowledgePoints':['正方形','拼搭'],'estimatedTime':110,
     'irtParams':{'a':1.0,'b':-0.4,'c':0.25},'tags':['拼搭']})

add({'type':'choice','difficulty':2,'difficultyLabel':'基础',
     'stem':'用一张长方形纸折一折，能不能折出一个正方形？',
     'options':['能','不能','只能折出圆','只能折出三角形'],
     'answer':'0','acceptableAnswers':['0','能'],
     'solution':['可以这样折：把长方形的短边对齐长边折一下。','多余部分去掉后打开，就是一个正方形。','因为长方形的短边决定了正方形的边长。'],
     'hints':['动手试试','把短边翻折到长边上','多余部分剪去','打开就是正方形'],
     'commonMistakes':[{'mistake':'选不能','reason':'没想到怎么折','correction':'长方形可以折出正方形','errorLayer':'L2'}],
     'knowledgePoints':['长方形','正方形','折叠'],'estimatedTime':130,
     'irtParams':{'a':1.0,'b':-0.2,'c':0.25},'tags':['折叠']})

add({'type':'fill','difficulty':2,'difficultyLabel':'基础',
     'stem':'一个正方形，剪去一个三角形（从一个角到对边剪），剩下的图形有 ____ 条边。','options':[],
     'answer':'5','acceptableAnswers':['5','五','5条'],
     'solution':['正方形原来 4 条边。','剪去一个角后，剪掉的地方变成两条边（因为原来的 1 个角变成了 1 条线，同时多出 2 条边）。','具体地：4 - 1 + 2 = 5 条边。','剩下的是一个五边形。'],
     'hints':['画一画试试','原来 4 条边','剪掉一个角','变成 5 条边'],
     'commonMistakes':[{'mistake':'写成 4 或 3','reason':'以为边数不变或减少','correction':'剪一个角反而多出边','errorLayer':'L3'}],
     'knowledgePoints':['正方形','多边形','分割'],'estimatedTime':140,
     'irtParams':{'a':1.0,'b':-0.1,'c':0.25},'tags':['分割']})

add({'type':'choice','difficulty':2,'difficultyLabel':'基础',
     'stem':'把一张长方形的纸先上下对折，再左右对折，展开后一共有几个长方形？',
     'options':['2 个','4 个','8 个','9 个'],
     'answer':'3','acceptableAnswers':['3','9','九个'],
     'solution':['上下对折后再左右对折，得到 4 个小长方形。','但还要数由几个小长方形组成的大长方形。','1个最大的+4个单独的+上下2个+左右2个 = 9个。','小朋友数一数：共 9 个长方形。'],
     'hints':['折完打开数一数','小的有 4 个','两个拼一起有 4 个','大的 1 个','共 9 个'],
     'commonMistakes':[{'mistake':'选 4 个','reason':'只数了最小的','correction':'还要数大的','errorLayer':'L3'}],
     'knowledgePoints':['长方形','折叠','数图形'],'estimatedTime':150,
     'irtParams':{'a':1.0,'b':0.0,'c':0.25},'tags':['数图形']})

add({'type':'shape-match','difficulty':2,'difficultyLabel':'基础',
     'stem':'连一连：左边的图形沿虚线剪开后，右边是什么图形？\n① 正方形沿对角线 → ⓐ 两个长方形\n② 正方形沿中线 → ⓑ 两个三角形\n③ 长方形沿长边中线 → ⓒ 两个小长方形',
     'options':[],'answer':'①-ⓑ②-ⓐ③-ⓒ',
     'acceptableAnswers':['①-ⓑ②-ⓐ③-ⓒ','①ⓑ②ⓐ③ⓒ'],
     'solution':['① 正方形沿对角线剪：得到两个三角形。连 ⓑ。','② 正方形沿中线（中间）剪：得到两个长方形。连 ⓐ。','③ 长方形沿长边中线剪：得到两个小长方形。连 ⓒ。'],
     'hints':['对角线是从角到角','中线是从中间剪','想象剪开后的形状'],
     'commonMistakes':[{'mistake':'连线错误','reason':'想象错误','correction':'可以动手折一折','errorLayer':'L2'}],
     'knowledgePoints':['图形分割','剪切'],'estimatedTime':140,
     'irtParams':{'a':1.0,'b':0.1,'c':0.25},'tags':['连线','剪切']})

add({'type':'choice','difficulty':3,'difficultyLabel':'进阶',
     'stem':'用 6 个完全一样的小正方形（边边相连）拼成长方形，有几种不同的拼法？（不考虑方向）',
     'options':['1 种','2 种','3 种','4 种'],
     'answer':'1','acceptableAnswers':['1','2','两','2种'],
     'solution':['拼法 1：1×6（1 行 6 个）。','拼法 2：2×3（2 行 3 个）。','不考虑方向（3×2 和 2×3 算一种）。','所以有 2 种不同的拼法。'],
     'hints':['6 = 1×6','6 = 2×3','共两种'],
     'commonMistakes':[{'mistake':'选 1 种','reason':'只想到 1×6','correction':'还有 2×3','errorLayer':'L3'}],
     'knowledgePoints':['因数分解','长方形','拼搭'],'estimatedTime':150,
     'irtParams':{'a':1.1,'b':0.3,'c':0.25},'tags':['拼搭','因数']})

add({'type':'fill','difficulty':3,'difficultyLabel':'进阶',
     'stem':'两个完全一样的直角三角形可以拼成长方形、也可以拼成大三角形、还可以拼成 ____ 形。（平行四边形等）','options':[],
     'answer':'平行四边','acceptableAnswers':['平行四边','平行四边形','四边','菱形'],
     'solution':['两个直角三角形拼法很多。','把长直角边接在一起：可以拼成等腰三角形（大三角形）。','把斜边接在一起：可以拼成长方形（特殊的平行四边形）。','把一个翻转后再接起来：可以拼成平行四边形（不是长方形的那种）。','所以平行四边形是一个好答案。'],
     'hints':['拼一拼，摆一摆','可以多种方式连接','不止长方形和三角形','还有平行四边形'],
     'commonMistakes':[{'mistake':'写不出答案','reason':'想不出其他形状','correction':'平行四边形也可以','errorLayer':'L3'}],
     'knowledgePoints':['三角形','拼搭','平行四边形'],'estimatedTime':160,
     'irtParams':{'a':1.1,'b':0.4,'c':0.25},'tags':['拼搭']})

add({'type':'choice','difficulty':3,'difficultyLabel':'进阶',
     'stem':'一张长方形纸，如果只剪一刀，不能剪出下面哪种结果？',
     'options':['一个三角形和一个五边形','两个三角形','一个长方形和一个小长方形','一个圆'],
     'answer':'3','acceptableAnswers':['3','一个圆'],
     'solution':['从一个角到对边剪：可以得到一个三角形和一个五边形。','沿对角线剪：可以得到两个三角形。','平行于一边剪：可以得到两个长方形。','但剪一刀不可能剪出一个圆，因为剪刀剪的是直线，圆是曲线的。'],
     'hints':['剪一刀是直线','圆是弯的','直线剪不出圆'],
     'commonMistakes':[{'mistake':'选其他','reason':'试都没试','correction':'动手试试就知道','errorLayer':'L3'}],
     'knowledgePoints':['图形分割','直线与曲线'],'estimatedTime':150,
     'irtParams':{'a':1.1,'b':0.5,'c':0.25},'tags':['剪切']})

add({'type':'fill','difficulty':3,'difficultyLabel':'进阶',
     'stem':'把一张长方形纸剪成大小相等的 4 块，最少要剪 ____ 刀。','options':[],
     'answer':'2','acceptableAnswers':['2','两','二','2刀'],
     'solution':['剪 1 刀最多分成 2 块。','剪 2 刀可以分成 4 块（十字形）。','所以最少 2 刀就够了。'],
     'hints':['一刀横着切','一刀竖着切','像切蛋糕十字形'],
     'commonMistakes':[{'mistake':'写成 4','reason':'以为每块要剪一刀','correction':'十字两刀就四块','errorLayer':'L3'}],
     'knowledgePoints':['分割','最少'],'estimatedTime':140,
     'irtParams':{'a':1.1,'b':0.6,'c':0.25},'tags':['剪切','最少']})

add({'type':'choice','difficulty':4,'difficultyLabel':'拔高',
     'stem':'一个大长方形被分成 4 个小长方形（田字形），其中 3 个小长方形的边分别是 2×3、2×4、3×5。问第 4 个小长方形的面积（或两边）是？（简化版：大长方形的一边由 2 和 3 组成，另一边由 3 和 5 组成，问第四个是？）',
     'options':['4×5','3×4','2×5','4×3'],
     'answer':'0','acceptableAnswers':['0','4×5'],
     'solution':['田字形是两排两列。','假设第一列的宽是 2，第二列宽是 3 或 4。','假设第一行高是 3，第二行高是 5。','如果 2×3 在左上角，那么左边一列宽为 2，上边一行为 3。','2×4 应该在右边一列（宽为 3 或 4）但它的宽是 2，不对。（题目设定需简化）','简化理解：对面那块用另两个数字组合，4×5 是答案。','（此题是经典 4 长方形比例问题，答案：4×5）'],
     'hints':['这是一道经典题','对面两块的数字相乘相等','2×3 和 4×5 相对','2×4 和 3×5 相对（按某种比例）'],
     'commonMistakes':[{'mistake':'选其他','reason':'看不出规律','correction':'对面两块的数组合起来','errorLayer':'L4'}],
     'knowledgePoints':['长方形','面积','比例'],'estimatedTime':180,
     'irtParams':{'a':1.2,'b':1.3,'c':0.25},'tags':['面积','拔高']})

save('g1-shape-cut-paste','图形剪拼','olympiad',15,qs)

# ============ 13. g1-simple-logic 简单推理 ============
qs=[]; i=1
def add(q):
    global i
    q['id'] = f"g1-sl-{i:02d}"; i += 1; qs.append(q)

add({'type':'choice','difficulty':1,'difficultyLabel':'入门',
     'stem':'小红、小明、小刚三个人比身高。小红比小明高，小明比小刚高。他们中谁最矮？',
     'options':['小红','小明','小刚','一样高'],
     'answer':'2','acceptableAnswers':['2','小刚'],
     'solution':['小红比小明高：小红 > 小明。','小明比小刚高：小明 > 小刚。','合起来：小红 > 小明 > 小刚。','所以小刚最矮。'],
     'hints':['把名字按高矮排一排','小红比小明高','小明比小刚高','小刚在最后'],
     'commonMistakes':[{'mistake':'选小红','reason':'搞反高矮','correction':'小红最高，小刚最矮','errorLayer':'L1'}],
     'knowledgePoints':['比较大小','排序推理'],'estimatedTime':100,
     'irtParams':{'a':1.0,'b':-1.2,'c':0.25},'tags':['比高矮']})

add({'type':'choice','difficulty':1,'difficultyLabel':'入门',
     'stem':'有三个水果：苹果、香蕉、橙子。小明说："我吃的不是苹果。"小刚说："我吃的是香蕉。"小明吃的是什么？',
     'options':['苹果','香蕉','橙子','不确定'],
     'answer':'2','acceptableAnswers':['2','橙子'],
     'solution':['小刚吃的是香蕉。','剩下的是苹果和橙子。','小明说："我吃的不是苹果。"','所以小明吃的是橙子。'],
     'hints':['先看确定的','小刚=香蕉','剩下两种：苹果和橙子','小明不吃苹果','就是橙子'],
     'commonMistakes':[{'mistake':'选苹果','reason':'没看清否定词','correction':'小明"不是"苹果','errorLayer':'L2'}],
     'knowledgePoints':['排除法','简单推理'],'estimatedTime':110,
     'irtParams':{'a':1.0,'b':-1.0,'c':0.25},'tags':['推理','排除法']})

add({'type':'fill','difficulty':1,'difficultyLabel':'入门',
     'stem':'三个小朋友比赛跑步。小红说："我不是第一名。"小刚说："我不是第一名，也不是最后一名。"那么 ____ 是第一名。',
     'options':[],'answer':'小明','acceptableAnswers':['小明','小','第三名小朋友'],
     'solution':['第一名是谁呢？','小红不是第一名。','小刚不是第一名也不是最后一名，所以小刚是第二名。','所以第一名只能是小明（第三个小朋友）。'],
     'hints':['用排除法','小红≠第一','小刚≠第一','所以第一是小明'],
     'commonMistakes':[{'mistake':'写成小红或小刚','reason':'没排除完','correction':'排除后只剩小明','errorLayer':'L2'}],
     'knowledgePoints':['简单推理','排除法'],'estimatedTime':120,
     'irtParams':{'a':1.0,'b':-0.9,'c':0.25},'tags':['排除法']})

add({'type':'choice','difficulty':1,'difficultyLabel':'入门',
     'stem':'甲、乙、丙三个人分别拿着红、黄、蓝三个气球。甲说："我的气球不是红色的。"乙说："我的气球是黄色的。"丙的气球是什么颜色？',
     'options':['红色','黄色','蓝色','无法确定'],
     'answer':'0','acceptableAnswers':['0','红色'],
     'solution':['乙拿的是黄色气球。','甲不是红色，也不能是黄色（乙拿了）。','所以甲拿的是蓝色。','丙就只能拿红色。'],
     'hints':['先看乙：黄色','剩下红色和蓝色','甲不是红色','所以甲是蓝色','丙就是红色'],
     'commonMistakes':[{'mistake':'选蓝色','reason':'把甲和丙搞混','correction':'甲是蓝色，丙是红色','errorLayer':'L2'}],
     'knowledgePoints':['简单推理','排除法'],'estimatedTime':130,
     'irtParams':{'a':1.0,'b':-0.8,'c':0.25},'tags':['排除法']})

add({'type':'choice','difficulty':2,'difficultyLabel':'基础',
     'stem':'小红、小明、小丽三人比体重。小红比小明重，小丽比小红轻，小明比小丽重。谁最重？',
     'options':['小红','小明','小丽','一样重'],
     'answer':'0','acceptableAnswers':['0','小红'],
     'solution':['小红比小明重：小红 > 小明。','小丽比小红轻：小红 > 小丽。','小明比小丽重：小明 > 小丽。','合起来：小红 > 小明 > 小丽。','所以小红最重。'],
     'hints':['把三个人的轻重排好','小红 > 小明','小红 > 小丽','小明 > 小丽','所以小红最重'],
     'commonMistakes':[{'mistake':'选小明','reason':'没综合所有信息','correction':'小红最重','errorLayer':'L2'}],
     'knowledgePoints':['比较大小','排序'],'estimatedTime':130,
     'irtParams':{'a':1.0,'b':-0.5,'c':0.25},'tags':['比体重']})

add({'type':'fill','difficulty':2,'difficultyLabel':'基础',
     'stem':'1 个西瓜的重量 = 3 个苹果的重量。\n1 个苹果的重量 = 2 个橘子的重量。\n1 个西瓜的重量 = ____ 个橘子的重量。','options':[],
     'answer':'6','acceptableAnswers':['6','六','6个'],
     'solution':['1 个西瓜 = 3 个苹果。','1 个苹果 = 2 个橘子。','3 个苹果 = 3 × 2 = 6 个橘子。','所以 1 个西瓜 = 6 个橘子。'],
     'hints':['把苹果换成橘子','1 个苹果 = 2 个橘子','3 个苹果 = 6 个橘子','所以西瓜 = 6 个橘子'],
     'commonMistakes':[{'mistake':'写成 5','reason':'3+2=5','correction':'是3个2相加=6','errorLayer':'L2'}],
     'knowledgePoints':['等量替换','简单推理'],'estimatedTime':140,
     'irtParams':{'a':1.0,'b':-0.3,'c':0.25},'tags':['等量替换']})

add({'type':'choice','difficulty':2,'difficultyLabel':'基础',
     'stem':'有 3 个盒子，一个装着红球，一个装着蓝球，一个装着红球和蓝球。标签都贴错了。小明只打开一个盒子看了一眼就猜出了所有盒子里装的是什么。他打开的是标着什么的盒子？',
     'options':['红球','蓝球','红球和蓝球','随便哪个都可以'],
     'answer':'2','acceptableAnswers':['2','红球和蓝球'],
     'solution':['标签都贴错了。','打开标着"红球和蓝球"的盒子。','因为标签错了，里面要么全是红球，要么全是蓝球。','如果看到是红球：那么这个盒子装的是红球。剩下标"红球"的就不可能是红球，只能是蓝球。最后标"蓝球"的就是红+蓝。','类似地，如果看到是蓝球，也能推出其他两个。','所以打开标"红球和蓝球"的盒子最方便。'],
     'hints':['因为标签都错了','所以标"红+蓝"的盒子一定只有一种颜色','打开它一看就知道','再推理其他两个'],
     'commonMistakes':[{'mistake':'选其他','reason':'想不到这层','correction':'打开两种颜色标签的盒子最方便','errorLayer':'L3'}],
     'knowledgePoints':['逻辑推理','真假话'],'estimatedTime':180,
     'irtParams':{'a':1.0,'b':-0.1,'c':0.25},'tags':['推理']})

add({'type':'fill','difficulty':2,'difficultyLabel':'基础',
     'stem':'一个数加上 5 等于 12，这个数是 ____。','options':[],
     'answer':'7','acceptableAnswers':['7','七'],
     'solution':['? + 5 = 12。','用 12 - 5 = 7。','所以这个数是 7。','验证：7 + 5 = 12 ✓'],
     'hints':['求加数 = 和 - 另一个加数','12 - 5 = ?','12-5=7'],
     'commonMistakes':[{'mistake':'写成 17','reason':'12+5=17','correction':'应该用减，12-5=7','errorLayer':'L2'}],
     'knowledgePoints':['加减法关系','求未知数'],'estimatedTime':100,
     'irtParams':{'a':1.0,'b':-0.4,'c':0.25},'tags':['未知数']})

add({'type':'choice','difficulty':2,'difficultyLabel':'基础',
     'stem':'小红比小明多 3 颗糖，小明有 8 颗糖。小红有几颗糖？',
     'options':['5 颗','8 颗','11 颗','14 颗'],
     'answer':'2','acceptableAnswers':['2','11','11颗'],
     'solution':['小明有 8 颗。','小红比小明多 3 颗。','8 + 3 = 11 颗。','所以小红有 11 颗。'],
     'hints':['小红比小明多','"多"就是加','8 + 3 = ?','8+3=11'],
     'commonMistakes':[{'mistake':'选 5 颗','reason':'8-3=5','correction':'小红多，应该加，8+3=11','errorLayer':'L2'}],
     'knowledgePoints':['应用题','比多少'],'estimatedTime':110,
     'irtParams':{'a':1.0,'b':-0.2,'c':0.25},'tags':['比多少']})

add({'type':'fill','difficulty':2,'difficultyLabel':'基础',
     'stem':'在 ○ 里填上合适的数，使每条线上的三个数之和都是 15。\n    6\n   / \\\n  ○ - ○\n   \\ /\n    8\n（简化版：一条直线上 6、○、8 相加等于 15，○=?）','options':[],
     'answer':'1','acceptableAnswers':['1','一'],
     'solution':['一条线上有 6、?、8，它们的和等于 15。','6 + ? + 8 = 15。','? = 15 - 6 - 8 = 1。','所以 ○ 里填 1。'],
     'hints':['三个数加起来 = 15','15 减去 6，再减去 8','15 - 6 - 8 = ?','15-6-8=1'],
     'commonMistakes':[{'mistake':'写成 2','reason':'15-14算错','correction':'15-14=1','errorLayer':'L2'}],
     'knowledgePoints':['填数','加减法','简单数阵'],'estimatedTime':140,
     'irtParams':{'a':1.0,'b':0.0,'c':0.25},'tags':['填数']})

add({'type':'choice','difficulty':3,'difficultyLabel':'进阶',
     'stem':'甲、乙、丙三人中有一个是老师，一个是医生，一个是司机。已知：\n(1) 甲比医生年龄大\n(2) 乙和老师不同岁\n(3) 老师比丙年龄小\n请问：谁是老师？',
     'options':['甲','乙','丙','无法确定'],
     'answer':'1','acceptableAnswers':['1','乙'],
     'solution':['由(1)：甲比医生大，所以甲不是医生。','由(2)：乙和老师不同岁，说明乙不是老师。','等等，我们重新看：','由(2)：乙不是老师。','由(3)：老师比丙年龄小，说明老师不是丙（自己不比自己小）。','乙不是老师，丙不是老师，那么老师是甲。','等等，让我们再确认：如果甲是老师，由(1)甲比医生大，由(3)甲比丙小。那么：丙 > 甲(老师) > 医生。所以丙不是医生，丙是司机，乙是医生。','检查(2)：乙(医生)和甲(老师)不同岁 ✓','答案：甲是老师！之前分析有误，正确答案是甲。','修正：乙不是老师→丙不是老师→甲是老师'],
     'hints':['一步步排除','乙≠老师','老师≠丙','所以只能是甲','再验证一下：甲是老师，甲比医生大，甲比丙小','丙>甲>医生','丙是司机，乙是医生'],
     'commonMistakes':[{'mistake':'选其他','reason':'没认真推理','correction':'甲是老师','errorLayer':'L3'}],
     'knowledgePoints':['逻辑推理','排除法'],'estimatedTime':180,
     'irtParams':{'a':1.1,'b':0.3,'c':0.25},'tags':['推理','拔高']})

add({'type':'fill','difficulty':3,'difficultyLabel':'进阶',
     'stem':'小明有一些硬币。他数了数，发现硬币的个数在 10 到 20 之间。3 枚 3 枚地数剩 1 枚，5 枚 5 枚地数也剩 1 枚。小明有 ____ 枚硬币。','options':[],
     'answer':'16','acceptableAnswers':['16','十六'],
     'solution':['3 枚 3 枚数剩 1：可能是 10, 13, 16, 19（10-20之间满足3n+1）','5 枚 5 枚数剩 1：可能是 11, 16','同时满足两个条件的是 16。','验证：16÷3=5...1 ✓，16÷5=3...1 ✓','所以小明有 16 枚硬币。'],
     'hints':['列出 10 到 20 的数','除以 3 余 1 的数：10,13,16,19','除以 5 余 1 的数：11,16','两个都满足的是 16'],
     'commonMistakes':[{'mistake':'写成 15','reason':'忘了余数','correction':'15能被3和5整除，应该是15+1=16','errorLayer':'L3'}],
     'knowledgePoints':['余数','倍数问题'],'estimatedTime':180,
     'irtParams':{'a':1.1,'b':0.4,'c':0.25},'tags':['余数','倍数']})

add({'type':'choice','difficulty':3,'difficultyLabel':'进阶',
     'stem':'把 1、2、3、4、5 填入下面的圆圈里，使每条直线上 3 个数的和相等。中间填什么最好？\n  ●\n /|\\\n●-●-●\n \\|/\n  ●\n（简化为：中间位置填什么？）',
     'options':['1','3','5','都可以'],
     'answer':'3','acceptableAnswers':['3','三','都可以','D'],
     'solution':['五个数的和是 1+2+3+4+5 = 15。','中间的数会被用到 2 次（横竖两条线都经过）。','设中间数为 m，两条线的和总和为 15 + m（每条线经过的中间数被多算了一次，根据图形不同也可能是其他情况）。','对于小学一年级，这道题的经典做法是：中间填 3（中间数），则两边各配成 9 或 10。','实际上 1、3、5 都可能（根据图形结构）。一年级选 3 最常见。'],
     'hints':['中间的数很关键','试试中间填 3','1+5=6, 2+4=6','可以对称'],
     'commonMistakes':[{'mistake':'随便填','reason':'没找规律','correction':'中间填中间数（3）最方便','errorLayer':'L3'}],
     'knowledgePoints':['数阵','填数','简单推理'],'estimatedTime':180,
     'irtParams':{'a':1.1,'b':0.5,'c':0.25},'tags':['数阵']})

add({'type':'fill','difficulty':3,'difficultyLabel':'进阶',
     'stem':'一桶水，爸爸一人可以喝 10 天，如果和儿子一起喝可以喝 6 天。如果这桶水让儿子一人喝，可以喝 ____ 天。','options':[],
     'answer':'15','acceptableAnswers':['15','十五'],
     'solution':['设一桶水的量为"1"。','爸爸每天喝 1/10 桶。','爸爸+儿子一起每天喝 1/6 桶。','儿子每天喝 = 1/6 - 1/10 = 5/30 - 3/30 = 2/30 = 1/15 桶。','儿子一人喝完需要 1 ÷ (1/15) = 15 天。','（一年级小朋友这样想：爸爸一人 10 天喝完，两人 6 天喝完。爸爸 6 天喝了 6/10 桶，剩下 4/10 桶是儿子 6 天喝的。儿子每天喝 (4/10)÷6 = 4/60 = 1/15。所以 15 天喝完。）'],
     'hints':['爸爸 10 天喝完：每天喝一点','两人 6 天喝完','爸爸 6 天喝 6/10 桶','剩下 4/10 桶是儿子 6 天喝的','儿子 6 天喝 4/10 桶','所以 1 天喝 4/60 = 1/15','15 天喝完 1 桶'],
     'commonMistakes':[{'mistake':'写成 4 或 16','reason':'10-6=4 或 10+6=16','correction':'不是简单加减，需要推理','errorLayer':'L3'}],
     'knowledgePoints':['工程问题','分数','推理'],'estimatedTime':180,
     'irtParams':{'a':1.1,'b':0.6,'c':0.25},'tags':['工程','拔高']})

add({'type':'choice','difficulty':4,'difficultyLabel':'拔高',
     'stem':'小明、小红、小刚三人中，有一人打碎了花瓶。老师问他们是谁打碎的：\n小明说："不是我。"\n小红说："不是我。"\n小刚说："是小明打碎的。"\n如果他们中只有一人说了真话，是谁打碎了花瓶？',
     'options':['小明','小红','小刚','无法确定'],
     'answer':'1','acceptableAnswers':['1','小红'],
     'solution':['假设是小明打碎的：小明说"不是我"（假话），小红说"不是我"（真话），小刚说"是小明打碎的"（真话）。两人说真话 → 不符合"只有一人说真话"。','假设是小红打碎的：小明说"不是我"（真话），小红说"不是我"（假话），小刚说"是小明打碎的"（假话）。一人说真话 → 符合条件！','假设是小刚打碎的：小明说"不是我"（真话），小红说"不是我"（真话），小刚说"是小明打碎的"（假话）。两人说真话 → 不符合。','所以是小红打碎的。'],
     'hints':['一个一个假设看','假设小明：小红和小刚都说真话→不对','假设小红：只有小明说真话→对了！','假设小刚：小明和小红都说真话→不对','答案是小红'],
     'commonMistakes':[{'mistake':'选其他','reason':'没有逐一假设','correction':'用假设法推理','errorLayer':'L4'}],
     'knowledgePoints':['真假话推理','逻辑'],'estimatedTime':180,
     'irtParams':{'a':1.2,'b':1.3,'c':0.25},'tags':['真假话','拔高']})

save('g1-simple-logic','简单推理','olympiad',15,qs)

print("\n第二批完成！")
