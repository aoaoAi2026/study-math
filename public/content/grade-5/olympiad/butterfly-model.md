# 蝴蝶模型

## 知识点卡片

:::story-card
### 生活小故事

小明在几何兴趣课上，老师画了一个四边形ABCD，对角线AC和BD相交于点O。

"你们看，这个图形像什么？"老师问。

"像一只蝴蝶！"同学们异口同声。

"对！这就是'蝴蝶模型'。"老师说，"在任意四边形中，对角线分成的四个三角形，有一个重要的面积关系。"

"△AOB的面积 × △COD的面积 = △AOD的面积 × △BOC的面积"

"而且在梯形中，这个模型更神奇：翅膀相等！"

"也就是说，在梯形中，△ABD和△ABC面积相等，所以△AOD和△BOC面积也相等！"

小明兴奋地说："这就是蝴蝶模型的秘密！"
:::

:::concept-card
### 核心概念

**任意四边形中的蝴蝶模型**

在四边形ABCD中，对角线AC、BD交于点O：
- S△AOB × S△COD = S△AOD × S△BOC

**梯形中的蝴蝶模型**

在梯形ABCD中（AD∥BC），对角线AC、BD交于点O：

1. **翅膀相等**：S△AOD = S△BOC
2. **面积比例**：
   - S△AOB : S△AOD = OB : OD
   - S△AOB : S△BOC = OA : OC
3. **若上底:下底 = a:b**，则：
   - S△AOD : S△AOB : S△BOC : S△COD = a² : ab : ab : b²

**重要结论**

- 梯形中，两腰上的三角形面积相等（翅膀相等）
- 这是因为△ABD和△ABC同底等高

**应用**

- 已知部分三角形面积，求其他三角形面积
- 已知边长比，求面积比
:::

:::example-card
### 典型例题

**例1：梯形蝴蝶模型**
梯形ABCD中，AD∥BC，AD:BC = 1:3。对角线交于O。若S△AOD = 2，求其他三个三角形面积。

**解答：**
- 面积比 = a² : ab : ab : b² = 1 : 3 : 3 : 9
- S△AOD = 2 对应1份
- S△AOB = S△BOC = 2 × 3 = 6
- S△COD = 2 × 9 = 18
- 答：S△AOB = 6，S△BOC = 6，S△COD = 18。

**例2：翅膀相等**
梯形ABCD中，AD∥BC，S△ABD = 20，S△BOC = 8。求S△AOD。

**解答：**
- △ABD和△ABC同底等高，面积相等
- S△ABC = S△ABD = 20
- S△AOB = S△ABC - S△BOC = 20 - 8 = 12
- S△AOD = S△ABD - S△AOB = 20 - 12 = 8
- 答：S△AOD = 8。

**例3：任意四边形**
四边形ABCD中，对角线交于O。S△AOB = 6，S△BOC = 9，S△COD = 12。求S△AOD。

**解答：**
- S△AOB × S△COD = S△AOD × S△BOC
- 6 × 12 = S△AOD × 9
- S△AOD = 72 ÷ 9 = 8
- 答：S△AOD = 8。

**例4：综合应用**
梯形ABCD中，AD∥BC，AD = 3，BC = 5。S△AOD = 9。求梯形面积。

**解答：**
- AD:BC = 3:5
- 面积比 = 9 : 15 : 15 : 25
- S△AOD = 9 对应9份，1份 = 1
- S△AOB = 15，S△BOC = 15，S△COD = 25
- 梯形面积 = 9 + 15 + 15 + 25 = 64
- 答：梯形面积是64。

**例5：求线段比**
梯形ABCD中，AD∥BC，对角线交于O。S△AOD = 4，S△AOB = 6。求AO:OC。

