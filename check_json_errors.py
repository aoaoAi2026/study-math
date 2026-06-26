
# -*- coding: utf-8 -*-
import os
import json
import re

base_dir = r'E:\internal_safe\study-math'
bank_dir = os.path.join(base_dir, r'public\content\question-bank\g6')

problem_files = [
    'g6-coloring-problem.json',
    'g6-complex-engineering.json', 
    'g6-indeterminate-advanced.json',
    'g6-number-system.json',
    'g6-ratio-travel.json',
    'g6-winning-strategy.json'
]

for fname in problem_files:
    fpath = os.path.join(bank_dir, fname)
    print()
    print('='*60)
    print('Checking: {}'.format(fname))
    print('='*60)
    
    with open(fpath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Try to find the JSON error by line
    try:
        json.loads(''.join(lines))
        print('PARSE OK!')
    except json.JSONDecodeError as e:
        print('JSON Error at line {}, col {}: {}'.format(e.lineno, e.colno, e.msg))
        # Print 3 lines before and after
        start = max(0, e.lineno - 5)
        end = min(len(lines), e.lineno + 2)
        for i in range(start, end):
            print('  [{}] {}'.format(i+1, lines[i].rstrip()[:100]))
