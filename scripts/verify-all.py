import json, os

OUT = r'E:\internal_safe\study-math\public\content\question-bank\g1'

expected = [
    ('g1-number-recognition', '数的认识', 'basic', 15),
    ('g1-addition-within-20', '20以内加减法', 'basic', 15),
    ('g1-word-problem-1st', '一年级应用题', 'basic', 15),
    ('g1-counting-game', '数数与找规律', 'olympiad', 15),
    ('g1-number-100', '100以内数的认识', 'basic', 15),
    ('g1-addition-subtraction-100', '100以内加减法', 'basic', 15),
    ('g1-plane-shapes', '认识平面图形', 'basic', 15),
    ('g1-solid-shapes', '认识立体图形', 'basic', 15),
    ('g1-clock-time', '认识钟表', 'basic', 15),
    ('g1-rmb-money', '认识人民币', 'basic', 15),
    ('g1-find-pattern', '找规律', 'olympiad', 18),
    ('g1-shape-cut-paste', '图形剪拼', 'olympiad', 15),
    ('g1-simple-logic', '简单推理', 'olympiad', 15),
    ('g1-one-stroke', '一笔画', 'olympiad', 15),
    ('g1-sudoku-intro', '数独入门', 'olympiad', 15),
    ('g1-count-cubes', '数方块', 'olympiad', 15),
]

print('='*60)
print('  验证 16 个题库文件')
print('='*60)
all_ok = True
for tid, tname, cat, count in expected:
    fp = os.path.join(OUT, f'{tid}.json')
    status = '✓'
    info = ''
    try:
        with open(fp, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if data['topicName'] != tname:
            status = '✗'
            info += f' [名称错误:{data["topicName"]}]'
        if data['category'] != cat:
            status = '✗'
            info += f' [分类错误:{data["category"]}]'
        if data['totalQuestions'] != count:
            status = '✗'
            info += f' [题目数错误:{data["totalQuestions"]}]'
        if len(data['questions']) != count:
            status = '✗'
            info += f' [实际数组长度:{len(data["questions"])}]'
        # 检查每个题目的关键字段
        for i, q in enumerate(data['questions']):
            for field in ['id', 'type', 'difficulty', 'difficultyLabel', 'stem']:
                if field not in q:
                    status = '✗'
                    info += f' [第{i+1}题缺{field}]'
                    break
    except FileNotFoundError:
        status = '✗'
        info = ' [文件不存在]'
    except json.JSONDecodeError as e:
        status = '✗'
        info = f' [JSON语法错误:{e}]'
    except Exception as e:
        status = '✗'
        info = f' [其他错误:{e}]'

    if status == '✗':
        all_ok = False
    print(f'  {status} {tid} ({tname}, {cat}, {count}题){info}')

print('='*60)
if all_ok:
    print('  ✅ 全部 16 个题库文件验证通过！')
else:
    print('  ❌ 有文件未通过验证，请检查。')
print('='*60)
