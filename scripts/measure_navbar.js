const { app, BrowserWindow } = require('electron');
const path = require('path');

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1280, height: 400, show: false, webPreferences: { offscreen: true } });
  const filePath = path.resolve(__dirname, '..', 'site.html');
  await win.loadURL('file:///' + filePath.replace(/\\/g, '/'));
  await new Promise(r => setTimeout(r, 600));

  const metrics = await win.webContents.executeJavaScript(`
    (() => {
      const header = document.querySelector('.site-header');
      const wrapper = document.querySelector('.nav-wrapper');
      const brand = document.querySelector('.brand-link');
      const center = document.querySelector('.nav-center-pill');
      const actions = document.querySelector('.nav-actions');
      const dlBtn = document.querySelector('.btn-nav-download');

      const r = (el) => {
        const b = el.getBoundingClientRect();
        return { left: b.left, right: b.right, width: b.width, height: b.height };
      };

      return {
        viewportWidth: window.innerWidth,
        wrapperRect: r(wrapper),
        brandRect: r(brand),
        centerRect: r(center),
        actionsRect: r(actions),
        dlBtnRect: r(dlBtn),
        overflowRight: dlBtn.getBoundingClientRect().right - wrapper.getBoundingClientRect().right,
        wrapperStyle: {
          paddingLeft: window.getComputedStyle(wrapper).paddingLeft,
          paddingRight: window.getComputedStyle(wrapper).paddingRight,
          gap: window.getComputedStyle(wrapper).gap,
          width: window.getComputedStyle(wrapper).width,
          maxWidth: window.getComputedStyle(wrapper).maxWidth
        }
      };
    })()
  `);

  console.log('METRICS:', JSON.stringify(metrics, null, 2));
  app.quit();
});
