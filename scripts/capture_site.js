const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\Anon\\.gemini\\antigravity\\brain\\3b4e9621-5ad9-4fe6-99e0-638e62d645c7';

app.commandLine.appendSwitch('disable-gpu-vsync');
app.commandLine.appendSwitch('use-gl', 'angle');
app.commandLine.appendSwitch('use-angle', 'd3d11');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    show: false,
    webPreferences: {
      offscreen: true,
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  await win.loadURL('http://localhost:3000/site.html');
  // Wait for 3D skin viewer and counters to initialize
  await new Promise(r => setTimeout(r, 2200));

  // 1. Capture Hero Section with Download Counter
  const heroImage = await win.webContents.capturePage({ x: 0, y: 0, width: 1280, height: 850 });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'kbl_site_hero.png'), heroImage.toPNG());
  console.log('Saved kbl_site_hero.png');

  // 2. Scroll to 3D Wardrobe & capture
  await win.webContents.executeJavaScript(`
    document.getElementById('wardrobe').scrollIntoView({ behavior: 'instant', block: 'start' });
  `);
  await new Promise(r => setTimeout(r, 800));
  const wardrobeImage = await win.webContents.capturePage({ x: 0, y: 0, width: 1280, height: 850 });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'kbl_site_wardrobe.png'), wardrobeImage.toPNG());
  console.log('Saved kbl_site_wardrobe.png');

  // 3. Scroll to Features & Comparison
  await win.webContents.executeJavaScript(`
    document.getElementById('features').scrollIntoView({ behavior: 'instant', block: 'start' });
  `);
  await new Promise(r => setTimeout(r, 800));
  const featuresImage = await win.webContents.capturePage({ x: 0, y: 0, width: 1280, height: 850 });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'kbl_site_features.png'), featuresImage.toPNG());
  console.log('Saved kbl_site_features.png');

  // 3b. Scroll to Comparison table
  await win.webContents.executeJavaScript(`
    document.getElementById('comparison').scrollIntoView({ behavior: 'instant', block: 'start' });
  `);
  await new Promise(r => setTimeout(r, 800));
  const compImage = await win.webContents.capturePage({ x: 0, y: 0, width: 1280, height: 850 });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'kbl_site_comparison.png'), compImage.toPNG());
  console.log('Saved kbl_site_comparison.png');

  // 3c. Scroll to Downloads
  await win.webContents.executeJavaScript(`
    document.getElementById('downloads').scrollIntoView({ behavior: 'instant', block: 'start' });
  `);
  await new Promise(r => setTimeout(r, 800));
  const dlImage = await win.webContents.capturePage({ x: 0, y: 0, width: 1280, height: 850 });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'kbl_site_downloads.png'), dlImage.toPNG());
  console.log('Saved kbl_site_downloads.png');

  // 4. Trigger download button to test counter bump, confetti and modal
  await win.webContents.executeJavaScript(`
    document.querySelector('.btn-main-download').click();
  `);
  await new Promise(r => setTimeout(r, 600));
  const modalImage = await win.webContents.capturePage({ x: 0, y: 0, width: 1280, height: 850 });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'kbl_site_download_modal.png'), modalImage.toPNG());
  console.log('Saved kbl_site_download_modal.png');

  app.quit();
});
