const fs = require('fs');
const s = fs.readFileSync('C:/Users/Anon/.gemini/antigravity/scratch/KBLauncher/site.html', 'utf8');

const regex = /.{0,40}официальн.{0,40}/gi;
let m;
while ((m = regex.exec(s)) !== null) {
  console.log(m[0].trim());
}
