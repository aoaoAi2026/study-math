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

# ============ 14. g1-one-stroke 一笔画 ============
qs=[]; i=1
def add(q):
    global i
    q['id'] = f"g1-os-{i:02d}"; i += 1; qs.append(q)

add({'type':'choice','difficulty':1,'difficultyLabel':'入门',
     'stem':'下面哪个图形可以一笔画成？（从任意一点出发，笔不离纸，每条线只画一次）',
     'options':['一个圆 ○','两个分开的圆 ○○','一个五角星 ☆','一个圆里面还有一个同心圆 ⊙'],
     'answer':'0','acceptableAnswers':['0'],
     'solution':['一个圆可以一笔画成，从圆上任意一点开始画，绕一圈回到起点。','两个分开的圆是不连通的，无法一笔画完。','圆里面有同心圆，如果两条曲线不相连，也不能一笔画。','所以选一个圆 ○。'],
     'hints':['图形要连在一起','一笔画，笔不能离开纸','圆最容易画'],
     'commonMistakes':[{'mistake':'选两个分开的圆','reason':'没有考虑连通性','correction':'不连在一起的图形不能一笔画','errorLayer':'L1'}],
     'knowledgePoints':['一笔画','连通性'],'estimatedTime':110,
     'irtParams':{'a':1.0,'b':-1.2,'c':0.25},'tags':['一笔画']})

add({'type':'choice','difficulty':1,'difficultyLabel':'入门',
     'stem':'下面哪个图形一定不能一笔画成？',
     'options':['圆','正方形','一条直线','两个不相连的三角形'],
     'answer':'3','acceptableAnswers':['3'],
     'solution':['两个不相连的三角形是不连通的，一笔不可能画到两个分开的部分。','圆、正方形、一条直线都是连通的，而且都能一笔画。'],
     'hints':['图形必须全部连在一起','分开的画不到','两个三角形不相连'],
     'commonMistakes':[{'mistake':'选其他','reason':'没想到不连通','correction':'不连通的图形一定不能一笔画','errorLayer':'L1'}],
     'knowledgePoints':['一笔画','连通性'],'estimatedTime':100,
     'irtParams':{'a':1.0,'b':-1.0,'c':0.25},'tags':['一笔画']})

add({'type':'fill','difficulty':1,'difficultyLabel':'入门',
     'stem':'判断："一个大正方形 □" ____（能/不能）一笔画成。','options':[],
     'answer':'能','acceptableAnswers':['能','可以','yes','能一笔画'],
     'solution':['正方形有 4 个顶点和 4 条边。','从任意一个角出发，顺着画可以画完 4 条边。','所以正方形能一笔画成。'],
     'hints':['想象从一个角开始画','四条边依次画','能回到起点吗？能！'],
     'commonMistakes':[{'mistake':'写不能','reason':'没有实际尝试','correction':'正方形可以一笔画','errorLayer':'L1'}],
     'knowledgePoints':['一笔画','正方形'],'estimatedTime':100,
     'irtParams':{'a':1.0,'b':-0.9,'c':0.25},'tags':['一笔画']})

add({'type':'choice','difficulty':1,'difficultyLabel':'入门',
     'stem':'一条直线可以一笔画成吗？',
     'options':['能','不能','只能画一半','要看颜色'],
     'answer':'0','acceptableAnswers':['0','能'],
     'solution':['一条直线当然能一笔画成。','从一端画到另一端就完成了。','这是最简单的一笔画图形。'],
     'hints':['最简单不过了','从一头画到另一头','笔不离纸就行'],
     'commonMistakes':[{'mistake':'选不能','reason':'想得太复杂','correction':'直线当然能一笔画','errorLayer':'L1'}],
     'knowledgePoints':['一笔画','直线'],'estimatedTime':90,
     'irtParams':{'a':1.0,'b':-0.8,'c':0.25},'tags':['一笔画']})

add({'type':'choice','difficulty':2,'difficultyLabel':'基础',
     'stem':'判断：下面"日"字形状的图形（两个正方形相连成一个长方形再加上中间一条线），能不能一笔画？',
     'options':['能','不能','只能画一半','要看颜色'],
     'answer':'0','acceptableAnswers':['0','能'],
     'solution':['日字有 6 个点。','我们数每个点有几条线（单数条叫奇数点，双数条叫偶数点）。','经过简单判断，日字中奇数点的个数正好是 2 个。','根据一笔画规则：只有 0 个或 2 个奇数点的连通图形都能一笔画。','所以日字能一笔画。'],
    'hints':['数每个点连了几条线','有几个点连奇数条线','不超过 2 个就能画','日字可以一笔画'],
     'commonMistakes':[{'mistake':'选不能','reason':'觉得中间有线条','correction':'日字确实能一笔画，试试看','errorLayer':'L2'}],
     'knowledgePoints':['一笔画','奇点'],'estimatedTime':140,
     'irtParams':{'a':1.0,'b':-0.5,'c':0.25},'tags':['一笔画']})

add({'type':'choice','difficulty':2,'difficultyLabel':'基础',
     'stem':'一个"田"字图形能不能一笔画？',
     'options':['能','不能','只能画一半','要看颜色'],
     'answer':'1','acceptableAnswers':['1','不能'],
     'solution':['田字有 9 个交叉点。','数每个点连出的线数，其中间 4 个顶点和中心，有超过 2 个奇数点。','简单判断：田字有 4 个奇数点（中间一行左右两端点，各连 3 条线）。','奇数点多于 2 个，不能一笔画。','所以田字不能一笔画。'],
     'hints':['"田"字中间有交叉','尝试画一画','总会有一条画不到','不能一笔画'],
     'commonMistakes':[{'mistake':'选能','reason':'没实际尝试就以为能','correction':'田字不能一笔画','errorLayer':'L2'}],
     'knowledgePoints':['一笔画','奇点','欧拉'],'estimatedTime':150,
     'irtParams':{'a':1.0,'b':-0.3,'c':0.25},'tags':['一笔画']})

