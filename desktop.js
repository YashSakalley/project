const { app, BrowserWindow} = require('electron');
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
    });
    mainWindow.loadURL('http://localhost:3000/');
    mainWindow.setMenuBarVisibility(false)
}
app.on('ready', createWindow);