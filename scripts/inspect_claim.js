const { app, BrowserWindow } = require('electron');
app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1280, height: 800, show: false, webPreferences: { offscreen: true } });
  await win.loadURL('https://app.netlify.com/drop/helpful-meringue-8baff5/claim');
  await new Promise(r => setTimeout(r, 4500));
  const text = await win.webContents.executeJavaScript('document.body.innerText');
  console.log('PAGE TEXT:\n' + text);
  app.quit();
});