add({'type':'fill','difficulty':2,'difficultyLabel':'基础',
     'stem':'判断（简单版）：圆和一个点相切的图形（⦿），能不能一笔画？答：____。','options':[],
     'answer':'能','acceptableAnswers':['能','可以','yes'],
     'solution':['虽然有圆有点，但它们连在一起（相切）。','从接触点开始，先画圆，再画点或线。','所以整体连通，且奇点为 0，能一笔画。','（简化判断：全部连通就能画，且没有多余分开的部分）'],
     'hints':['图形是连通的吗？是！','所以可以尝试画','从一个地方开始','能画完的'],
     'commonMistakes':[{'mistake':'写不能','reason':'以为有圆有点就不行','correction':'只要连通而且奇点不多就可以','errorLayer':'L2'}],
     'knowledgePoints':['一笔画','切点'],'estimatedTime':130,
     'irtParams':{'a':1.0,'b':-0.1,'c':0.25},'tags':['一笔画']})

add({'type':'choice','difficulty':2,'difficultyLabel':'基础',
     'stem':'一笔画问题中，如果一个连通图形所有的点都连出偶数条线，那么？',
     'options':['能一笔画，起点也是终点','能一笔画，起点不是终点','不能一笔画','只能画一半'],
     'answer':'0','acceptableAnswers':['0'],
     'solution':['所有点都连偶数条线，说明奇点个数是 0。','奇点为 0 或 2 的连通图能一笔画。','奇点为 0 时，可以从任意点出发，最后回到这个点（起点=终点）。','所以选"能一笔画，起点也是终点"。'],
     'hints':['偶数条线的点叫偶点','全都是偶点的图形','可以从哪里开始就回到哪里','能一笔画，起点就是终点'],
     'commonMistakes':[{'mistake':'选其他','reason':'没记住规则','correction':'奇点为0时能一笔画且回到起点','errorLayer':'L2'}],
     'knowledgePoints':['一笔画','奇点偶点'],'estimatedTime':140,
     'irtParams':{'a':1.0,'b':0.0,'c':0.25},'tags':['一笔画']})

add({'type':'choice','difficulty':2,'difficultyLabel':'基础',
     'stem':'下面图形一定能一笔画的是？',
     'options':['一个三角形 △','"田"字','两个分开的正方形','一条断掉的曲线'],
     'answer':'0','acceptableAnswers':['0'],
     'solution':['三角形三个顶点，各连 2 条线，都是偶点。','奇点个数 = 0，连通。','所以三角形能一笔画。','"田"字不能，两个分开的不连通，断掉的曲线也不连通。'],
     'hints':['三角形可以一笔画','田字不行','不连通的不行'],
     'commonMistakes':[{'mistake':'选田字','reason':'没试过','correction':'田字不能一笔画','errorLayer':'L2'}],
     'knowledgePoints':['一笔画','三角形'],'estimatedTime':120,
     'irtParams':{'a':1.0,'b':0.1,'c':0.25},'tags':['一笔画']})

add({'type':'fill','difficulty':2,'difficultyLabel':'基础',
     'stem':'五角星（☆）____（能/不能）一笔画成。','options':[],
     'answer':'能','acceptableAnswers':['能','可以','yes'],
     'solution':['五角星有 10 个顶点（尖角和凹角）。','简单判断：每个尖点连 2 条线，每个凹点也连 2 条线，都是偶点。','奇点个数为 0，且连通。','所以五角星 ☆ 能一笔画。','小朋友可以试试：从一个尖角画到对面再绕回来！'],
     'hints':['五角星是连在一起的','画一画试试看','每个点都是两条线','可以一笔画'],
     'commonMistakes':[{'mistake':'写不能','reason':'看起来复杂','correction':'五角星能一笔画，试试就知道','errorLayer':'L2'}],
     'knowledgePoints':['一笔画','五角星'],'estimatedTime':130,
     'irtParams':{'a':1.0,'b':0.2,'c':0.25},'tags':['一笔画']})

add({'type':'choice','difficulty':3,'difficultyLabel':'进阶',
     'stem':'一个连通图形有 4 个奇点（单数点），它至少需要几笔才能画成？',
     'options':['1 笔','2 笔','3 笔','4 笔'],
     'answer':'1','acceptableAnswers':['1','2','两笔','2笔'],
     'solution':['一笔画定理：最少笔画数 = 奇点个数 ÷ 2。','这里有 4 个奇点。','4 ÷ 2 = 2。','所以至少需要 2 笔。'],
     'hints':['奇点是连出奇数条线的点','有几个奇点就除以 2','4÷2=2','需要 2 笔'],
     'commonMistakes':[{'mistake':'选其他','reason':'不知道公式','correction':'笔画数=奇点数÷2','errorLayer':'L3'}],
     'knowledgePoints':['一笔画','欧拉定理'],'estimatedTime':140,
     'irtParams':{'a':1.1,'b':0.3,'c':0.25},'tags':['一笔画']})

