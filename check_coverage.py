
# -*- coding: utf-8 -*-
import os
import json

base_dir = r'E:\internal_safe\study-math'
content_dir = os.path.join(base_dir, r'public\content')
bank_dir = os.path.join(base_dir, r'public\content\question-bank')

grade_map = {
    'grade-1': 'g1',
    'grade-2': 'g2',
    'grade-3': 'g3',
    'grade-4': 'g4',
    'grade-5': 'g5',
    'grade-6': 'g6',
}

print('=' * 80)
print('题库覆盖情况检查报告')
print('=' * 80)

for content_grade, bank_grade in grade_map.items():
    grade_content_path = os.path.join(content_dir, content_grade)
    grade_bank_path = os.path.join(bank_dir, bank_grade)
    
    if not os.path.exists(grade_content_path):
        continue
    
    # 收集所有内容文件（包括子目录）
    content_topics = []
    for root, dirs, files in os.walk(grade_content_path):
        for fname in files:
            if fname.endswith('.md') and fname != 'index.md':
                topic_id = fname.replace('.md', '')
                content_topics.append(topic_id)
    
    # 收集题库文件
    bank_topics = []
    if os.path.exists(grade_bank_path):
        for fname in os.listdir(grade_bank_path):
            if fname.endswith('.json'):
                topic_id = fname.replace(f'{bank_grade}-', '').replace('.json', '')
                bank_topics.append(topic_id)
    
    print(f'\n【{content_grade} → {bank_grade}】')
    print(f'  内容主题数: {len(content_topics)}')
    print(f'  题库文件数: {len(bank_topics)}')
    
    # 找出缺失
    content_set = set(content_topics)
    bank_set = set(bank_topics)
    
    missing = content_set - bank_set
    extra = bank_set - content_set
    
    if missing:
        print(f'  ⚠️  缺少题库 ({len(missing)} 个):')
        for t in sorted(missing):
            print(f'     - {t}')
    else:
        print(f'  ✅ 所有内容主题都有题库')
    
    if extra:
        print(f'  ℹ️ 额外题库 ({len(extra)} 个):')
        for t in sorted(extra):
            print(f'     - {t}')
    
    # 检查JSON格式
    if os.path.exists(grade_bank_path):
        json_errors = []
        for fname in os.listdir(grade_bank_path):
            if fname.endswith('.json'):
                fpath = os.path.join(grade_bank_path, fname)
                try:
                    with open(fpath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    qs = len(data.get('questions', []))
                except Exception as e:
                    json_errors.append((fname, str(e)))
        
        if json_errors:
            print(f'  ⚠️  JSON错误 ({len(json_errors)} 个):')
            for fname, err in json_errors:
                print(f'     - {fname}: {err[:80]}')
        else:
            print(f'  ✅ JSON格式全部正确')

print('\n' + '=' * 80)
print('检查完成')
print('=' * 80)
