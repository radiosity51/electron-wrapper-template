const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Size the window to fit the screen, up to 1280x800.
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = new BrowserWindow({
    width: Math.min(1280, width),
    height: Math.min(800, height),
    minWidth: 800,
    minHeight: 600,
    center: true,
    webPreferences: {
      devTools: false,
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const STEAM_APP_ID = 0; // replace 0 with your real Steam App ID
let steamClient = null;

try {
  if (STEAM_APP_ID) {
    const steamworks = require('steamworks.js');
    steamClient = steamworks.init(STEAM_APP_ID);
    steamworks.electronEnableSteamOverlay();
  }
} catch (e) {
  console.log('Steam not available:', e.message);
}

ipcMain.handle('steam-unlock', (event, id) => {
  if (!steamClient) return false;
  try {
    return steamClient.achievement.activate(String(id));
  } catch (e) {
    return false;
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
