const fs = require('fs');
const js = fs.readFileSync('C:/Users/Anon/.gemini/antigravity/scratch/KBLauncher/site.js', 'utf8');
const idx2 = js.indexOf('// 2. Liquid Glass');
console.log(JSON.stringify(js.substring(idx2 - 60, idx2 + 60)));
