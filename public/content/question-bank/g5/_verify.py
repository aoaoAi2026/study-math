import json, os

files = sorted([f for f in os.listdir('.') if f.startswith('g5-') and f.endswith('.json')])
print('共发现', len(files), '个题库文件')
print()

basic = ['g5-simple-equation','g5-fraction-meaning','g5-polygon-area','g5-cube-cuboid','g5-probability','g5-fraction-add-sub','g5-fraction-split']
total_basic = 0
print('=== 基础知识点 (应为7个,每个15题) ===')
for tid in basic:
    f = tid + '.json'
    if os.path.exists(f):
        with open(f,'r',encoding='utf-8') as fp:
            data = json.load(fp)
        n = data['totalQuestions']
        name = data['topicName']
        print(f'  {name:12s} ({tid:25s}): {n}题  category={data["category"]}')
        total_basic += n
    else:
        print(f'  {tid}: 缺失!')
print(f'  基础合计: {total_basic} 题 (预期105题)')
print()

print('=== 高级奥数 (应为19个+已有燕尾/鸟头,每个18题) ===')
olympiad = ['g5-compare-estimate','g5-complex-fraction','g5-fraction-word-problem','g5-engineering-problem','g5-concentration-problem','g5-profit-loss','g5-cow-grass-problem','g5-ratio-proportion','g5-butterfly-model']
olympiad += ['g5-hourglass-model','g5-solid-geometry-advanced','g5-number-theory','g5-congruence-theorem','g5-perfect-square','g5-indeterminate-equation','g5-permutation-combination','g5-number-array','g5-complex-logic']
total_ol = 0
for tid in olympiad:
    f = tid + '.json'
    if os.path.exists(f):
        with open(f,'r',encoding='utf-8') as fp:
            data = json.load(fp)
        n = data['totalQuestions']
        name = data['topicName']
        print(f'  {name:12s} ({tid:25s}): {n}题  category={data["category"]}')
        total_ol += n
    else:
        print(f'  {tid}: 缺失!')
print(f'  奥数合计: {total_ol} 题 (预期{len(olympiad)*18}题)')
print()
print(f'=== 总计: {len(basic)+len(olympiad)} 个知识点, {total_basic+total_ol} 道题目 ===')
