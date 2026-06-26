
import json
import os
import glob

base_dir = r'E:\internal_safe\study-math'
exam_dir = os.path.join(base_dir, r'public\content\question-bank\exam\g6')

print('检查g6目录下所有JSON文件:')
all_ok = True
total_questions = 0

files = sorted(glob.glob(os.path.join(exam_dir, '*.json')))
for fpath in files:
    fname = os.path.basename(fpath)
    try:
        with open(fpath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        qs = len(data.get('questions', []))
        print(f'  OK: {fname} - {qs} questions')
        total_questions += qs
    except Exception as e:
        print(f'  ERROR: {fname} - {e}')
        all_ok = False

print(f'Total: {len(files)} papers, {total_questions} questions')
print(f'All valid: {all_ok}')
