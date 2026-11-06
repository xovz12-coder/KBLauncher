const fs = require('fs');
const js = fs.readFileSync('C:/Users/Anon/.gemini/antigravity/scratch/KBLauncher/site.js', 'utf8');

const idx1 = js.indexOf('// 1. Live Download Counter System');
const idx2 = js.indexOf('// 2. Liquid Glass');
console.log('idx1:', idx1, 'idx2:', idx2);
if (idx1 !== -1) {
  console.log(js.substring(idx1, idx1 + 300));
}
