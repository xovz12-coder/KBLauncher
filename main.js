const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1024,
    minHeight: 600,
    frame: false,
    show: false,
    backgroundColor: '#0c0a1d',
    icon: path.join(__dirname, 'assets', 'icon-256.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-maximized-change', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-maximized-change', false);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Window Controls
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window-is-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

// Open external links safely
ipcMain.on('open-external', (event, url) => {
  shell.openExternal(url);
});

// Open Game Folder
ipcMain.on('open-folder', (event, folderPath) => {
  const target = folderPath || path.join(process.env.APPDATA || '', '.minecraft');
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  shell.openPath(target);
});

// Game Launch Simulation / Real Launch Hooks
ipcMain.handle('launch-game', async (event, buildConfig) => {
  // Can be extended with real Java child_process.spawn
  return { success: true, pid: Math.floor(Math.random() * 8000 + 1000) };
});
