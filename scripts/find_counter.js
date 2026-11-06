const fs = require('fs');
const s = fs.readFileSync('C:/Users/Anon/.gemini/antigravity/scratch/KBLauncher/site.html', 'utf8');

const queries = ['counter-hero-card', 'Живой счётчик', 'Официальная статистика', 'Игроков сейчас онлайн', 'id="counter"'];
queries.forEach(q => {
  const idx = s.indexOf(q);
  console.log(q, idx);
  if (idx !== -1) {
    console.log(s.substring(idx - 100, idx + 400));
    console.log('-----------------');
  }
});
