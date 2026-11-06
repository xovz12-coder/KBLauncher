const fs = require('fs');
const path = require('path');
const s = fs.readFileSync('C:/Users/Anon/.gemini/antigravity/scratch/KBLauncher/site.html', 'utf8');
const m = s.match(/<section id="counter"[\s\S]*?<\/section>/);
if (m) {
  console.log(m[0]);
} else {
  console.log('Searching for 128...');
  const idx = s.indexOf('128');
  if (idx !== -1) {
    console.log(s.substring(idx - 300, idx + 600));
  } else {
    console.log('Not found');
  }
}
