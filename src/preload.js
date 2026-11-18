const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('steam', {
  unlock: (id) => ipcRenderer.invoke('steam-unlock', id)
});
