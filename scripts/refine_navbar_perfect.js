const fs = require('fs');
const path = require('path');

const projectDir = 'C:\\Users\\Anon\\.gemini\\antigravity\\scratch\\KBLauncher';
const desktopDir = 'C:\\Users\\Anon\\Desktop\\KBLauncher-Website';

let css = fs.readFileSync(path.join(projectDir, 'site.css'), 'utf8');

// Replace nav styles
const oldNavCssRegex = /\/\* =========================================================\s*Floating Island Navbar[\s\S]*?\/\* Download CTA Pill \*\/\s*\.btn-nav-download \{[\s\S]*?transform: translateY\(-1\.5px\) scale\(1\.02\);\s*\}/;

const newNavCss = `/* =========================================================
   Floating Island Navbar (Apple & Cyber-Glass Aesthetic)
   ========================================================= */
.site-header {
  position: sticky;
  top: 14px;
  z-index: 1000;
  width: 100%;
  padding: 0 16px;
  pointer-events: none;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
}

.nav-wrapper {
  pointer-events: auto;
  max-width: 1200px;
  margin: 0 auto;
  padding: 6px 18px 6px 18px;
  border-radius: var(--radius-pill);
  background: radial-gradient(130% 120% at 50% 0%, oklch(1 0 0 / 0.16) 0%, oklch(0.12 0.035 285 / 0.88) 100%);
  border: 1px solid oklch(0.98 0.01 280 / 0.20);
  border-top: 1.6px solid oklch(1 0 0 / 0.65);
  backdrop-filter: blur(36px) saturate(220%) brightness(1.1);
  -webkit-backdrop-filter: blur(36px) saturate(220%) brightness(1.1);
  box-shadow: 
    inset 0 1.5px 2px 0 oklch(1 0 0 / 0.45),
    inset 0 -2px 4px 0 oklch(0 0 0 / 0.45),
    0 18px 45px -10px oklch(0 0 0 / 0.75),
    0 0 35px -8px var(--brand-primary-glow);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
  overflow: hidden;
}

body:not(.liquid-glass-active) .nav-wrapper {
  background: oklch(0.13 0.04 285 / 0.96);
  border: 1px solid oklch(0.98 0.01 280 / 0.12);
  box-shadow: 0 16px 40px -10px oklch(0 0 0 / 0.8);
}

/* Brand Link & Chip */
.brand-link {
  display: flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
  color: inherit;
  flex-shrink: 0;
}

.brand-logo-img {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  box-shadow: 0 4px 14px var(--brand-primary-glow);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.brand-link:hover .brand-logo-img {
  transform: scale(1.1) rotate(-4deg);
}

.brand-title-group {
  display: flex;
  align-items: center;
  gap: 7px;
}

.brand-name {
  font-size: 17px;
  font-weight: 850;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, oklch(1 0 0) 25%, oklch(0.88 0.08 278) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-version-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6.5px;
  border-radius: var(--radius-pill);
  background: oklch(0.78 0.16 215 / 0.15);
  border: 1px solid oklch(0.78 0.16 215 / 0.35);
  font-size: 10px;
  font-weight: 750;
  color: var(--accent-cyan);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.brand-version-chip .chip-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent-cyan);
  box-shadow: 0 0 6px var(--accent-cyan);
}

/* Center Segmented Island */
.nav-center-pill {
  display: flex;
  align-items: center;
  background: oklch(0.98 0.01 280 / 0.04);
  border: 1px solid oklch(0.98 0.01 280 / 0.09);
  border-radius: var(--radius-pill);
  padding: 2.5px 3px;
  gap: 2px;
}

.nav-center-pill .nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  padding: 4.5px 10px;
  border-radius: var(--radius-pill);
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}

.nav-center-pill .nav-link:hover {
  color: #fff;
  background: oklch(0.98 0.01 280 / 0.14);
  box-shadow: 0 2px 10px oklch(0 0 0 / 0.25);
  transform: translateY(-1px);
}

/* Right Control Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
}

/* iOS Glass Toggle Button */
.btn-toggle-glass {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5.5px 11px;
  border-radius: var(--radius-pill);
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-primary);
  cursor: pointer;
  background: oklch(0.98 0.01 280 / 0.08);
  border: 1px solid oklch(0.98 0.01 280 / 0.2);
  backdrop-filter: blur(14px);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}

.btn-toggle-glass:hover {
  background: oklch(0.98 0.01 280 / 0.16);
  border-color: oklch(0.98 0.01 280 / 0.4);
  transform: translateY(-1.5px);
}

body.liquid-glass-active .btn-toggle-glass {
  background: radial-gradient(circle at 50% 0%, oklch(0.98 0.01 280 / 0.32) 0%, oklch(0.62 0.23 278 / 0.3) 100%);
  border: 1.2px solid oklch(0.98 0.01 280 / 0.65);
  box-shadow: 0 0 20px var(--brand-primary-glow), inset 0 1px 2px oklch(1 0 0 / 0.7);
}

.glass-pill-dot {
  width: 6.5px;
  height: 6.5px;
  border-radius: 50%;
  background: var(--accent-emerald);
  box-shadow: 0 0 10px var(--accent-emerald);
}

/* Discord Online Pill */
.btn-nav-discord {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5.5px 11px;
  border-radius: var(--radius-pill);
  font-size: 11.5px;
  font-weight: 700;
  color: #fff;
  background: oklch(0.55 0.22 272 / 0.24);
  border: 1px solid oklch(0.55 0.22 272 / 0.5);
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}

.btn-nav-discord:hover {
  background: var(--color-discord);
  box-shadow: 0 4px 20px oklch(0.55 0.22 272 / 0.55);
  transform: translateY(-1.5px);
}

.discord-icon-svg {
  width: 13.5px;
  height: 13.5px;
  fill: currentColor;
}

.discord-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-emerald);
  box-shadow: 0 0 8px var(--accent-emerald);
  animation: pulseGreen 2.2s infinite ease-in-out;
}

/* Download CTA Pill */
.btn-nav-download {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, var(--brand-primary) 0%, oklch(0.50 0.24 278) 100%);
  border: 1.2px solid oklch(0.98 0.01 280 / 0.35);
  text-decoration: none;
  box-shadow: 0 4px 20px var(--brand-primary-glow), inset 0 1px 1px oklch(1 0 0 / 0.5);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-nav-download:hover {
  background: linear-gradient(135deg, var(--brand-primary-hover) 0%, var(--brand-primary) 100%);
  box-shadow: 0 6px 28px var(--brand-primary-glow), 0 0 20px var(--brand-primary-glow);
  transform: translateY(-1.5px) scale(1.02);
}`;

