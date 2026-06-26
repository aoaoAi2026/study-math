import json, os

dir_path = r'E:\internal_safe\study-math\public\content\question-bank\g1'

expected = [
    'g1-number-recognition','g1-addition-within-20','g1-word-problem-1st',
    'g1-counting-game','g1-number-100','g1-addition-subtraction-100',
    'g1-plane-shapes','g1-solid-shapes','g1-clock-time','g1-rmb-money',
    'g1-find-pattern','g1-shape-cut-paste','g1-simple-logic','g1-one-stroke',
    'g1-sudoku-intro','g1-count-cubes'
]

print('=== 检查文件存在性 ===')
exists = []
missing = []
for name in expected:
    fp = os.path.join(dir_path, f'{name}.json')
    if os.path.exists(fp):
        exists.append(name)
        print(f'✓ {name}')
    else:
        missing.append(name)
        print(f'✗ {name} MISSING')

print(f'\n存在 {len(exists)} 个，缺失 {len(missing)} 个')

print('\n=== 验证 JSON 语法 ===')
for name in exists:
    fp = os.path.join(dir_path, f'{name}.json')
    try:
        with open(fp, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f'✓ {name}: {data["topicName"]}, {data["totalQuestions"]}题, category={data["category"]}')
    except Exception as e:
        print(f'✗ {name}: {e}')
