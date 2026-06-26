
# -*- coding: utf-8 -*-
import os
import json
import sys

# 处理Windows编码问题
sys.stdout.reconfigure(encoding='utf-8')

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

total_missing = 0

for content_grade, bank_grade in grade_map.items():
    grade_content_path = os.path.join(content_dir, content_grade)
    grade_bank_path = os.path.join(bank_dir, bank_grade)
    
    if not os.path.exists(grade_content_path):
        continue
    
    content_topics = []
    for root, dirs, files in os.walk(grade_content_path):
        for fname in files:
            if fname.endswith('.md') and fname != 'index.md':
                topic_id = fname.replace('.md', '')
                content_topics.append(topic_id)
    
    bank_topics = []
    if os.path.exists(grade_bank_path):
        for fname in os.listdir(grade_bank_path):
            if fname.endswith('.json'):
                topic_id = fname.replace(bank_grade + '-', '').replace('.json', '')
                bank_topics.append(topic_id)
    
    print()
    print('[' + content_grade + ' -> ' + bank_grade + ']')
    print('  内容主题数: ' + str(len(content_topics)))
    print('  题库文件数: ' + str(len(bank_topics)))
    
    content_set = set(content_topics)
    bank_set = set(bank_topics)
    
    missing = content_set - bank_set
    extra = bank_set - content_set
    
    if missing:
        print('  MISSING (' + str(len(missing)) + '):')
        for t in sorted(missing):
            print('     - ' + t)
        total_missing += len(missing)
    else:
        print('  OK: 所有内容主题都有题库')
    
    if extra:
        print('  EXTRA (' + str(len(extra)) + '):')
        for t in sorted(extra):
            print('     + ' + t)
    
    if os.path.exists(grade_bank_path):
        json_errors = []
        for fname in os.listdir(grade_bank_path):
            if fname.endswith('.json'):
                fpath = os.path.join(grade_bank_path, fname)
                try:
                    with open(fpath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                except Exception as e:
                    json_errors.append((fname, str(e)))
        
        if json_errors:
            print('  JSON ERRORS (' + str(len(json_errors)) + '):')
            for fname, err in json_errors:
                print('     X ' + fname + ': ' + err[:80])
        else:
            print('  JSON: 全部正确')

print()
print('=' * 80)
print('总共缺少 ' + str(total_missing) + ' 个题库')
print('=' * 80)
