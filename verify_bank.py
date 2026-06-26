import json, os

OUT = r"E:\internal_safe\study-math\public\content\question-bank\g3"

# 期望的题数分布
expected = {
  # 基础 15题
  "g3-multi-digit-multiply": 15,
  "g3-division-vertical": 15,
  "g3-fraction-intro": 15,
  "g3-perimeter-area": 15,
  "g3-year-month-day": 15,
  "g3-decimal-intro": 15,
  # 奥数 18题
  "g3-arithmetic-sequence": 18,
  "g3-diff-multiple": 18,
  "g3-sum-diff": 18,
  "g3-planting-trees": 18,
  "g3-period-problem": 18,
  "g3-restore-problem": 18,
  "g3-clever-perimeter": 18,
  "g3-area-basic": 18,
  "g3-odd-even": 15,
  "g3-vertical-puzzle": 18,
  "g3-add-multiply-principle": 18,
  "g3-plant-problem": 18,
  # 已存在
  "g3-sum-multiple": None  # 跳过检查
}

required_keys = {"topicId", "topicName", "grade", "category", "version", "totalQuestions", "questions"}
question_keys = {"id", "type", "difficulty", "stem", "image", "options", "answer", "acceptableAnswers", "solution", "hints", "commonMistakes", "source", "knowledgePoints", "estimatedTime", "irtParams", "tags"}

print("="*70)
print("题库文件验证报告")
print("="*70)
total_questions = 0
total_files = 0
basic_q = 0
olympiad_q = 0
errors = []

for topic_id, exp_count in expected.items():
    fname = os.path.join(OUT, topic_id + ".json")
    if not os.path.exists(fname):
        errors.append(f"✗ 缺失文件: {topic_id}.json")
        continue
    total_files += 1
    try:
        with open(fname, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        errors.append(f"✗ JSON解析失败: {topic_id}.json - {e}")
        continue

    missing_top = required_keys - set(data.keys())
    if missing_top:
        errors.append(f"✗ {topic_id}.json 顶层缺少字段: {missing_top}")

    category = data.get("category", "?")
    topic_name = data.get("topicName", "?")
    version = data.get("version", "?")
    grade = data.get("grade", "?")
    qs = data.get("questions", [])
    q_count = len(qs)
    total_questions += q_count
    if category == "basic":
        basic_q += q_count
    elif category == "olympiad":
        olympiad_q += q_count

    status = "✓"
    if exp_count is not None and q_count != exp_count:
        errors.append(f"✗ {topic_id}.json 题数期望={exp_count}, 实际={q_count}")
        status = "!"

    # 检查第一题的结构
    if q_count > 0:
        q = qs[0]
        missing_q = question_keys - set(q.keys())
        if missing_q:
            errors.append(f"✗ {topic_id}.json 题目缺少字段: {missing_q}")

    print(f"  {status} {topic_id:<32} | {topic_name:<15} | 类别={category:<10} | 题数={q_count} | 版本={version}")

print("="*70)
print(f"  文件总数: {total_files}")
print(f"  题目总数: {total_questions}")
print(f"    基础题目: {basic_q}")
print(f"    奥数题目: {olympiad_q}")
print("="*70)

if errors:
    print(f"\n发现 {len(errors)} 个问题:")
    for e in errors:
        print(f"  {e}")
else:
    print("\n✓ 所有文件结构验证通过!")
