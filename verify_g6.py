
# -*- coding: utf-8 -*-
import os
import json

base_dir = r'E:\internal_safe\study-math'
bank_dir = os.path.join(base_dir, r'public\content\question-bank\g6')

print('=== Verifying all g6/*.json files ===')
all_ok = True

for fname in sorted(os.listdir(bank_dir)):
    if not fname.endswith('.json'):
        continue
    fpath = os.path.join(bank_dir, fname)
    try:
        with open(fpath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        qs = data.get('questions', [])
        print('  OK: {} - {} questions'.format(fname, len(qs)))
    except Exception as e:
        print('  ERROR: {} - {}'.format(fname, str(e)))
        all_ok = False

print()
if all_ok:
    print('All g6 files are valid JSON!')
else:
    print('SOME FILES HAVE ERRORS!')