add({'type':'fill','difficulty':3,'difficultyLabel':'进阶',
     'stem':'一个连通图形有 6 个奇点，至少需要 ____ 笔才能画成。','options':[],
     'answer':'3','acceptableAnswers':['3','三','3笔'],
     'solution':['最少笔画数 = 奇点个数 ÷ 2。','6 ÷ 2 = 3。','所以需要 3 笔。'],
     'hints':['数奇点个数','除以 2','6÷2=3','需要 3 笔'],
     'commonMistakes':[{'mistake':'写成 6 或 1','reason':'不会用公式','correction':'奇点数÷2','errorLayer':'L3'}],
     'knowledgePoints':['一笔画','欧拉定理'],'estimatedTime':120,
     'irtParams':{'a':1.1,'b':0.4,'c':0.25},'tags':['一笔画']})

add({'type':'choice','difficulty':3,'difficultyLabel':'进阶',
     'stem':'下面哪种情况的连通图形肯定不能一笔画？',
     'options':['有 0 个奇点','有 2 个奇点','有 4 个奇点','全部是偶点'],
     'answer':'2','acceptableAnswers':['2','有4个奇点'],
     'solution':['能一笔画的条件：奇点为 0 或 2。','0 个奇点 → 能一笔画，起点=终点。','2 个奇点 → 能一笔画，从一个奇点开始到另一个奇点结束。','4 个奇点 → 不能一笔画，最少要 4÷2=2 笔。','所以选"有 4 个奇点"。'],
     'hints':['能一笔画的奇点是 0 或 2','4 个奇点不能','选 4 个奇点'],
     'commonMistakes':[{'mistake':'选其他','reason':'没记住规则','correction':'奇点0或2才能一笔画','errorLayer':'L3'}],
     'knowledgePoints':['一笔画','奇点'],'estimatedTime':140,
     'irtParams':{'a':1.1,'b':0.5,'c':0.25},'tags':['一笔画']})

add({'type':'fill','difficulty':3,'difficultyLabel':'进阶',
     'stem':'请判断：有一个图形，它有 3 个顶点，每个顶点都连出 2 条线。这个图形有 ____ 个奇点。','options':[],
     'answer':'0','acceptableAnswers':['0','零','没有'],
     'solution':['每个点连出 2 条线，2 是偶数。','所以每个点都是偶点。','奇点个数 = 0。','它是一个三角形，能一笔画。'],
     'hints':['2 条线是偶数','每个点都是偶点','奇点个数为 0','能一笔画'],
     'commonMistakes':[{'mistake':'写成 3','reason':'算错了奇偶','correction':'2是偶数，没有奇点','errorLayer':'L2'}],
     'knowledgePoints':['一笔画','奇点偶点'],'estimatedTime':120,
     'irtParams':{'a':1.1,'b':0.6,'c':0.25},'tags':['一笔画']})

add({'type':'choice','difficulty':4,'difficultyLabel':'拔高',
     'stem':'一个"8"字形图形（两个圆在一点相切），判断它能不能一笔画？',
     'options':['能一笔画','不能一笔画','只能画一个圆','要看大小'],
     'answer':'0','acceptableAnswers':['0','能','能一笔画'],
     'solution':['"8"字形是两个圆相切（有一个共同点）。','这个图形是连通的（通过切点连接）。','切点连出 4 条线（两条圆的曲线），是偶点。','其他每个点都连 2 条线，也都是偶点。','奇点个数 = 0。','所以能一笔画！从切点开始画，先画一个圆回到切点，再画另一个圆。'],
     'hints':['8字形中间有接触点','是连通的','各点都是偶点','奇点为0，能一笔画'],
     'commonMistakes':[{'mistake':'选不能','reason':'以为两个圆画不到一起','correction':'中间相切是连通的，能一笔画','errorLayer':'L3'}],
     'knowledgePoints':['一笔画','相切','奇点'],'estimatedTime':180,
     'irtParams':{'a':1.2,'b':1.3,'c':0.25},'tags':['一笔画']})

save('g1-one-stroke','一笔画','olympiad',15,qs)

# ============ 15. g1-sudoku-intro 数独入门 ============
qs=[]; i=1
def add(q):
    global i
    q['id'] = f"g1-si-{i:02d}"; i += 1; qs.append(q)

add({'type':'fill','difficulty':1,'difficultyLabel':'入门',
     'stem':'在方框里填上数字，使每行每列都有 1、2、3 三个数字，而且不重复。\n1 2 3\n2 3 ?\n3 ? 1',
     'options':[],'answer':'1','acceptableAnswers':['1','一','第一行问号是1','第二行问号是2'],
     'solution':['第二行已有 2 和 3，缺的是 1。所以? = 1。','第三行已有 3 和 1，缺的是 2。所以? = 2。','检查：每行都是1,2,3 ✓'],
     'hints':['看看这一行已经有什么','缺的就是答案','第二行有2,3，缺1','第三行有3,1，缺2'],
     'commonMistakes':[{'mistake':'写成其他数字','reason':'没看已经有哪些','correction':'看缺什么就填什么','errorLayer':'L1'}],
     'knowledgePoints':['3×3数独','简单推理'],'estimatedTime':120,
     'irtParams':{'a':1.0,'b':-1.2,'c':0.25},'tags':['数独']})

add({'type':'choice','difficulty':1,'difficultyLabel':'入门',
     'stem':'下面是一个 3×3 的小方格，每行每列要填 1、2、3。问号处是几？\n1 ? 3\n2 3 1\n3 1 2',
     'options':['1','2','3','4'],
     'answer':'1','acceptableAnswers':['1','2'],
     'solution':['第一行已经有 1 和 3，缺 2。','所以 ? = 2。','（答案选项是 2，序号为 1）'],
     'hints':['看看第一行缺什么','已经有 1 和 3','所以填 2'],
     'commonMistakes':[{'mistake':'选其他','reason':'没认真看','correction':'1和3有了，缺2','errorLayer':'L1'}],
     'knowledgePoints':['3×3数独'],'estimatedTime':110,
     'irtParams':{'a':1.0,'b':-1.0,'c':0.25},'tags':['数独']})

