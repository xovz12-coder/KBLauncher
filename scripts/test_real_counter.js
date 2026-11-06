const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

app.whenReady().then(async () => {
  const filePath = path.resolve(__dirname, '..', 'site.html');
  const win = new BrowserWindow({ width: 1280, height: 950, show: false, webPreferences: { offscreen: true } });
  await win.loadURL('file:///' + filePath.replace(/\\/g, '/'));
  await new Promise(r => setTimeout(r, 1200));

  // Capture initial card (0 downloads)
  const bounds = await win.webContents.executeJavaScript(`
    (() => {
      const card = document.querySelector('.counter-hero-card');
      const b = card.getBoundingClientRect();
      return { x: Math.floor(b.left - 20), y: Math.floor(b.top - 20), width: Math.ceil(b.width + 40), height: Math.ceil(b.height + 40) };
    })()
  `);

  let img = await win.webContents.capturePage(bounds);
  fs.writeFileSync('C:/Users/Anon/.gemini/antigravity/brain/3b4e9621-5ad9-4fe6-99e0-638e62d645c7/kbl_counter_honest_zero.png', img.toPNG());
  console.log('Saved kbl_counter_honest_zero.png');

  // Click the download button!
  await win.webContents.executeJavaScript(`
    document.querySelector('.btn-main-download').click();
  `);
  await new Promise(r => setTimeout(r, 600));

  // Capture card after real click
  img = await win.webContents.capturePage(bounds);
  fs.writeFileSync('C:/Users/Anon/.gemini/antigravity/brain/3b4e9621-5ad9-4fe6-99e0-638e62d645c7/kbl_counter_honest_clicked.png', img.toPNG());
  console.log('Saved kbl_counter_honest_clicked.png');

  app.quit();
});
