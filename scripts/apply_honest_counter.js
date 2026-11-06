const fs = require('fs');
const path = require('path');

const projectDir = 'C:\\Users\\Anon\\.gemini\\antigravity\\scratch\\KBLauncher';
const desktopDir = 'C:\\Users\\Anon\\Desktop\\KBLauncher-Website';

console.log('1. Updating site.html...');
let html = fs.readFileSync(path.join(projectDir, 'site.html'), 'utf8');

const oldCardRegex = /<div class="counter-hero-card">[\s\S]*?<!-- Hero Call-To-Action Download Cluster -->/;

const newCardHtml = `<div class="counter-hero-card">
        <div class="counter-specular-sheen"></div>

        <div class="counter-top-row">
          <div class="counter-live-pill">
            <span class="live-beacon"></span>
            <span>Честный счётчик загрузок</span>
          </div>
          <div class="counter-verified-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--accent-emerald)"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>Реальные клики</span>
          </div>
        </div>

        <div class="counter-main-display">
          <div class="counter-digits-wrapper">
            <div class="counter-big-number" id="hero-download-counter">0</div>
            <span class="counter-plus-sign" style="display:none;" id="hero-counter-plus">+</span>
          </div>
        </div>
        <div class="counter-label">Скачиваний лаунчера с момента релиза</div>

        <!-- 3 Честные характеристики нашего лаунчера -->
        <div class="counter-substats-grid">
          <div class="substat-col">
            <div class="substat-value">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--accent-emerald)"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>0 ₽</span>
            </div>
            <div class="substat-label">100% Бесплатно</div>
          </div>

          <div class="substat-col">
            <div class="substat-value">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--accent-cyan)"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span>0%</span>
            </div>
            <div class="substat-label">Без рекламы и вирусов</div>
          </div>

          <div class="substat-col">
            <div class="substat-value">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--accent-gold)"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>v2.4.2</span>
            </div>
            <div class="substat-label">Актуальная версия</div>
          </div>
        </div>

        <!-- Real Toast on Download -->
        <div class="counter-toast-alert" id="counter-toast">
          <span style="font-size:14px">🎉</span>
          <span id="counter-toast-text">Спасибо за загрузку KBLauncher!</span>
        </div>
      </div>

      <!-- Hero Call-To-Action Download Cluster -->`;

html = html.replace(oldCardRegex, newCardHtml);
fs.writeFileSync(path.join(projectDir, 'site.html'), html, 'utf8');

// 2. Updating site.js with pure honest counter logic
console.log('2. Updating site.js...');
let js = fs.readFileSync(path.join(projectDir, 'site.js'), 'utf8');

const startMarker = '// ==========================================\n// 1.';
const startMarkerCRLF = '// ==========================================\r\n// 1.';
const endMarker = '// ==========================================\n// 2. Liquid Glass';
const endMarkerCRLF = '// ==========================================\r\n// 2. Liquid Glass';

let startIdx = js.indexOf(startMarker);
if (startIdx === -1) startIdx = js.indexOf(startMarkerCRLF);

let endIdx = js.indexOf(endMarker);
if (endIdx === -1) endIdx = js.indexOf(endMarkerCRLF);

const honestCounterJs = `// ==========================================
// 1. Real Honest Download Counter System (Старт с 0, только реальные клики)
// ==========================================
// Clear any old fake counter cache
if (localStorage.getItem('kbl_downloads_count')) {
  localStorage.removeItem('kbl_downloads_count');
}

let realDownloads = parseInt(localStorage.getItem('kbl_real_downloads') || '0', 10);

function initDownloadCounter() {
  updateCounterDisplay(realDownloads);

  // Hook all download buttons on the site
  const downloadButtons = document.querySelectorAll(
    '.trigger-download, .btn-main-download, .btn-nav-download, .btn-card-download, .modal-dl-btn'
  );

  downloadButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      incrementRealDownload();
    });
  });
}

function incrementRealDownload() {
  realDownloads += 1;
  localStorage.setItem('kbl_real_downloads', realDownloads.toString());
  updateCounterDisplay(realDownloads, true);
  showDownloadToast();
}

function updateCounterDisplay(count, animateBump = false) {
  const counterEl = document.getElementById('hero-download-counter');
  const plusEl = document.getElementById('hero-counter-plus');
  if (!counterEl) return;

  counterEl.textContent = formatNumber(count);
  if (plusEl) {
    plusEl.style.display = count > 0 ? 'inline' : 'none';
  }

  if (animateBump) {
    counterEl.classList.remove('bump');
    void counterEl.offsetWidth; // trigger reflow
    counterEl.classList.add('bump');
    setTimeout(() => counterEl.classList.remove('bump'), 300);
  }
}

function showDownloadToast() {
  const toast = document.getElementById('counter-toast');
  const toastText = document.getElementById('counter-toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = '🎉 Спасибо за загрузку KBLauncher! Счётчик обновлён.';
  toast.classList.add('visible');

  setTimeout(() => {
    toast.classList.remove('visible');
  }, 4500);
}

function formatNumber(num) {
  return num.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
}

`;

if (startIdx !== -1 && endIdx !== -1) {
  js = js.slice(0, startIdx) + honestCounterJs + js.slice(endIdx);
  fs.writeFileSync(path.join(projectDir, 'site.js'), js, 'utf8');
} else {
  console.error('Could not find slice markers in site.js');
}

// 3. Sync to Desktop
console.log('3. Syncing to Desktop...');
if (fs.existsSync(desktopDir)) {
  fs.writeFileSync(path.join(desktopDir, 'index.html'), html, 'utf8');
  fs.writeFileSync(path.join(desktopDir, 'site.js'), js, 'utf8');
}

console.log('Done apply_honest_counter.js!');