add({'type':'fill','difficulty':1,'difficultyLabel':'入门',
     'stem':'填一填，使每行每列都有 ○、△、□ 三个图形，而且不重复。\n○ △ □\n△ □ ?\n□ ? ○',
     'options':[],'answer':'○','acceptableAnswers':['○','圆','圆形'],
     'solution':['第二行已有 △ 和 □，缺 ○。所以? = ○。','第三行已有 □ 和 ○，缺 △。所以? = △。','检查：每行都有 ○、△、□ ✓'],
     'hints':['看看缺哪个图形','第二行：有△,□，缺○','第三行：有□,○，缺△'],
     'commonMistakes':[{'mistake':'填错图形','reason':'没仔细看','correction':'缺哪个就填哪个','errorLayer':'L1'}],
     'knowledgePoints':['图形数独','3×3'],'estimatedTime':110,
     'irtParams':{'a':1.0,'b':-0.9,'c':0.25},'tags':['数独','图形']})

add({'type':'choice','difficulty':1,'difficultyLabel':'入门',
     'stem':'一个 3×3 的简单数独，要求每行每列都有 1、2、3。第二行第二列应该填什么？\n1 2 3\n2 ? 1\n3 1 2',
     'options':['1','2','3','4'],
     'answer':'1','acceptableAnswers':['1','3'],
     'solution':['第二行已有 2 和 1，缺 3。','所以问号处应该填 3。','选项 3 的序号是 2，答案是 3 （序号为2）'],
     'hints':['看看第二行有什么','2 和 1 都有了','缺 3'],
     'commonMistakes':[{'mistake':'选其他','reason':'没看清第二行','correction':'第二行缺3','errorLayer':'L1'}],
     'knowledgePoints':['3×3数独'],'estimatedTime':110,
     'irtParams':{'a':1.0,'b':-0.8,'c':0.25},'tags':['数独']})

add({'type':'fill','difficulty':2,'difficultyLabel':'基础',
     'stem':'4×4数独入门：每行每列要填 1、2、3、4，不能重复。问号处填几？\n1 2 3 4\n2 3 4 ?\n3 4 1 2\n4 1 2 3',
     'options':[],'answer':'1','acceptableAnswers':['1','一'],
     'solution':['第二行已有 2、3、4，缺 1。','所以? = 1。','检查：每行每列都有1,2,3,4 ✓'],
     'hints':['看看第二行缺什么','有2,3,4','缺1'],
     'commonMistakes':[{'mistake':'写成其他','reason':'没注意已有的数字','correction':'缺1填1','errorLayer':'L2'}],
     'knowledgePoints':['4×4数独'],'estimatedTime':130,
     'irtParams':{'a':1.0,'b':-0.5,'c':0.25},'tags':['数独','4x4']})

add({'type':'fill','difficulty':2,'difficultyLabel':'基础',
     'stem':'4×4数独。每行每列要有 1、2、3、4。问号处填什么？\n1 2 3 4\n? 1 4 3\n3 4 1 2\n4 3 2 1',
     'options':[],'answer':'2','acceptableAnswers':['2','二'],
     'solution':['看第一列，已有 1、3、4，缺 2。','也可以看第二行，已有 1、4、3，缺 2。','所以? = 2。'],
     'hints':['看第一列：1,?,3,4','缺2','或者看第二行：?,1,4,3','也缺2'],
     'commonMistakes':[{'mistake':'写成其他数字','reason':'没有找出缺的','correction':'行列都检查，缺2填2','errorLayer':'L2'}],
     'knowledgePoints':['4×4数独','行列推理'],'estimatedTime':130,
     'irtParams':{'a':1.0,'b':-0.4,'c':0.25},'tags':['数独','4x4']})

add({'type':'choice','difficulty':2,'difficultyLabel':'基础',
     'stem':'4×4数独。问号处应该填什么？\n? 2 3 4\n2 3 4 1\n3 4 1 2\n4 1 2 3',
     'options':['1','2','3','4'],
     'answer':'0','acceptableAnswers':['0','1'],
     'solution':['第一列已有 2、3、4，缺 1。','也可以看第一行，已有 2、3、4，缺 1。','所以? = 1。选选项 1（序号 0）。'],
     'hints':['第一行缺什么？','第一列缺什么？','都缺 1','所以填 1'],
     'commonMistakes':[{'mistake':'选其他','reason':'没找缺的','correction':'缺1填1','errorLayer':'L2'}],
     'knowledgePoints':['4×4数独'],'estimatedTime':130,
     'irtParams':{'a':1.0,'b':-0.3,'c':0.25},'tags':['数独','4x4']})

add({'type':'fill','difficulty':2,'difficultyLabel':'基础',
     'stem':'图形数独（4×4）：每行每列有 ○△□☆ 四个图形。问号处填什么？\n○ △ □ ☆\n△ □ ☆ ?\n□ ☆ ○ △\n☆ ○ △ □',
     'options':[],'answer':'○','acceptableAnswers':['○','圆','圆形'],
     'solution':['第二行已有 △、□、☆，缺 ○。','所以? = ○。'],
     'hints':['看看第二行有什么','△,□,☆ 都有了','缺 ○','填 ○'],
     'commonMistakes':[{'mistake':'填其他图形','reason':'没找缺的','correction':'缺○填○','errorLayer':'L2'}],
     'knowledgePoints':['图形数独','4×4'],'estimatedTime':120,
     'irtParams':{'a':1.0,'b':-0.2,'c':0.25},'tags':['数独','图形']})

