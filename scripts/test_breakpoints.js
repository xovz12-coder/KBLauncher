const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

app.whenReady().then(async () => {
  const filePath = path.resolve(__dirname, '..', 'site.html');
  const win = new BrowserWindow({ width: 1050, height: 400, show: false, webPreferences: { offscreen: true } });
  await win.loadURL('file:///' + filePath.replace(/\\/g, '/'));
  await new Promise(r => setTimeout(r, 600));

  for (const w of [1050, 950, 650, 420]) {
    win.setSize(w, 400);
    await new Promise(r => setTimeout(r, 400));
    const img = await win.webContents.capturePage({ x: 0, y: 0, width: w, height: 110 });
    fs.writeFileSync(`C:/Users/Anon/.gemini/antigravity/brain/3b4e9621-5ad9-4fe6-99e0-638e62d645c7/nav_test_${w}.png`, img.toPNG());
    console.log('Saved nav_test_' + w + '.png');
  }
  app.quit();
});
