import {app, BrowserWindow, Tray, Menu, shell} from 'electron';

const Nucleus = require('electron-nucleus')('5c2fd2e8ffc1fb00ce9582e2');

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function createTray() {
  const trayIcon = require('path').join(__static, 'logo2_16.png');
  // const nimage = nativeImage.createFromPath(trayIcon)
  console.log(trayIcon);
  let tray = new Tray(trayIcon);
  tray.on('click', e => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
  const trayMenuTemplate = [
    {
      label: 'Stop Server',
      enabled: false,
    },

    {
      label: 'Quit',
      click: function() {
        mainWindow.close();
        console.log('Clicked on settings');
      },
    },

    {
      label: 'Help',
      click: function() {
        console.log('Clicked on Help');
        shell.openExternal('http://www.cadence-desktop.com')
      },
    },
  ];

  let trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
  tray.setContextMenu(trayMenu);
}

function createWindow() {
  /**
   * Initial window options
  
   */

  mainWindow = new BrowserWindow({
    height: 825,
    useContentSize: true,
    width: 1090,
    maxWidth: 1090,
    maxHeight: 825,
    frame: false,
    fullscreen: false,
    maximizable: false,
    resizable: false,
    center: true,
    // zoomFactor: 0.9
  });

  //  mainWindow.webContents.openDevTools(); // uncomment for debugging

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

// import {autoUpdater} from 'electron-updater';

// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall();
// });

// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates();
// });