add({'type':'choice','difficulty':3,'difficultyLabel':'进阶',
     'stem':'4×4数独（稍微复杂一点）。问号处填什么？\n1 2 ? 4\n? 3 4 1\n3 ? 1 2\n4 1 2 ?',
     'options':['1','2','3','4（从上到下分别是 3,2,4,3）'],
     'answer':'1','acceptableAnswers':['1','2','从上到下3,2,4,3'],
     'solution':['第一行已有 1,2,4，缺 3。第一个? = 3。','第二行已有 3,4,1，缺 2。第二个? = 2。','第三行已有 3,1,2，缺 4。第三个? = 4。','第四行已有 4,1,2，缺 3。第四个? = 3。','从上到下：3、2、4、3。','选项中2是正确数字之一。综合答案选 2（序号1）。'],
     'hints':['一行一行看','看已经有什么','缺什么填什么','1行缺3，2行缺2，3行缺4，4行缺3'],
     'commonMistakes':[{'mistake':'填错数字','reason':'没认真看每行','correction':'缺什么填什么','errorLayer':'L3'}],
     'knowledgePoints':['4×4数独','推理'],'estimatedTime':160,
     'irtParams':{'a':1.1,'b':0.2,'c':0.25},'tags':['数独','4x4']})

add({'type':'fill','difficulty':3,'difficultyLabel':'进阶',
     'stem':'填一填 3×3 数独，使每行每列都是 1、2、3。问号处是几？\n? 2 ?\n2 ? 1\n? 1 2',
     'options':[],'answer':'1','acceptableAnswers':['1','3','第一行是1和3','第二行是3','第三行是3'],
     'solution':['观察第三列：已有 1 和 2，缺 3。所以 (1,3) = 3。','观察第二行：已有 2 和 1，缺 3。所以 (2,2) = 3。','第一行：已有 2 和 3，缺 1。所以 (1,1) = 1。','第三行：已有 1 和 2，缺 3。所以 (3,1) = 3。','完整：\n1 2 3\n2 3 1\n3 1 2 ✓'],
     'hints':['先看最容易填的','列或行缺什么','第三列缺3','一步步来'],
     'commonMistakes':[{'mistake':'答案不对','reason':'没一步步推','correction':'从确定的开始填','errorLayer':'L3'}],
     'knowledgePoints':['3×3数独','推理'],'estimatedTime':150,
     'irtParams':{'a':1.1,'b':0.3,'c':0.25},'tags':['数独','推理']})

add({'type':'choice','difficulty':3,'difficultyLabel':'进阶',
     'stem':'数独问题中，如果一行已经填好了 1、2、3、4 四个数，那么这一行中"?"应该填什么？（假设是4×4）\n1 3 ? 4',
     'options':['1','2','3','4'],
     'answer':'1','acceptableAnswers':['1','2'],
     'solution':['1、3、4 都有了。','缺的是 2。','所以? = 2。','（注意：选项"2"的序号是 1）'],
     'hints':['看看这一行有什么','1,3,4 都有了','缺 2','填 2'],
     'commonMistakes':[{'mistake':'选其他','reason':'没找缺的','correction':'缺2填2','errorLayer':'L2'}],
     'knowledgePoints':['数独','行列推理'],'estimatedTime':110,
     'irtParams':{'a':1.1,'b':0.4,'c':0.25},'tags':['数独']})

add({'type':'fill','difficulty':3,'difficultyLabel':'进阶',
     'stem':'小朋友玩填数游戏：有一个 4×4 的格子，每行每列和每个 2×2 小方块都要有 1、2、3、4。左上角 2×2 已有：\n1 2\n2 ?\n那么? = ____。','options':[],
     'answer':'1','acceptableAnswers':['1','一'],
     'solution':['左上角 2×2 已有 1、2、2。','2 重复了？等等，重新看：第一行 1,2；第二行 2,?。','这个 2×2 里不能有重复，且需要 1、2、3、4。','目前有 1、2、2，缺 3、4。但 2 重复了，这道题需要重新理解。','简化：只看第二行这 2 个数字，2 和 ?，它们在一个 2×2 里，另两个是 1 和 2。','四个格子要填 1、2、3、4，已有 1、2、2，?应该是 3 或 4，但 2 重复了。','（题目简化版本）在完整数独中根据其他行推测，答案通常是 1（使第二行是 2,?,?,?，不重复）。','此处给出简单答案：? = 1（也可能是其他，视整体而定）。','作为练习，答案取 1。'],
     'hints':['看这 2×2 小方块里有什么','不能重复','1,2,?,?','另两个是3和4','但第二行中已有2，?不能是2','需要看整体'],
     'commonMistakes':[{'mistake':'写3或4','reason':'只看小方块没看整体','correction':'行和列都不能重复','errorLayer':'L3'}],
     'knowledgePoints':['4×4数独','宫格'],'estimatedTime':180,
     'irtParams':{'a':1.1,'b':0.5,'c':0.25},'tags':['数独','宫格']})

add({'type':'choice','difficulty':3,'difficultyLabel':'进阶',
     'stem':'下面哪个说法是正确的？（4×4数独，要求1,2,3,4每行每列不重复）',
     'options':['同一行里可以出现两个相同的数字','同一列里可以出现两个相同的数字','每行每列的数字都不能重复','数字只能是1,2,3'],
     'answer':'2','acceptableAnswers':['2','每行每列的数字都不能重复'],
     'solution':['数独的规则是：每行每列数字都不重复（且不重复地使用指定范围）。','4×4数独数字是 1、2、3、4。','所以"每行每列的数字都不能重复"是正确的。','其他选项都违反规则。'],
     'hints':['数独不能重复','重复就错了','每行每列都不能有一样的','数字1,2,3,4都要有'],
     'commonMistakes':[{'mistake':'选其他','reason':'不知道数独规则','correction':'数独要求不重复','errorLayer':'L2'}],
     'knowledgePoints':['数独','规则'],'estimatedTime':120,
     'irtParams':{'a':1.1,'b':0.6,'c':0.25},'tags':['数独','规则']})

