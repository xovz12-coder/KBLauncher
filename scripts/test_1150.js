const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

app.whenReady().then(async () => {
  const filePath = path.resolve(__dirname, '..', 'site.html');
  const win = new BrowserWindow({ width: 1150, height: 400, show: false, webPreferences: { offscreen: true } });
  await win.loadURL('file:///' + filePath.replace(/\\/g, '/'));
  await new Promise(r => setTimeout(r, 600));
  const img = await win.webContents.capturePage({ x: 0, y: 0, width: 1150, height: 110 });
  fs.writeFileSync('C:/Users/Anon/.gemini/antigravity/brain/3b4e9621-5ad9-4fe6-99e0-638e62d645c7/nav_test_1150.png', img.toPNG());
  app.quit();
});
