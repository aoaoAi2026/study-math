
# -*- coding: utf-8 -*-
import os
import json
import re

base_dir = r'E:\internal_safe\study-math'
content_dir = os.path.join(base_dir, r'public\content\grade-6\olympiad')
bank_dir = os.path.join(base_dir, r'public\content\question-bank\g6')

content_files = [f[:-3] for f in os.listdir(content_dir) if f.endswith('.md')]
bank_files = [f[3:-5] for f in os.listdir(bank_dir) if f.startswith('g6-') and f.endswith('.json')]

print('=== 6年级奥数内容文件 (共{}个) ==='.format(len(content_files)))
for f in sorted(content_files):
    print(f)

print()
print('=== 6年级题库文件 (共{}个) ==='.format(len(bank_files)))
for f in sorted(bank_files):
    print(f)

print()
print('=== 缺少题库的内容文件 ===')
missing = []
for c in sorted(content_files):
    if c not in bank_files:
        missing.append(c)
        print('  MISSING: {}'.format(c))
if not missing:
    print('  (none)')

print()
print('=== JSON格式校验 ===')
errors = []
for f in sorted(os.listdir(bank_dir)):
    if f.startswith('g6-') and f.endswith('.json'):
        fpath = os.path.join(bank_dir, f)
        try:
            with open(fpath, 'r', encoding='utf-8') as fh:
                data = json.load(fh)
            qs = data.get('questions', [])
            print('  OK: {} - {}题'.format(f, len(qs)))
        except Exception as e:
            errors.append((f, str(e)))
            print('  ERROR: {} - {}'.format(f, str(e)))

print()
print('=== 检查grade-6/basic ===')
basic_dir = os.path.join(base_dir, r'public\content\grade-6\basic')
basic_files = [f[:-3] for f in os.listdir(basic_dir) if f.endswith('.md')]
for bf in sorted(basic_files):
    if bf in bank_files:
        print('  OK: {} - has bank'.format(bf))
    else:
        print('  MISSING BANK: {}'.format(bf))

print()
print('=== Summary ===')
print('Missing: {}'.format(missing))
print('JSON Errors: {}'.format(errors))