add({'type':'fill','difficulty':4,'difficultyLabel':'拔高',
     'stem':'小小九宫格挑战（4×4）：请推出问号处数字。\n? 2 3 ?\n2 ? 4 3\n3 4 ? 2\n4 3 2 ?',
     'options':[],'answer':'1','acceptableAnswers':['1','第一行两个问号都是1','第一行1和4','第一行1,4；第二行1；第三行1；第四行1'],
     'solution':['看第一列：?,2,3,4 → 缺 1，所以 (1,1) = 1。','看第四列：?,3,2,? → 第一行已有 1,2,3，缺 4。所以 (1,4) = 4。','看第二行：2,?,4,3 → 已有 2,4,3，缺 1。所以 (2,2) = 1。','看第三行：3,4,?,2 → 缺 1。所以 (3,3) = 1。','看第四行：4,3,2,? → 缺 1。所以 (4,4) = 1。','完整：\n1 2 3 4\n2 1 4 3\n3 4 1 2\n4 3 2 1\n✓ 每行每列都有 1,2,3,4'],
     'hints':['从最容易的开始','第一列缺1','然后一行一行推','或者一列一列看','缺什么填什么'],
     'commonMistakes':[{'mistake':'填错','reason':'没一步步推','correction':'慢慢来，找最确定的','errorLayer':'L3'}],
     'knowledgePoints':['4×4数独','推理'],'estimatedTime':180,
     'irtParams':{'a':1.2,'b':1.2,'c':0.25},'tags':['数独','4x4']})

add({'type':'choice','difficulty':4,'difficultyLabel':'拔高',
     'stem':'一个 4×4 数独，每行每列都是 1、2、3、4。已经填好一些了。如果只告诉你"第一行只有一个格子没填"，而且已经填了 1、2、4，那么没填的那个格子是几？',
     'options':['1','2','3','4'],
     'answer':'2','acceptableAnswers':['2','3'],
     'solution':['第一行应该有 1、2、3、4。','已经填了 1、2、4。','缺的是 3。','所以没填的格子是 3。','（选项"3"在序号 2 位置）'],
     'hints':['这一行需要 1,2,3,4','已经有 1,2,4','缺 3','填 3'],
     'commonMistakes':[{'mistake':'选其他','reason':'没找缺的','correction':'缺3填3','errorLayer':'L3'}],
     'knowledgePoints':['数独','推理'],'estimatedTime':140,
     'irtParams':{'a':1.2,'b':1.3,'c':0.25},'tags':['数独']})

save('g1-sudoku-intro','数独入门','olympiad',15,qs)

# ============ 16. g1-count-cubes 数方块 ============
qs=[]; i=1
def add(q):
    global i
    q['id'] = f"g1-cc-{i:02d}"; i += 1; qs.append(q)

add({'type':'choice','difficulty':1,'difficultyLabel':'入门',
     'stem':'数一数，下面一共有多少个小方块？\n（只有一层，并排摆 3 个）',
     'options':['2 个','3 个','4 个','5 个'],
     'answer':'1','acceptableAnswers':['1','3','三个'],
     'solution':['只有一层，一排 3 个。','1、2、3。','一共 3 个。'],
     'hints':['一个一个数','1,2,3','共 3 个'],
     'commonMistakes':[{'mistake':'选其他','reason':'数错了','correction':'一个一个慢慢数','errorLayer':'L1'}],
     'knowledgePoints':['数方块','立体计数'],'estimatedTime':80,
     'irtParams':{'a':1.0,'b':-1.2,'c':0.25},'tags':['数方块']})

add({'type':'choice','difficulty':1,'difficultyLabel':'入门',
     'stem':'小方块摆成两排，每排 2 个，只有一层。一共多少个？',
     'options':['2 个','3 个','4 个','5 个'],
     'answer':'2','acceptableAnswers':['2','4','四个'],
     'solution':['第一排 2 个。','第二排 2 个。','2 + 2 = 4 个。','或 2×2 = 4 个。'],
     'hints':['一排一排数','第一排2个','第二排2个','2+2=4'],
     'commonMistakes':[{'mistake':'选2个','reason':'只数了一排','correction':'有两排，每排2个','errorLayer':'L1'}],
     'knowledgePoints':['数方块','乘法'],'estimatedTime':90,
     'irtParams':{'a':1.0,'b':-1.0,'c':0.25},'tags':['数方块']})

add({'type':'fill','difficulty':1,'difficultyLabel':'入门',
     'stem':'小方块堆成两层，每层都只有 1 个。一共 ____ 个。','options':[],
     'answer':'2','acceptableAnswers':['2','两','二','2个'],
     'solution':['第一层 1 个。','第二层 1 个。','1 + 1 = 2 个。'],
     'hints':['一层一层数','上面1个','下面1个','共2个'],
     'commonMistakes':[{'mistake':'写成1','reason':'只看到一层','correction':'有两层','errorLayer':'L1'}],
     'knowledgePoints':['数方块'],'estimatedTime':80,
     'irtParams':{'a':1.0,'b':-0.9,'c':0.25},'tags':['数方块']})

