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

// Clean honest counter: counts ONLY real user clicks on the download buttons, no fake ticks, no fake cities
const honestCounterCode = `// ==========================================
// 1. Real Download Counter System (Без выдуманных цифр и ботов)
// ==========================================
let realDownloads = parseInt(localStorage.getItem('kbl_real_downloads') || '0', 10);

function initDownloadCounter() {
  const counterEl = document.getElementById('hero-download-counter');
  if (counterEl) {
    counterEl.textContent = formatNumber(realDownloads);
  }

  // Hook real download triggers
  document.querySelectorAll('.trigger-download, .btn-main-download, .btn-nav-download').forEach(btn => {
    btn.addEventListener('click', () => {
      incrementRealDownloads();
    });
  });
}

function incrementRealDownloads() {
  realDownloads += 1;
  localStorage.setItem('kbl_real_downloads', realDownloads);

  const counterEl = document.getElementById('hero-download-counter');
  if (counterEl) {
    counterEl.textContent = formatNumber(realDownloads);
    counterEl.classList.remove('bump');
    void counterEl.offsetWidth;
    counterEl.classList.add('bump');
    setTimeout(() => counterEl.classList.remove('bump'), 250);
  }
}

function formatNumber(num) {
  return num.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
}

`;

if (startIdx !== -1 && endIdx !== -1) {
  js = js.slice(0, startIdx) + honestCounterCode + js.slice(endIdx);
  fs.writeFileSync(path.join(projectDir, 'site.js'), js, 'utf8');
  if (fs.existsSync(desktopDir)) {
    fs.writeFileSync(path.join(desktopDir, 'site.js'), js, 'utf8');
  }
  console.log('Successfully cleaned site.js to honest counter!');
} else {
  console.error('Could not find markers in site.js');
}
