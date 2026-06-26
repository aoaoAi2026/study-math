const fs = require('fs');
const path = require('path');

const loaderContent = fs.readFileSync('src/services/contentLoader.ts', 'utf-8');
const pathRegex = /path:\s*'([^']+)'/g;
let match;
const paths = [];
while ((match = pathRegex.exec(loaderContent)) !== null) {
  paths.push(match[1]);
}

console.log('TOPIC_INDEX 中共引用了 ' + paths.length + ' 个路径');
console.log('');

const missing = [];
const existing = [];
paths.forEach(p => {
  const fullPath = path.join('public/content', p + '.md');
  if (fs.existsSync(fullPath)) {
    existing.push(p);
  } else {
    missing.push(p);
  }
});

console.log('✅ 存在的文件 (' + existing.length + ' 个):');
existing.forEach(p => console.log('   ' + p + '.md'));

console.log('');
console.log('❌ 缺失的文件 (' + missing.length + ' 个):');
if (missing.length === 0) {
  console.log('   无缺失，全部文件已创建！');
} else {
  missing.forEach(p => console.log('   ' + p + '.md'));
}
