
# -*- coding: utf-8 -*-
import os
import json
import re

base_dir = r'E:\internal_safe\study-math'
content_dir = os.path.join(base_dir, r'public\content')
bank_dir = os.path.join(base_dir, r'public\content\question-bank')

# 定义各年级目录
grades = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6']
grade_names = {
    'g1': '一年级',
    'g2': '二年级',
    'g3': '三年级',
    'g4': '四年级',
    'g5': '五年级',
    'g6': '六年级',
}

print('=' * 80)
print('题库覆盖情况检查报告')
print('=' * 80)

for grade in grades:
    grade_content_dir = os.path.join(content_dir, grade)
    grade_bank_dir = os.path.join(bank_dir, grade)
    
    if not os.path.exists(grade_content_dir):
        print(f'\n{grade_names[grade]}: 内容目录不存在')
        continue
    
    # 获取内容文件
    content_files = []
    for fname in os.listdir(grade_content_dir):
        if fname.endswith('.md'):
            fpath = os.path.join(grade_content_dir, fname)
            # 尝试从文件名提取topicId
            topic_id = fname.replace('.md', '')
            content_files.append((fname, topic_id, fpath))
    
    # 获取题库文件
    bank_files = []
    if os.path.exists(grade_bank_dir):
        for fname in os.listdir(grade_bank_dir):
            if fname.endswith('.json'):
                bank_files.append(fname)
    
    print(f'\n【{grade_names[grade]}】')
    print(f'  内容文件: {len(content_files)} 个')
    print(f'  题库文件: {len(bank_files)} 个')
    
    # 检查缺失
    missing = []
    for fname, topic_id, fpath in content_files:
        expected_bank_name = f'{grade}-{topic_id}.json'
        if expected_bank_name not in bank_files:
            # 也检查一下有没有其他匹配方式
            alt_match = [b for b in bank_files if topic_id in b and grade in b]
            if not alt_match:
                missing.append((fname, topic_id))
    
    if missing:
        print(f'  ⚠️  缺少题库: {len(missing)} 个')
        for fname, topic_id in missing:
            print(f'     - {fname} ({topic_id})')
    else:
        print(f'  ✅ 题库完整')
    
    # 检查题库文件JSON格式
    if os.path.exists(grade_bank_dir):
        errors = []
        for fname in bank_files:
            fpath = os.path.join(grade_bank_dir, fname)
            try:
                with open(fpath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
            except Exception as e:
                errors.append((fname, str(e)))
        
        if errors:
            print(f'  ⚠️  JSON格式错误: {len(errors)} 个')
            for fname, err in errors:
                print(f'     - {fname}: {err[:60]}')
        else:
            print(f'  ✅ JSON格式全部正确')

print('\n' + '=' * 80)
print('检查完成')
print('=' * 80)
