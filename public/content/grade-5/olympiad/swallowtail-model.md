# 燕尾模型

## 知识点卡片

:::story-card
### 生活小故事

小明在海边看到一群燕子在天空中飞翔，它们的尾巴像一把剪刀。

"老师，燕子的尾巴有什么数学秘密吗？"小明问。

老师笑着画了一个三角形ABC，在BC边上取一点D，连接AD。

"如果在AD上取一点O，连接BO并延长交AC于E，连接CO并延长交AB于F，你们看像什么？"

"像一只燕子！"小明说。

"对！这就是'燕尾模型'。"老师说，"在三角形中，燕尾有一个重要的面积性质。"

"S△AOB : S△AOC = BD : DC"

"也就是说，燕尾两个翅膀的面积比，等于燕尾底部被分成的两段之比！"

小明兴奋地说："这样只要知道底边的比，就能知道翅膀的面积比了！"
:::

:::concept-card
### 核心概念

**什么是燕尾模型**

在三角形ABC中，AD是BC边上的一条线段，O是AD上一点，连接BO延长交AC于E，连接CO延长交AB于F。

图形像燕子的尾巴，所以叫燕尾模型。

**核心结论**

1. **基本燕尾**：
   - S△AOB : S△AOC = BD : DC

2. **三个燕尾**（当三条线交于一点时）：
   - S△AOB : S△AOC = BD : DC
   - S△BOA : S△BOC = AF : FC
   - S△COA : S△COB = AE : EB

3. **塞瓦定理**（三条线共点的条件）：
   - (BD/DC) × (CE/EA) × (AF/FB) = 1

**推导**

△AOB和△AOC有相同的高（从A到BC的垂线）... 不对

正确推导：
- △AOB和△DOB同高，S△AOB : S△DOB = AO : OD
- △AOC和△DOC同高，S△AOC : S△DOC = AO : OD
- 所以 S△AOB : S△AOC = S△DOB : S△DOC = BD : DC

**应用**

- 已知底边比，求面积比
- 已知面积比，求底边比
- 证明三线共点
:::

:::example-card
### 典型例题

**例1：基础燕尾**
三角形ABC中，D是BC上一点，BD:DC = 2:3。AD上有一点O，连接BO并延长交AC于E。若S△AOB = 8，求S△AOC。

**解答：**
- S△AOB : S△AOC = BD : DC = 2 : 3
- 8 : S△AOC = 2 : 3
- S△AOC = 8 × 3/2 = 12
- 答：S△AOC = 12。

**例2：三个燕尾**
三角形ABC中，AD、BE、CF交于一点O。BD:DC = 2:1，CE:EA = 3:2。求AF:FB。

**解答：**
- 由塞瓦定理：(BD/DC) × (CE/EA) × (AF/FB) = 1
- (2/1) × (3/2) × (AF/FB) = 1
- 3 × (AF/FB) = 1
- AF/FB = 1/3
- 答：AF:FB = 1:3。

**例3：面积比求边长比**
三角形ABC中，AD、BE、CF交于一点O。S△AOB = 10，S△AOC = 15，S△BOC = 20。求BD:DC。

**解答：**
- S△AOB : S△AOC = BD : DC
- 10 : 15 = BD : DC
- BD : DC = 2 : 3
- 答：BD:DC = 2:3。

**例4：综合应用**
三角形ABC中，面积为60。D、E、F分别在BC、CA、AB上，AD、BE、CF交于O。BD:DC = 1:2，CE:EA = 1:1。求S△AOB。

**解答：**
- 由塞瓦定理求AF:FB
- (1/2) × (1/1) × (AF/FB) = 1
- AF/FB = 2，即 AF:FB = 2:1
- 设S△AOB = 2x，S△BOC = y，S△AOC = z
- S△AOB : S△AOC = BD : DC = 1 : 2
- 2x : z = 1 : 2，z = 4x
- S△AOB : S△BOC = AF : FC
- 先求S△AOC : S△BOC = AE : EB
- CE:EA = 1:1，所以 AE:EC = 1:1
- S△AOE : S△COE = ... 用另一种方法
- S△AOC : S△BOC = AE : EB（这里E在AC上，不是燕尾）
- 重新：S△AOC : S△BOC = AF : FB = 2 : 1（燕尾从C出发）
- z : y = 2 : 1，y = z/2 = 2x
- 总面积：2x + 2x + 4x = 8x = 60
- x = 7.5
- S△AOB = 2x = 15
- 答：S△AOB = 15。

