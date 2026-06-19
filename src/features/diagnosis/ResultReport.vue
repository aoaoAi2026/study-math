<template>
  <div class="r">
    <button class="back" onclick="history.back()">← 返回</button>
    <div class="card">
      <h1>🎓 诊断结果</h1>
      <p>请完成诊断测试后查看详细结果。</p>
      <button class="btn btn-primary" onclick="location.hash='#/diagnosis'">去做诊断</button>
    </div>
  </div>
</template>

<style scoped>
.r { max-width: 700px; margin: 0 auto; padding: 16px; text-align: center; }
.back { background: none; border: none; color: #6B7785; font-size: 14px; cursor: pointer; display: block; margin-bottom: 8px; text-align: left; }
.card { background: #fff; border-radius: 18px; padding: 40px 24px; box-shadow: 0 2px 10px rgba(0,0,0,.05); }
.card h1 { font-size: 22px; color: #2C3E50; margin-bottom: 10px; }
.card p { color: #6B7785; margin-bottom: 20px; }
</style>
