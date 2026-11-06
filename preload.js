const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  onMaximizedChange: (callback) => ipcRenderer.on('window-maximized-change', (event, val) => callback(val)),
  openExternal: (url) => ipcRenderer.send('open-external', url),
  openFolder: (path) => ipcRenderer.send('open-folder', path),
  launchGame: (buildConfig) => ipcRenderer.invoke('launch-game', buildConfig)
});