**例5：证明共点**
三角形ABC中，D、E、F分别在BC、CA、AB上，且BD:DC = CE:EA = AF:FB = 1:2。证明AD、BE、CF交于一点。

**解答：**
- 由塞瓦定理的逆定理
- (BD/DC) × (CE/EA) × (AF/FB) = (1/2) × (1/2) × (1/2) = 1/8 ≠ 1
- 不共点！
- 若改为BD:DC = CE:EA = AF:FB = 1:1（中点）
- (1/1) × (1/1) × (1/1) = 1
- 共点（重心）
- 答：当比例为1:1时，三线共点于重心。
:::

:::variant-card
### 变式训练

**变式1：基础燕尾**
三角形ABC中，D在BC上，BD:DC = 3:2。AD上一点O，连接BO延长交AC于E。S△AOB = 12，求S△AOC。
<details>
<summary>点击查看解答</summary>

**解答：**
- S△AOB : S△AOC = BD : DC = 3 : 2
- 12 : S△AOC = 3 : 2
- S△AOC = 12 × 2/3 = 8
- 答：S△AOC = 8。
</details>

**变式2：塞瓦定理**
三角形ABC中，AD、BE、CF交于一点O。BD:DC = 3:1，CE:EA = 2:1。求AF:FB。
<details>
<summary>点击查看解答</summary>

**解答：**
- (3/1) × (2/1) × (AF/FB) = 1
- 6 × (AF/FB) = 1
- AF/FB = 1/6
- 答：AF:FB = 1:6。
</details>

**变式3：面积比**
三角形ABC中，AD、BE、CF交于O。S△AOB = 6，S△BOC = 9，S△AOC = 12。求BD:DC。
<details>
<summary>点击查看解答</summary>

**解答：**
- S△AOB : S△AOC = BD : DC
- 6 : 12 = BD : DC
- BD : DC = 1 : 2
- 答：BD:DC = 1:2。
</details>

**变式4：综合应用**
三角形ABC面积为120。D、E、F分别在BC、CA、AB上，AD、BE、CF交于O。BD:DC = 2:3，CE:EA = 1:2。求S△AOB、S△BOC、S△AOC。
<details>
<summary>点击查看解答</summary>

**解答：**
- 由塞瓦定理：(2/3) × (1/2) × (AF/FB) = 1
- AF/FB = 3，AF:FB = 3:1
- S△AOB : S△AOC = BD:DC = 2:3
- S△AOB : S△BOC = AF:FC
- S△AOC : S△BOC = AE:EB（需要求AE:EB）
- CE:EA = 1:2，所以 AE:AC = 2:3
- S△AOC : S△BOC = AF : FB = 3 : 1（从C出发的燕尾）
- 设S△BOC = x，S△AOC = 3x
- S△AOB : S△AOC = 2 : 3
- S△AOB = 2x
- 总面积：2x + x + 3x = 6x = 120
- x = 20
- S△AOB = 40，S△BOC = 20，S△AOC = 60
- 答：S△AOB = 40，S△BOC = 20，S△AOC = 60。
</details>
:::

:::mistake-card
### 常见错误

**错误1：燕尾方向搞反**
S△AOB : S△AOC = DC : BD。（错误）

**正确：** S△AOB : S△AOC = BD : DC。

**错误2：塞瓦定理顺序记错**
(BD/DC) × (CE/EA) × (AF/FB) = 1 记错顺序。

**正确：** 按顶点顺序B→C→A→B，即BD/DC × CE/EA × AF/FB = 1。

**错误3：混淆燕尾和等高模型**
燕尾和等高模型的条件混淆。

**正确：** 燕尾需要共线（O在AD上），等高模型需要同底或同高。

**错误4：面积比和边长比直接等同**
认为面积比等于边长比。

**正确：** 燕尾中面积比等于底边比，但不是所有情况都如此。
:::

:::parent-child-card
### 亲子互动

**给家长的辅导建议：**

1. **认识燕尾模型**
   - 画三角形和燕尾
   - 理解结构特点

2. **掌握核心结论**
   - 翅膀面积比 = 底边比
   - 塞瓦定理

3. **灵活运用**
   - 已知面积比求边长比
   - 已知边长比求面积比

4. **注意条件**
   - 三线必须交于一点
   - 或至少知道O在AD上

**亲子小游戏：**

**"画燕子"**
- 画三角形
- 画出燕尾
- 标出面积比

**"燕尾拼图"**
- 剪出不同面积的三角形
- 拼成燕尾模型
- 验证比例关系

**生活中的问题：**
- 三角形地块被三条路分成六块，已知一些面积，求其他面积
:::
