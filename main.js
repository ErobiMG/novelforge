const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1366,
        height: 868,
        minWidth: 1024,
        minHeight: 768,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true
        },
        title: "NovelForge AI - Immersive Story Writing Studio",
        backgroundColor: "#020503",
        show: false
    });

    win.loadFile('index.html');

    win.once('ready-to-show', () => {
        win.show();
    });

    // Remove default browser menu bar for a clean standalone desktop feel
    Menu.setApplicationMenu(null);
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
