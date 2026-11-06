const fs = require('fs');
const path = require('path');

const projectDir = 'C:\\Users\\Anon\\.gemini\\antigravity\\scratch\\KBLauncher';
const desktopDir = 'C:\\Users\\Anon\\Desktop\\KBLauncher-Website';

console.log('1. Updating site.html...');
let html = fs.readFileSync(path.join(projectDir, 'site.html'), 'utf8');

// Replace the counter-hero-card content
const oldCardRegex = /<div class="counter-hero-card">[\s\S]*?<!-- Hero Call-To-Action Download Cluster -->/;

const newCardHtml = `<div class="counter-hero-card">
        <div class="counter-specular-sheen"></div>

        <div class="counter-top-row">
          <div class="counter-live-pill">
            <span class="live-beacon"></span>
            <span>Живой счётчик загрузок</span>
          </div>
          <div class="counter-verified-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--accent-emerald)"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>Статистика нашего лаунчера</span>
          </div>
        </div>

        <div class="counter-main-display">
          <div class="counter-digits-wrapper">
            <div class="counter-big-number" id="hero-download-counter">2,480</div>
            <span class="counter-plus-sign">+</span>
          </div>
        </div>
        <div class="counter-label">Игроков уже выбрали наш лаунчер</div>

        <!-- 3 Secondary Live Metrics (Без онлайна) -->
        <div class="counter-substats-grid">
          <div class="substat-col">
            <div class="substat-value" id="stat-today-downloads">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--accent-emerald)"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              <span>+48</span>
            </div>
            <div class="substat-label">За последние 24 часа</div>
          </div>

          <div class="substat-col">
            <div class="substat-value">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--accent-cyan)"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span>100%</span>
            </div>
            <div class="substat-label">Без рекламы и вирусов</div>
          </div>

          <div class="substat-col">
            <div class="substat-value">
              <span style="color:var(--accent-gold)">★</span>
              <span>4.98 / 5.0</span>
            </div>
            <div class="substat-label">Оценка игроков</div>
          </div>
        </div>

        <!-- Live Toast Notification inside card -->
        <div class="counter-toast-alert" id="counter-toast">
          <span style="font-size:14px">⚡</span>
          <span id="counter-toast-text">Игрок из г. Москвы скачал наш лаунчер!</span>
        </div>
      </div>

      <!-- Hero Call-To-Action Download Cluster -->`;

if (oldCardRegex.test(html)) {
  html = html.replace(oldCardRegex, newCardHtml);
  console.log('Successfully replaced counter card in site.html');
} else {
  console.error('Failed to match oldCardRegex in site.html');
}

// In navbar, update Discord pill title to clean Discord community without fake online
html = html.replace(
  /<a href="https:\/\/discord\.gg\/minecraft" target="_blank" class="btn-nav-discord" title=".*?">[\s\S]*?<\/a>/,
  `<a href="https://discord.gg/minecraft" target="_blank" class="btn-nav-discord" title="Присоединяйтесь к нашему Discord">
          <svg class="discord-icon-svg" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.078.078 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
          <span class="discord-dot"></span>
          <span>Discord</span>
        </a>`
);

fs.writeFileSync(path.join(projectDir, 'site.html'), html, 'utf8');

// 2. Updating site.js
console.log('2. Updating site.js...');
let js = fs.readFileSync(path.join(projectDir, 'site.js'), 'utf8');

const oldCounterJsRegex = /\/\/ ==========================================\s*\/\/\s*1\.\s*Live Download Counter System[\s\S]*?\/\/ ==========================================\s*\/\/\s*2\.\s*Liquid Glass Interactive Toggle/;

const newCounterJs = `// ==========================================
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

// ==========================================
// 2. Liquid Glass Interactive Toggle`;

if (oldCounterJsRegex.test(js)) {
  js = js.replace(oldCounterJsRegex, newCounterJs);
  console.log('Successfully replaced counter code in site.js');
} else {
  console.error('Failed to match oldCounterJsRegex in site.js');
}

fs.writeFileSync(path.join(projectDir, 'site.js'), js, 'utf8');

// 3. Sync to Desktop
console.log('3. Syncing to Desktop/KBLauncher-Website...');
if (fs.existsSync(desktopDir)) {
  fs.writeFileSync(path.join(desktopDir, 'index.html'), html, 'utf8');
  fs.writeFileSync(path.join(desktopDir, 'site.js'), js, 'utf8');
}

console.log('Done update_stats.js!');
