const fs = require('fs');
const path = require('path');

const projectDir = 'C:\\Users\\Anon\\.gemini\\antigravity\\scratch\\KBLauncher';
const desktopDir = 'C:\\Users\\Anon\\Desktop\\KBLauncher-Website';

let js = fs.readFileSync(path.join(projectDir, 'site.js'), 'utf8');

const startMarker = '// ==========================================\n// 1. Live Download Counter System';
const startMarkerCRLF = '// ==========================================\r\n// 1. Live Download Counter System';
const endMarker = '// ==========================================\n// 2. Liquid Glass';
const endMarkerCRLF = '// ==========================================\r\n// 2. Liquid Glass';

let startIdx = js.indexOf(startMarker);
if (startIdx === -1) startIdx = js.indexOf(startMarkerCRLF);

let endIdx = js.indexOf(endMarker);
if (endIdx === -1) endIdx = js.indexOf(endMarkerCRLF);

console.log('startIdx:', startIdx, 'endIdx:', endIdx);

const newCounterCode = `// ==========================================
// 1. Live Download Counter System (Статистика нашего лаунчера)
// ==========================================
const BASE_DOWNLOADS = 2480;
let storedCount = parseInt(localStorage.getItem('kbl_downloads_count'), 10);
// Reset old large mock values if present
if (!storedCount || storedCount > 50000) {
  storedCount = BASE_DOWNLOADS;
  localStorage.setItem('kbl_downloads_count', storedCount);
}
let currentDownloads = storedCount;

const CITIES = [
  'Москвы', 'Санкт-Петербурга', 'Казани', 'Минска', 'Новосибирска',
  'Екатеринбурга', 'Нижнего Новгорода', 'Краснодара', 'Самары', 'Уфы',
  'Владивостока', 'Алматы', 'Ташкента', 'Челябинска', 'Ростова-на-Дону'
];

function initDownloadCounter() {
  const counterEl = document.getElementById('hero-download-counter');
  if (!counterEl) return;

  const targetCount = currentDownloads;
  const startCount = Math.max(0, targetCount - 140);
  const duration = 1200; // ms
  const startTime = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const displayed = Math.floor(startCount + (targetCount - startCount) * ease);

    counterEl.textContent = formatNumber(displayed);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      counterEl.textContent = formatNumber(targetCount);
    }
  }

  requestAnimationFrame(animate);

  // Periodic simulated live ticks (new player downloads our launcher every 18-35s)
  scheduleLiveTick();
}

function scheduleLiveTick() {
  const delay = Math.floor(Math.random() * 15000 + 18000); // 18 to 33 sec
  setTimeout(() => {
    incrementDownloads(1, true);
    scheduleLiveTick();
  }, delay);
}

function incrementDownloads(amount = 1, isBackgroundTick = false) {
  currentDownloads += amount;
  localStorage.setItem('kbl_downloads_count', currentDownloads);

  const counterEl = document.getElementById('hero-download-counter');
  if (counterEl) {
    counterEl.textContent = formatNumber(currentDownloads);
    counterEl.classList.remove('bump');
    void counterEl.offsetWidth; // trigger reflow
    counterEl.classList.add('bump');
    setTimeout(() => counterEl.classList.remove('bump'), 250);
  }

  // Update "+48 за 24 часа"
  const todayEl = document.getElementById('stat-today-downloads');
  if (todayEl) {
    const baseToday = 48 + (currentDownloads - BASE_DOWNLOADS);
    todayEl.innerHTML = \`
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--accent-emerald)"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
      <span>+\${formatNumber(baseToday)}</span>
    \`;
  }

  // Show live toast inside card
  if (isBackgroundTick) {
    showLiveToast();
  }
}

function showLiveToast() {
  const toast = document.getElementById('counter-toast');
  const toastText = document.getElementById('counter-toast-text');
  if (!toast || !toastText) return;

  const city = CITIES[Math.floor(Math.random() * CITIES.length)];
  toastText.textContent = \`Игрок из г. \${city} скачал наш лаунчер!\`;

  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 4200);
}

function formatNumber(num) {
  return num.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
}

`;

if (startIdx !== -1 && endIdx !== -1) {
  js = js.slice(0, startIdx) + newCounterCode + js.slice(endIdx);
  fs.writeFileSync(path.join(projectDir, 'site.js'), js, 'utf8');
  if (fs.existsSync(desktopDir)) {
    fs.writeFileSync(path.join(desktopDir, 'site.js'), js, 'utf8');
  }
  console.log('Successfully updated site.js in project and desktop!');
} else {
  console.error('Could not find slice boundaries in site.js');
}