css = css.replace(oldNavCssRegex, newNavCss);

// Remove any existing Responsive Navbar Adaptation block and add cleaner responsive rules
const respIdx = css.indexOf('/* =========================================================\n   Responsive Navbar Adaptation');
const respIdxCRLF = css.indexOf('/* =========================================================\r\n   Responsive Navbar Adaptation');
const cutIdx = respIdx !== -1 ? respIdx : respIdxCRLF;
if (cutIdx !== -1) {
  css = css.slice(0, cutIdx).trimEnd() + '\n';
}

css += `
/* =========================================================
   Responsive Navbar Adaptation
   ========================================================= */
@media (max-width: 1100px) {
  .brand-version-chip {
    display: none !important;
  }
  .nav-center-pill .nav-link {
    padding: 4px 8px;
    font-size: 11.5px;
  }
  .nav-wrapper {
    gap: 8px;
    padding: 5px 14px 5px 14px;
  }
}

@media (max-width: 980px) {
  .nav-center-pill {
    display: none !important;
  }
}

@media (max-width: 680px) {
  .btn-nav-discord {
    display: none !important;
  }
}

@media (max-width: 480px) {
  .btn-toggle-glass {
    display: none !important;
  }
  .btn-nav-download {
    padding: 5.5px 12px;
    font-size: 11.5px;
  }
  .nav-wrapper {
    padding: 5px 12px 5px 12px;
  }
}
`;

fs.writeFileSync(path.join(projectDir, 'site.css'), css, 'utf8');
if (fs.existsSync(desktopDir)) {
  fs.writeFileSync(path.join(desktopDir, 'site.css'), css, 'utf8');
}
console.log('Saved refined CSS to project & desktop.');