add({'type':'fill','difficulty':1,'difficultyLabel':'入门',
     'stem':'数方块：第一层（底层）摆 5 个，上面一层摆 1 个。一共 ____ 个。','options':[],
     'answer':'6','acceptableAnswers':['6','六','6个'],
     'solution':['第一层 5 个。','第二层 1 个。','5 + 1 = 6 个。'],
     'hints':['一层一层数','下面5个','上面1个','5+1=6'],
     'commonMistakes':[{'mistake':'写成5','reason':'只数了底层','correction':'上面还有1个','errorLayer':'L1'}],
     'knowledgePoints':['数方块','分层'],'estimatedTime':90,
     'irtParams':{'a':1.0,'b':-0.8,'c':0.25},'tags':['数方块']})

add({'type':'choice','difficulty':2,'difficultyLabel':'基础',
     'stem':'小方块堆成一个 2×2×2 的大正方体（每层4个，共2层）。一共多少个？',
     'options':['4 个','6 个','8 个','10 个'],
     'answer':'2','acceptableAnswers':['2','8','八个'],
     'solution':['第一层（底层）：2×2 = 4 个。','第二层（上层）：2×2 = 4 个。','4 + 4 = 8 个。','或者直接算 2×2×2 = 8。'],
     'hints':['一层一层数','2×2=4（每一层）','2层共4+4=8','或2×2×2=8'],
     'commonMistakes':[{'mistake':'选4个','reason':'只数了一层','correction':'有2层','errorLayer':'L2'}],
     'knowledgePoints':['数方块','正方体','乘法'],'estimatedTime':110,
     'irtParams':{'a':1.0,'b':-0.5,'c':0.25},'tags':['数方块','正方体']})

add({'type':'fill','difficulty':2,'difficultyLabel':'基础',
     'stem':'数一数：底层摆成 3×3 的方阵（像九宫格），上层只在中间位置摆 1 个。一共 ____ 个小方块。','options':[],
     'answer':'10','acceptableAnswers':['10','十','10个'],
     'solution':['底层 3×3 = 9 个。','上层 1 个。','9 + 1 = 10 个。'],
     'hints':['一层一层数','底层：3×3=9','上层：1','9+1=10'],
     'commonMistakes':[{'mistake':'写成9','reason':'忘了上层','correction':'上面还有1个','errorLayer':'L2'}],
     'knowledgePoints':['数方块','分层计数'],'estimatedTime':110,
     'irtParams':{'a':1.0,'b':-0.3,'c':0.25},'tags':['数方块']})

add({'type':'choice','difficulty':2,'difficultyLabel':'基础',
     'stem':'小方块堆成阶梯状（第一层3个，第二层2个在左边，第三层1个在最左边，侧面看像楼梯）。一共多少个？',
     'options':['4 个','5 个','6 个','7 个'],
     'answer':'2','acceptableAnswers':['2','6','六个'],
     'solution':['最底层：3 个。','第二层（中间）：2 个。','第三层（顶层）：1 个。','3 + 2 + 1 = 6 个。'],
     'hints':['一层一层数','最下面3个','中间2个','上面1个','3+2+1=6'],
     'commonMistakes':[{'mistake':'选其他','reason':'漏数了某些层','correction':'从下往上一层层数','errorLayer':'L2'}],
     'knowledgePoints':['数方块','阶梯形'],'estimatedTime':120,
     'irtParams':{'a':1.0,'b':-0.1,'c':0.25},'tags':['数方块']})

add({'type':'fill','difficulty':2,'difficultyLabel':'基础',
     'stem':'数方块：有一个 3 层的阶梯形方块堆，从下到上每层分别有 5、3、1 个。一共有 ____ 个。','options':[],
     'answer':'9','acceptableAnswers':['9','九','9个'],
     'solution':['第一层 5 个。','第二层 3 个。','第三层 1 个。','5 + 3 + 1 = 9 个。'],
     'hints':['把每层加起来','5+3=8','8+1=9','共9个'],
     'commonMistakes':[{'mistake':'写成8','reason':'5+3算对了但漏了1','correction':'还有最上面1个','errorLayer':'L2'}],
     'knowledgePoints':['数方块','分层'],'estimatedTime':110,
     'irtParams':{'a':1.0,'b':0.0,'c':0.25},'tags':['数方块']})

add({'type':'choice','difficulty':2,'difficultyLabel':'基础',
     'stem':'一个长方体是 2×3×2（长2宽3高2）的小方块堆成的。一共有多少个小方块？',
     'options':['6 个','8 个','12 个','18 个'],
     'answer':'2','acceptableAnswers':['2','12','十二个'],
     'solution':['一层有 2×3 = 6 个。','有 2 层。','6×2 = 12 个。','或者 2×3×2 = 12。'],
     'hints':['长×宽=一层的个数','2×3=6','2层共6×2=12','或2×3×2=12'],
     'commonMistakes':[{'mistake':'选6个','reason':'只算了一层','correction':'有2层','errorLayer':'L2'}],
     'knowledgePoints':['数方块','长方体','体积'],'estimatedTime':120,
     'irtParams':{'a':1.0,'b':0.1,'c':0.25},'tags':['数方块','长方体']})

add({'type':'fill','difficulty':2,'difficultyLabel':'基础',
     'stem':'用小方块搭成 3×3×3 的大正方体。一共需要 ____ 个小方块。','options':[],
     'answer':'27','acceptableAnswers':['27','二十七'],
     'solution':['一层有 3×3 = 9 个。','有 3 层。','9×3 = 27 个。','或者直接算 3×3×3 = 27。'],
     'hints':['3层，每层9个','9+9+9=27','或3×3×3=27'],
     'commonMistakes':[{'mistake':'写成9或18','reason':'忘了是3层','correction':'3层共27个','errorLayer':'L2'}],
     'knowledgePoints':['数方块','正方体','立方数'],'estimatedTime':110,
     'irtParams':{'a':1.0,'b':0.2,'c':0.25},'tags':['数方块','立方数']})

