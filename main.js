const { app, BrowserWindow, Menu, ipcMain, session } = require('electron');
const path = require('path');

function createWindow() {
    // Clear storage data to unregister any corrupted service workers from file:// protocol
    if (session && session.defaultSession) {
        session.defaultSession.clearStorageData({
            storages: ['serviceworkers']
        }).catch(err => console.error('Failed to clear service workers storage:', err));
    }

    const win = new BrowserWindow({
        width: 1366,
        height: 868,
        minWidth: 1024,
        minHeight: 768,
        frame: false, // Turn off native OS title bar and borders
        transparent: true, // Allow custom rounded HTML frame corners
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            preload: path.join(__dirname, 'preload.js')
        },
        title: "NovelForge AI - Immersive Story Writing Studio",
        backgroundColor: "#00000000", // Transparent container wrapper
        show: false
    });

    win.loadFile('index.html');

    win.once('ready-to-show', () => {
        win.show();
    });

    // Remove default browser menu bar for a clean standalone desktop feel
    Menu.setApplicationMenu(null);

    // IPC handlers for custom title bar controls
    ipcMain.on('window-minimize', () => win.minimize());
    ipcMain.on('window-maximize', () => {
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    });
    ipcMain.on('window-close', () => win.close());
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
