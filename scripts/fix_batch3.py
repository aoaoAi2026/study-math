import re

fp = r'E:\internal_safe\study-math\scripts\gen-bank-batch3.py'
with open(fp, 'r', encoding='utf-8') as f:
    content = f.read()

# 把所有出现的 'x' 改为 x （去掉内层引号）
# 模式: 非', 然后 '数字/文字', 然后非'
# 更简单的方法：把所有 '1' 这种改为用双引号或者去掉引号
# 实际上我们需要的是把字符串内的 '数字' 改为 数字 或者用其他方式表示

# 直接把问题行中的常见模式替换
# "选项中'2'是正确数字之一" -> "选项中2是正确数字之一"
content = content.replace("选项中'2'是正确数字之一。综合答案选 2（序号1）", "选项中2是正确数字之一。综合答案选 2（序号1）")

with open(fp, 'w', encoding='utf-8') as f:
    f.write(content)

print('修复完成')
