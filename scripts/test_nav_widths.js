const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

process.on('uncaughtException', (err) => {
  console.error('Uncaught:', err);
  process.exit(1);
});

app.whenReady().then(async () => {
  try {
    const widths = [1280, 1180, 1080, 960];
    const filePath = path.resolve(__dirname, '..', 'site.html');
    console.log('Loading file:', filePath);
    for (const w of widths) {
      const win = new BrowserWindow({ width: w, height: 400, show: false, webPreferences: { offscreen: true } });
      await win.loadFile(filePath);
      await new Promise(r => setTimeout(r, 600));
      const img = await win.webContents.capturePage({ x: 0, y: 0, width: w, height: 110 });
      fs.writeFileSync(`C:/Users/Anon/.gemini/antigravity/brain/3b4e9621-5ad9-4fe6-99e0-638e62d645c7/nav_test_${w}.png`, img.toPNG());
      win.destroy();
      console.log('Done width:', w);
    }
  } catch (e) {
    console.error('Error during capture:', e);
  }
  app.quit();
});
