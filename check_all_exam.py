
import json
import os
import glob

base_dir = r'E:\internal_safe\study-math'
exam_dir = os.path.join(base_dir, r'public\content\question-bank\exam')

print('检查exam目录下所有JSON文件:')
all_ok = True
total_papers = 0
total_questions = 0
error_files = []

for root, dirs, files in os.walk(exam_dir):
    for fname in files:
        if fname.endswith('.json'):
            fpath = os.path.join(root, fname)
            relpath = os.path.relpath(fpath, base_dir)
            try:
                with open(fpath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                qs = len(data.get('questions', []))
                grade = os.path.basename(root)
                print(f'  OK: {grade}/{fname} - {qs} questions')
                total_papers += 1
                total_questions += qs
            except Exception as e:
                print(f'  ERROR: {fname} - {e}')
                error_files.append(fpath)
                all_ok = False

print(f'\n总计: {total_papers} 份试卷, {total_questions} 道题')
print(f'全部有效: {all_ok}')
if error_files:
    print('\n有问题的文件:')
    for f in error_files:
        print(f'  {f}')