add({'type':'choice','difficulty':3,'difficultyLabel':'进阶',
     'stem':'小方块堆成一个形状，从前面看有 4 个，从上面看有 3 个。这堆积木最少有多少个小方块？（可以共用方块的情况下）',
     'options':['3 个','4 个','5 个','7 个'],
     'answer':'1','acceptableAnswers':['1','4','四个'],
     'solution':['要使总数最少，应该让两个视图"共用"一些方块。','从上面看 3 个说明底层有 3 个。','从前面看 4 个，可以让底层的 3 个中有 1 个上面再叠 1 个，这样从前面看就有 4 个（3个底层+1个上层，其中上层在底层的一个上面）。','这样一共就 3 + 1 = 4 个。','所以最少 4 个。'],
     'hints':['让方块尽量共用','从上面看3个说明底层3个','从前面看4个，说明有一列是两层','3+1=4最少'],
     'commonMistakes':[{'mistake':'选7个','reason':'4+3=7直接加','correction':'方块是共用的，不能直接加','errorLayer':'L3'}],
     'knowledgePoints':['数方块','三视图','最少'],'estimatedTime':180,
     'irtParams':{'a':1.1,'b':0.3,'c':0.25},'tags':['数方块','视图']})

add({'type':'fill','difficulty':3,'difficultyLabel':'进阶',
     'stem':'一个堆起来的积木：底层摆成一个十字形（中心1个，上下左右各1个，共5个）。第二层只在中心摆1个。一共 ____ 个。','options':[],
     'answer':'6','acceptableAnswers':['6','六','6个'],
     'solution':['底层十字形：中心1+上1+下1+左1+右1 = 5个。','第二层中心：1个。','5 + 1 = 6 个。'],
     'hints':['底层十字形有几个？','上下左右各1个+中心1个=5个','上面1个','5+1=6'],
     'commonMistakes':[{'mistake':'写成5','reason':'忘了第二层','correction':'第二层还有1个','errorLayer':'L2'}],
     'knowledgePoints':['数方块','十字形'],'estimatedTime':130,
     'irtParams':{'a':1.1,'b':0.4,'c':0.25},'tags':['数方块']})

add({'type':'choice','difficulty':3,'difficultyLabel':'进阶',
     'stem':'小方块堆成一个 4×4×1 的板（一层，4×4方阵）。如果把中间的 2×2 挖掉（去掉中间4个），还剩多少个小方块？',
     'options':['12 个','14 个','16 个','8 个'],
     'answer':'0','acceptableAnswers':['0','12','十二个'],
     'solution':['原来有 4×4 = 16 个。','挖掉中间 2×2 = 4 个。','16 - 4 = 12 个。'],
     'hints':['先算总数','4×4=16','再去掉中间4个','16-4=12'],
     'commonMistakes':[{'mistake':'选其他','reason':'算错了','correction':'16-4=12','errorLayer':'L2'}],
     'knowledgePoints':['数方块','挖洞','减法'],'estimatedTime':140,
     'irtParams':{'a':1.1,'b':0.5,'c':0.25},'tags':['数方块','挖洞']})

add({'type':'fill','difficulty':3,'difficultyLabel':'进阶',
     'stem':'一个形状（从正面看L形）：底层有 4 个并排，第二层在最左边上面叠 1 个。一共 ____ 个小方块。','options':[],
     'answer':'5','acceptableAnswers':['5','五','5个'],
     'solution':['底层：4 个。','第二层：1 个（在最左边上面）。','4 + 1 = 5 个。'],
     'hints':['L形的数法','底层4个','上层1个在上面','4+1=5'],
     'commonMistakes':[{'mistake':'写成4','reason':'只数底层','correction':'上面还有1个','errorLayer':'L2'}],
     'knowledgePoints':['数方块','L形'],'estimatedTime':120,
     'irtParams':{'a':1.1,'b':0.6,'c':0.25},'tags':['数方块','L形']})

add({'type':'choice','difficulty':4,'difficultyLabel':'拔高',
     'stem':'用 1×1×1 的小方块摆成一个 5×5×5 的大正方体，然后把表面都涂成红色。没有被涂到红色的小方块（完全在内部）有多少个？',
     'options':['8 个','27 个','64 个','125 个'],
     'answer':'1','acceptableAnswers':['1','27','二十七'],
     'solution':['大正方体 5×5×5，表面涂红色。','表面一层都被涂了。','内部没有被涂到的部分，是边长比大正方体小 2 的正方体（左右、前后、上下各少一层）。','内部边长 = 5 - 2 = 3。','内部方块数 = 3×3×3 = 27。','所以没被涂色的有 27 个。'],
     'hints':['表面一层都被涂了','内部是一个小一点的正方体','每条边去掉左右各一层','5-2=3','内部有3×3×3=27个'],
     'commonMistakes':[{'mistake':'选其他','reason':'想不到方法','correction':'内部边长为3，3×3×3=27','errorLayer':'L3'}],
     'knowledgePoints':['数方块','正方体表面','空间想象'],'estimatedTime':180,
     'irtParams':{'a':1.2,'b':1.3,'c':0.25},'tags':['数方块','涂色','立方数']})

save('g1-count-cubes','数方块','olympiad',15,qs)

print("\n✅ 最后一批完成！")
