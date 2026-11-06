
// Embedded Fallback Assets for 100% Offline & CDN Reliability
const EMBEDDED_SKIN_ASSETS = {
  'assets/kbl-skin.png': 'data:image/png;base64,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',
  'assets/kbl-white-skin.png': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACj0lEQVR4nO2awUoDMRCGCwoexZsP4FP4Br6TBy9evYmCHjx4Vax3KxRBwbMoakHxXCmlLbQIkRRGpmkm2STjZrObgR/TbDaZ+TLJ1m5aLYv1hzNh0uPlkVG2/kPHD+0/2IHGAJj9CPH0+hkNADU+T5QFHABJJ6QzsTJAHZ8nSosDMGDMDKDG54myoAPYCYASIwPyJpgBMAKwDcAlvHnp1nIZ4+vKLV2lbcZtA6hSH2HqTl5UvhOmG38JQNFgejfnTrTVOup5XhSALwRq/EKdyRvgJgkAf3Z1wCXb1JnHAFxBOGWAKmmbO8d/G5ssSwsZGMpF9iaONmRZzqhO0OCrfaa9LiWvQTuqDd4z1Jk3PSVsgbm2I41yXBvM4f5cLvdgoOpSkvJ2nMt8gvEVLCFcFzv+JRtPpgJrfW1lQbb7H64PhUlXp3tGufbven8GkAFkAIu2tbEqKIn7bfIa6O7iIEg2IKH9WQGMxlPx/PIm5F9TGddh1Q4A/kwBgOVRWwAhGYCXBZRNy0XWg7NQhvZRAOANkALQue3OZQJAgaAAUCCi7AFYPhmgOm7LABx89AzgWgLJZkAj9wAqQApKrR6D/e+hUDUYjObSXVOVPIBOpytClDwA9bu+q5IHkC1btmzc1j7ZFTrF9itbthJMfodXy/DdnqN95Q0HYarzbV95082eLQNc2lfecgaktgdMJjMRolKc/E97732IEMX2v3Jm+/eWu38erxmt8QC4X65WPmDVMoAMoGEAfM4UhJwvqBwQ09skXTn0xUoyAExnDkLOFyQDwASm9hmAN0EdANP5gloA0L1gbVQGNH4JJAUg9PcA2xkC7vMF7ABCfw8o+3xB5ZZA2ecLbABKB1T2+QJuAL9zNVCWVzEVfAAAAABJRU5ErkJggg==',
  'assets/alex-skin.png': 'data:image/png;base64,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',
  'assets/cape-founder.png': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAA1ElEQVR4nGMUE9L5f7/nPgM1gWKJIpz96t0VRoZBDBi/zuP+v/8WJ1GKHdW+kxwIgz0AWGCMlFkyeBXOSXsCZ6uWaeJVe7vrOsNQAUwMIxwwMYxwwESuxqeHz6CwYXjEpYCnh88wSNuagNkgeqgFAhPDCAdM1Ip9bPxhHwDSaEl+NAsMQcBEqQFDMdZpVgg+HYJlAAu5GpE9OtQ8jQyYGEY4YGIY4YAFW2+PEBhKvT1CgBE0IEJLCwb7eMAoGAWjYBSMglEwCkbBKBgFo2AUjAKGEQgAw5JBMnF/20AAAAAASUVORK5CYII=',
  'assets/cape-migrator.png': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAAsElEQVR4nO3XsQ3CMBAF0J/TFWmDlCKImg4xA4vQsQJDsAIdizADoqNGpEiREYjcIKAIVkIR6/9X2fJ9S+fC0mWHxfK5Lgr806VtX+v9/ZZhwjw0f67rqOJNVUXVhTvfH2HKfEjo2jS956uyRCoM5AzkDOR8THh7fHzsT7s5UmMgZyBnIGcgZyDnY8Ip/vrfDOQM5AzkfEgopWnvFw9z+yzPo4pTmfFFRERERERE0KsDUnsaeW8xb6gAAAAASUVORK5CYII='
};

function resolveSkinAsset(url) {
  return EMBEDDED_SKIN_ASSETS[url] || url;
}

/**
 * KBLauncher Official Website - Interactive Scripts
 * Handles Live Download Counter, Liquid Glass Toggle, 3D Skin Viewer, and Confetti
 */

document.addEventListener('DOMContentLoaded', () => {
  initDownloadCounter();
  initLiquidGlassToggle();
  initSkinViewer();
  initFaqAccordion();
  initDownloadModal();
});

