
# -*- coding: utf-8 -*-
import os
import re
import json

base_dir = r'E:\internal_safe\study-math'
bank_dir = os.path.join(base_dir, r'public\content\question-bank\g6')

problem_files = {
    'g6-coloring-problem.json': {
        'topicName': '抽屉原理与染色问题',
        'category': '数学思维'
    },
    'g6-complex-engineering.json': {
        'topicName': '工程问题',
        'category': '应用题'
    },
    'g6-indeterminate-advanced.json': {
        'topicName': '不定方程',
        'category': '数论'
    },
    'g6-number-system.json': {
        'topicName': '数的进制',
        'category': '数论'
    },
    'g6-ratio-travel.json': {
        'topicName': '比例行程',
        'category': '应用题'
    },
    'g6-winning-strategy.json': {
        'topicName': '最优策略',
        'category': '数学思维'
    }
}

for fname, info in problem_files.items():
    fpath = os.path.join(bank_dir, fname)
    
    # Read raw content
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix 1: remove closing }, after "correction" field (keeping the errorLayer inside the object)
    # Pattern: "correction": "something"}, "errorLayer" -> "correction": "something", "errorLayer"
    fixed = re.sub(r'("correction":\s*"[^"]*")\},\s*("errorLayer")', r'\1, \2', content)
    
    # Fix 2: Handle case where }, appears after a different field name (not correction)
    # e.g.: "correction": "xx"},  (should just be "correction": "xx",)
    # Try to parse it again
    try:
        data = json.loads(fixed)
        print('Parsed: {}'.format(fname))
    except Exception as e:
        print('First fix failed for {}: {}'.format(fname, e))
        # Alternative fix: replace entire commonMistakes objects with simple arrays
        # Find all commonMistakes arrays and rewrite them
        fixed2 = re.sub(
            r'"commonMistakes":\s*\[\s*\{[^}]*\}\s*\]',
            lambda m: '"commonMistakes": [["常见错误"]]', 
            content
        )
        try:
            data = json.loads(fixed2)
            fixed = fixed2
            print('Alternative parse: {}'.format(fname))
        except Exception as e2:
            print('Alternative failed too: {}'.format(e2))
            # Most aggressive fix - find the commonMistakes line by line
            # and replace everything in it
            lines = content.split('\n')
            new_lines = []
            for line in lines:
                if '"commonMistakes": [' in line:
                    # Replace entire commonMistakes line
                    new_lines.append('      "commonMistakes": ["见解析过程"],')
                elif '"source": {' in line:
                    new_lines.append('      "source": "六年级奥数",')
                elif '"type": "奥数"' in line and not line.strip().startswith('"type"'):
                    # This might be part of the source object
                    continue
                elif '"year":' in line and ('},' in line or '}' in line):
                    # This is the closing of source object
                    continue
                elif '"type": ' in line and ('",' in line or '"}' in line):
                    # Probably inside source object
                    continue
                else:
                    new_lines.append(line)
            
            content2 = '\n'.join(new_lines)
            try:
                data = json.loads(content2)
                fixed = content2
                print('Line-by-line fix: {}'.format(fname))
            except Exception as e3:
                print('COMPLETE FAIL: {}'.format(e3))
                continue
    
    # Now convert to correct format
    new_questions = []
    for q in data['questions']:
        new_q = {}
        new_q['id'] = q.get('id', '')
        new_q['type'] = q.get('type', 'input')
        new_q['difficulty'] = q.get('difficulty', 3)
        
        # Difficulty label
        if new_q['difficulty'] == 1: new_q['difficultyLabel'] = '入门'
        elif new_q['difficulty'] == 2: new_q['difficultyLabel'] = '基础'
        elif new_q['difficulty'] == 3: new_q['difficultyLabel'] = '进阶'
        elif new_q['difficulty'] == 4: new_q['difficultyLabel'] = '拔高'
        else: new_q['difficultyLabel'] = '竞赛'
        
        new_q['stem'] = q.get('stem', '')
        new_q['image'] = ''
        new_q['options'] = q.get('options', [])
        
        # Answer normalization
        ans = q.get('answer', '')
        if isinstance(ans, int) and new_q['type'] == 'choice':
            new_q['answer'] = ans
            new_q['acceptableAnswers'] = [ans]
        else:
            new_q['answer'] = str(ans) if ans is not None else ''
            acc = q.get('acceptableAnswers', [])
            new_q['acceptableAnswers'] = [str(x) for x in acc] if acc else [str(ans)] if ans else []
        
        # Solution
        sol = q.get('solution', '')
        if isinstance(sol, list):
            new_q['solution'] = '\n'.join(sol)
        else:
            new_q['solution'] = str(sol) if sol else ''
        
        new_q['hints'] = q.get('hints', [])
        
        # commonMistakes
        cm = q.get('commonMistakes', [])
        if isinstance(cm, list):
            result_cm = []
            for c in cm:
                if isinstance(c, dict):
                    if 'mistake' in c:
                        result_cm.append(str(c['mistake']))
                else:
                    result_cm.append(str(c))
            new_q['commonMistakes'] = result_cm[:3] if result_cm else ['需仔细审题']
        else:
            new_q['commonMistakes'] = ['需仔细审题']
        
        # Source
        src = q.get('source', '')
        if isinstance(src, dict):
            new_q['source'] = src.get('name', src.get('type', '六年级奥数'))
        else:
            new_q['source'] = str(src) if src else '六年级奥数'
        
        new_q['knowledgePoints'] = q.get('knowledgePoints', [])
        new_q['estimatedTime'] = q.get('estimatedTime', 180)
        
        # irtParams
        irt = q.get('irtParams', {})
        if isinstance(irt, dict):
            diff = irt.get('difficulty', irt.get('b', 0))
            discr = irt.get('discrimination', irt.get('a', 0.8))
            guess = irt.get('guessing', irt.get('c', 0.25))
        else:
            diff, discr, guess = 0, 0.8, 0.25
        new_q['irtParams'] = {"difficulty": diff, "discrimination": discr, "guessing": guess}
        
        new_q['tags'] = q.get('tags', [])
        
        new_questions.append(new_q)
    
    # Write fixed file
    new_data = {
        'topicId': data.get('topicId', fname[:-5]),
        'topicName': info['topicName'],
        'grade': 6,
        'category': info['category'],
        'version': '1.0',
        'questions': new_questions
    }
    
    with open(fpath, 'w', encoding='utf-8') as f:
        json.dump(new_data, f, ensure_ascii=False, indent=2)
    
    print('Fixed: {} - {} questions'.format(fname, len(new_questions)))

print()
print('All files processed!')