**解答：**
- △AOD和△COD同高，面积比 = AO:OC
- △AOB和△BOC同高，面积比 = AO:OC
- S△AOD : S△COD = AO : OC
- S△AOB : S△BOC = AO : OC
- 所以 S△AOD : S△COD = S△AOB : S△BOC
- 先求S△BOC = S△AOD = 4（翅膀相等）
- 不对，这里不是梯形... 重新分析
- △AOD和△AOB同高（从D和B到AC的距离）
- S△AOD : S△AOB = OD : OB = 4 : 6 = 2 : 3
- △COD和△BOC同高
- S△COD : S△BOC = OD : OB = 2 : 3
- 又 S△AOD × S△BOC = S△AOB × S△COD
- 4 × S△BOC = 6 × S△COD
- S△BOC : S△COD = 6 : 4 = 3 : 2
- 结合上面，S△COD : S△BOC = 2 : 3
- 设S△COD = 2k，S△BOC = 3k
- 验证：4 × 3k = 6 × 2k，12k = 12k ✓
- AO:OC = S△AOD : S△COD = 4 : 2k = 2 : k
- 又 AO:OC = S△AOB : S△BOC = 6 : 3k = 2 : k
- 需要更多信息... 若AD∥BC，则S△BOC = S△AOD = 4
- 则 4 × 4 = 6 × S△COD，S△COD = 16/6 = 8/3
- AO:OC = S△AOD : S△COD = 4 : (8/3) = 12 : 8 = 3 : 2
- 答：AO:OC = 3:2。
:::

:::variant-card
### 变式训练

**变式1：基础蝴蝶模型**
梯形ABCD中，AD∥BC，AD:BC = 2:3。S△AOD = 8。求S△COD。
<details>
<summary>点击查看解答</summary>

**解答：**
- 面积比 = a² : ab : ab : b² = 4 : 6 : 6 : 9
- S△AOD = 8 对应4份，1份 = 2
- S△COD = 9 × 2 = 18
- 答：S△COD = 18。
</details>

**变式2：翅膀相等**
梯形ABCD中，AD∥BC，S△ABC = 30，S△AOD = 10。求S△BOC。
<details>
<summary>点击查看解答</summary>

**解答：**
- S△ABD = S△ABC = 30（同底等高）
- S△AOB = S△ABD - S△AOD = 30 - 10 = 20
- S△BOC = S△ABC - S△AOB = 30 - 20 = 10
- 或利用翅膀相等：S△BOC = S△AOD = 10
- 答：S△BOC = 10。
</details>

**变式3：任意四边形**
四边形ABCD中，对角线交于O。S△AOB = 4，S△AOD = 6，S△BOC = 8。求S△COD。
<details>
<summary>点击查看解答</summary>

**解答：**
- S△AOB × S△COD = S△AOD × S△BOC
- 4 × S△COD = 6 × 8 = 48
- S△COD = 12
- 答：S△COD = 12。
</details>

**变式4：综合应用**
梯形ABCD中，AD∥BC，AD = 2，BC = 5，高为6。对角线交于O。求S△AOD。
<details>
<summary>点击查看解答</summary>

**解答：**
- 梯形面积 = (2+5) × 6 ÷ 2 = 21
- AD:BC = 2:5
- 面积比 = 4 : 10 : 10 : 25
- 总份数 = 4 + 10 + 10 + 25 = 49
- S△AOD = 21 × 4/49 = 84/49 = 12/7
- 答：S△AOD = 12/7。
</details>
:::

:::mistake-card
### 常见错误

**错误1：任意四边形用梯形结论**
在任意四边形中用"翅膀相等"。（错误）

**正确：** "翅膀相等"只在梯形中成立。

**错误2：面积比记错**
梯形中面积比记成 a:b:c:d。（错误）

**正确：** 面积比是 a²:ab:ab:b²。

**错误3：混淆对应关系**
上底对应哪个三角形搞混。

**正确：** 上底两端的三角形对应a²，下底两端的对应b²。

**错误4：忘记同底等高**
不知道△ABD和△ABC面积相等。

**正确：** 梯形中，两对角线分成的两腰三角形面积相等。
:::

:::parent-child-card
### 亲子互动

**给家长的辅导建议：**

1. **认识蝴蝶模型**
   - 画四边形和梯形
   - 标出四个三角形

2. **掌握梯形结论**
   - 翅膀相等
   - 面积比 = a²:ab:ab:b²

3. **掌握任意四边形结论**
   - 对角三角形面积积相等

4. **灵活运用**
   - 已知面积求边长比
   - 已知边长比求面积

**亲子小游戏：**

**"画蝴蝶"**
- 画各种梯形
- 标出四个三角形面积
- 验证蝴蝶模型

**"面积拼图"**
- 剪出三角形
- 拼成梯形
- 验证面积关系

**生活中的问题：**
- 梯形花坛被对角线小路分成四块，已知一块面积，求其他块
:::
