
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
    
    # Fix JSON structure: the issue is commonMistakes has misplaced ]
    # Let's try to parse by replacing the problematic pattern
    # Pattern: }, "errorLayer": "..."}]  ->  should be  , "errorLayer": "..."}]
    
    # Actually let me just fix the JSON with regex
    # The error pattern is: "correction": "..."], "errorLayer": "..."}]
    # This should be: "correction": "...", "errorLayer": "..."}]
    
    fixed = re.sub(r'"correction":\s*"([^"]*)"\],\s*"errorLayer"', 
                   r'"correction": "\1", "errorLayer"', content)
    
    # Now try to parse
    try:
        data = json.loads(fixed)
        print('Parsed: {}'.format(fname))
    except Exception as e:
        print('Failed {}: {}'.format(fname, e))
        continue
    
    # Now convert to correct format
    new_questions = []
    for q in data['questions']:
        new_q = {}
        new_q['id'] = q.get('id', '')
        new_q['type'] = q.get('type', 'input')
        new_q['difficulty'] = q.get('difficulty', 3)
        
        # Difficulty label conversion
        if new_q['difficulty'] == 1: new_q['difficultyLabel'] = '入门'
        elif new_q['difficulty'] == 2: new_q['difficultyLabel'] = '基础'
        elif new_q['difficulty'] == 3: new_q['difficultyLabel'] = '进阶'
        elif new_q['difficulty'] == 4: new_q['difficultyLabel'] = '拔高'
        else: new_q['difficultyLabel'] = '竞赛'
        
        new_q['stem'] = q.get('stem', '')
        new_q['image'] = ''  # SVG not used in simple format
        new_q['options'] = q.get('options', [])
        
        # Answer - normalize
        ans = q.get('answer', '')
        if isinstance(ans, int) and new_q['type'] == 'choice':
            new_q['answer'] = ans
            new_q['acceptableAnswers'] = [ans]
        else:
            new_q['answer'] = str(ans) if ans is not None else ''
            acc = q.get('acceptableAnswers', [])
            new_q['acceptableAnswers'] = [str(x) for x in acc] if acc else [str(ans)] if ans else []
        
        # Solution: array to string
        sol = q.get('solution', '')
        if isinstance(sol, list):
            new_q['solution'] = '\n'.join(sol)
        else:
            new_q['solution'] = str(sol) if sol else ''
        
        new_q['hints'] = q.get('hints', [])
        
        # commonMistakes: objects to strings
        cm = q.get('commonMistakes', [])
        if cm and isinstance(cm, list) and cm and isinstance(cm[0], dict):
            new_q['commonMistakes'] = [c.get('mistake', str(c)) for c in cm[:3] if isinstance(c, dict)]
        elif isinstance(cm, list):
            new_q['commonMistakes'] = [str(x) for x in cm]
        else:
            new_q['commonMistakes'] = []
        
        # Source: object to string
        src = q.get('source', '')
        if isinstance(src, dict):
            new_q['source'] = src.get('name', src.get('type', ''))
        else:
            new_q['source'] = str(src) if src else '六年级奥数'
        
        new_q['knowledgePoints'] = q.get('knowledgePoints', [])
        new_q['estimatedTime'] = q.get('estimatedTime', 180)
        
        # irtParams: use correct format
        irt = q.get('irtParams', {})
        diff = irt.get('difficulty', irt.get('b', 0)) if isinstance(irt, dict) else 0
        discr = irt.get('discrimination', irt.get('a', 0.8)) if isinstance(irt, dict) else 0.8
        guess = irt.get('guessing', irt.get('c', 0.25)) if isinstance(irt, dict) else 0.25
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
