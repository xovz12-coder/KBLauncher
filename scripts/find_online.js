const fs = require('fs');
const path = require('path');

const files = ['site.html', 'site.css', 'site.js'];
files.forEach(file => {
  const p = path.join('C:/Users/Anon/.gemini/antigravity/scratch/KBLauncher', file);
  const content = fs.readFileSync(p, 'utf8');
  const matches = [];
  const regex = /.{0,30}(онлайн|online).{0,30}/gi;
  let m;
  while ((m = regex.exec(content)) !== null) {
    matches.push(m[0].trim());
  }
  console.log(`=== ${file} (${matches.length} matches) ===`);
  matches.forEach(m => console.log('  ', m));
});
