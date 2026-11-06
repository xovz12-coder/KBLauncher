const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

app.whenReady().then(async () => {
  const filePath = path.resolve(__dirname, '..', 'site.html');
  const win = new BrowserWindow({ width: 1280, height: 1150, show: false, webPreferences: { offscreen: true } });
  await win.loadURL('file:///' + filePath.replace(/\\/g, '/'));
  await new Promise(r => setTimeout(r, 1600));

  const bounds = await win.webContents.executeJavaScript(`
    (() => {
      const hero = document.querySelector('.hero-section');
      const b = hero.getBoundingClientRect();
      return { x: 0, y: Math.floor(b.top), width: 1280, height: Math.min(Math.ceil(b.height), 1050) };
    })()
  `);

  const img = await win.webContents.capturePage(bounds);
  fs.writeFileSync('C:/Users/Anon/.gemini/antigravity/brain/3b4e9621-5ad9-4fe6-99e0-638e62d645c7/kbl_hero_updated.png', img.toPNG());
  console.log('Saved kbl_hero_updated.png');
  app.quit();
});
