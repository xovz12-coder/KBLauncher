const { app, BrowserWindow } = require('electron');
const fs = require('fs');
app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1280, height: 900, show: false, webPreferences: { offscreen: true } });
  await win.loadURL('https://app.netlify.com/drop/helpful-meringue-8baff5/claim');
  await new Promise(r => setTimeout(r, 4500));
  const img = await win.webContents.capturePage({ x: 0, y: 0, width: 1280, height: 900 });
  fs.writeFileSync('C:/Users/Anon/.gemini/antigravity/brain/3b4e9621-5ad9-4fe6-99e0-638e62d645c7/claim_page_screen.png', img.toPNG());
  console.log('Saved claim_page_screen.png');
  app.quit();
});
