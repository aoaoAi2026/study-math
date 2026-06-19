<template>
  <div class="w"><button class="back" onclick="history.back()">← 返回</button>
    <div class="card"><h1>📈 学习报告</h1><p>每周学习进度与掌握趋势。</p></div>
  </div>
</template>
<style scoped>
.w { max-width: 800px; margin: 0 auto; padding: 16px; }
.back { background: none; border: none; color: #6B7785; font-size: 14px; cursor: pointer; display: block; margin-bottom: 8px; }
.card { background: #fff; border-radius: 18px; padding: 32px 24px; box-shadow: 0 2px 10px rgba(0,0,0,.05); text-align: center; }
.card h1 { color: #2C3E50; margin-bottom: 10px; }
.card p { color: #6B7785; }
</style>