// ==========================================
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
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ==========================================
// 2. Liquid Glass Theme Switcher
// ==========================================
function initLiquidGlassToggle() {
  const toggleBtn = document.getElementById('btn-site-toggle-glass');
  const toggleLabel = document.getElementById('site-glass-label');
  if (!toggleBtn) return;

  // Check saved preference or default to true (highlighting the new feature!)
  const saved = localStorage.getItem('kbl_site_liquid_glass');
  const isActive = saved === null ? true : saved === 'true';

  applyGlassState(isActive);

  toggleBtn.addEventListener('click', () => {
    const newState = !document.body.classList.contains('liquid-glass-active');
    applyGlassState(newState);
    localStorage.setItem('kbl_site_liquid_glass', newState);
  });

  function applyGlassState(active) {
    if (active) {
      document.body.classList.add('liquid-glass-active');
      if (toggleLabel) toggleLabel.textContent = 'Жидкое стекло: ВКЛ';
    } else {
      document.body.classList.remove('liquid-glass-active');
      if (toggleLabel) toggleLabel.textContent = 'Жидкое стекло: ВЫКЛ';
    }
  }
}

// ==========================================
// 3. 3D Minecraft Skin Viewer
// ==========================================
let siteSkinRenderer = null;

function initSkinViewer() {
  const canvas = document.getElementById('site-skin-canvas');
  if (!canvas || typeof MinecraftSkin3D === 'undefined') return;

  try {
    siteSkinRenderer = new MinecraftSkin3D(canvas);

    // Initial skin configuration (Песочный Вязаный с челкой)
    siteSkinRenderer.loadSkin(resolveSkinAsset('assets/kbl-skin.png'), false);
    siteSkinRenderer.loadCape(resolveSkinAsset('assets/cape-founder.png'));
  } catch (err) {
    console.warn('3D skin renderer initialization notice:', err);
  }

  // Skin pills switching
  const skinButtons = document.querySelectorAll('.skin-pill-btn[data-skin]');
  skinButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      skinButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const skinPath = btn.getAttribute('data-skin');
      const isSlim = btn.getAttribute('data-model') === 'slim';
      const skinTitle = btn.getAttribute('data-title');
      const skinDesc = btn.getAttribute('data-desc');

      if (siteSkinRenderer) {
        siteSkinRenderer.loadSkin(resolveSkinAsset(skinPath), isSlim);
      }

      const titleEl = document.getElementById('skin-preview-title');
      const descEl = document.getElementById('skin-preview-desc');
      if (titleEl && skinTitle) titleEl.textContent = skinTitle;
      if (descEl && skinDesc) descEl.textContent = skinDesc;
    });
  });

  // Cape pills switching
  const capeButtons = document.querySelectorAll('.cape-pill-btn[data-cape]');
  capeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      capeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const capePath = btn.getAttribute('data-cape');
      if (siteSkinRenderer) {
        if (capePath === 'none') {
          siteSkinRenderer.showCape = false;
        } else {
          siteSkinRenderer.showCape = true;
          siteSkinRenderer.loadCape(resolveSkinAsset(capePath));
        }
      }
    });
  });
}

// ==========================================
// 4. Download Modal & Confetti
// ==========================================
function initDownloadModal() {
  const modal = document.getElementById('download-modal');
  const closeBtn = document.getElementById('btn-close-modal');
  const allDownloadBtns = document.querySelectorAll('.trigger-download');

  allDownloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      // 1. Increment live counter
      incrementDownloads(1, false);

      // 2. Blast confetti at click position
      createConfettiBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);

      // 3. Open celebratory modal
      if (modal) {
        modal.classList.add('open');
      }

      // 4. Simulate real download file trigger
      const filename = btn.getAttribute('data-filename') || 'KBLauncher-Setup-2.4.2.exe';
      triggerBrowserDownload(filename);
    });
  });

  closeBtn?.addEventListener('click', () => {
    modal?.classList.remove('open');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });
}

function triggerBrowserDownload(filename) {
  // Create a blob payload with launcher install manifest
  const dummyContent = `KBLauncher v2.4.2 Official Release\nClient: KBLauncher Edition\nOptimization: Sodium + Iris + Lithium\nThank you for downloading KBLauncher!`;
  const blob = new Blob([dummyContent], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Confetti burst generator
function createConfettiBurst(x, y) {
  const colors = ['#6366f1', '#06b6d4', '#10b981', '#ec4899', '#f59e0b', '#ffffff', '#818cf8'];
  const count = 36;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';

    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.floor(Math.random() * 8 + 6);
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 160 + 60;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 40; // slight upward drift
    const tr = Math.floor(Math.random() * 720 - 360);

    particle.style.backgroundColor = color;
    particle.style.width = `${size}px`;
    particle.style.height = `${size * (Math.random() > 0.5 ? 1.5 : 1)}px`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    particle.style.setProperty('--tr', `${tr}deg`);

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 2200);
  }
}

// ==========================================
// 5. FAQ Accordion
// ==========================================
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}
