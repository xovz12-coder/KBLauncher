const fs = require('fs');
const s = fs.readFileSync('C:/Users/Anon/.gemini/antigravity/scratch/KBLauncher/site.html', 'utf8');

const start = s.indexOf('<div class="counter-hero-card">');
const end = s.indexOf('</div>\n    </div>\n  </section>', start);
console.log('--- COUNTER CARD HTML ---');
console.log(s.substring(start, start + 3000));

console.log('--- SITE.JS COUNTER CODE ---');
const js = fs.readFileSync('C:/Users/Anon/.gemini/antigravity/scratch/KBLauncher/site.js', 'utf8');
const jsIdx = js.indexOf('hero-download-counter');
if (jsIdx !== -1) {
  console.log(js.substring(jsIdx - 200, jsIdx + 1200));
}
