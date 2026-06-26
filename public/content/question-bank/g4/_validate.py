import json, os

base_dir = r"E:\internal_safe\study-math\public\content\question-bank\g4"

topics_basic = [
    ("g4-large-number", "大数的认识"),
    ("g4-operation-laws", "运算定律"),
    ("g4-decimal-multiply", "小数乘法"),
    ("g4-parallel-vertical", "平行与垂直"),
    ("g4-triangle-classify", "三角形分类"),
    ("g4-bar-chart", "条形统计图"),
    ("g4-average", "平均数"),
]

topics_olympiad = [
    ("g4-new-operation", "新定义运算"),
    ("g4-gcd-lcm", "最大公因数最小公倍数"),
    ("g4-prime-composite", "质数与合数"),
    ("g4-prime-factorization", "分解质因数"),
    ("g4-pigeonhole", "抽屉原理"),
    ("g4-logic-advanced", "逻辑推理进阶"),
    ("g4-half-model", "一半模型"),
    ("g4-cut-paste-method", "割补法"),
    ("g4-inclusion-exclusion", "容斥原理"),
    ("g4-angle-calc", "角度计算"),
    ("g4-profit-loss-problem", "盈亏问题进阶"),
    ("g4-chicken-rabbit", "鸡兔同笼"),
    ("g4-page-number", "页码问题"),
    ("g4-matrix-problem", "方阵问题"),
    ("g4-equal-area", "等积变换"),
    ("g4-divisibility", "整除性"),
    ("g4-decimal-clever-calc", "小数巧算"),
    ("g4-profit-loss", "盈亏问题基础"),
]

total_q = 0
errors = []

print("=" * 60)
print("题库验证与统计")
print("=" * 60)

print("\n【基础知识点】7个")
for tid, tname in topics_basic:
    fp = os.path.join(base_dir, tid + ".json")
    try:
        with open(fp, "r", encoding="utf-8") as f:
            d = json.load(f)
        n = d["totalQuestions"]
        assert len(d["questions"]) == n
        for q in d["questions"]:
            assert all(k in q for k in ["id","type","difficulty","stem","answer","solution","knowledgePoints"])
        total_q += n
        print(f"  ✓ {tid:25s} | {tname:12s} | {n}题")
    except Exception as e:
        errors.append(f"{tid}: {e}")
        print(f"  ✗ {tid}: {e}")

print("\n【奥数知识点】18个")
for tid, tname in topics_olympiad:
    fp = os.path.join(base_dir, tid + ".json")
    try:
        with open(fp, "r", encoding="utf-8") as f:
            d = json.load(f)
        n = d["totalQuestions"]
        assert len(d["questions"]) == n
        for q in d["questions"]:
            assert all(k in q for k in ["id","type","difficulty","stem","answer","solution","knowledgePoints"])
        total_q += n
        print(f"  ✓ {tid:25s} | {tname:12s} | {n}题")
    except Exception as e:
        errors.append(f"{tid}: {e}")
        print(f"  ✗ {tid}: {e}")

print("\n" + "=" * 60)
print(f"文件总数: {len(topics_basic) + len(topics_olympiad)} 个")
print(f"题目总数: {total_q} 题")
print(f"基础: 7个知识点 × 15题 = {7*15}题")
print(f"奥数: 18个知识点 × 18题 = {18*18}题")
if errors:
    print(f"错误: {len(errors)} 个")
    for e in errors:
        print(f"  - {e}")
else:
    print("错误: 0 个 (全部通过验证)")
print("=" * 60)
