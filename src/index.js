'use strict';
const path = require('path');
const fs = require('fs');
const electron = require('electron');
const app = electron.app;
const ipc = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const Menu = electron.Menu;
const appMenu = require('./menu');
const storage = require('./storage');

let mainWindow;
let isQuitting = false;

function createMainWindow() {
    const lastWindowState = storage.get('lastWindowState') || {width: 1050, height: 700};

    const win = new BrowserWindow({
        'title': app.getName(),
        'show': false,
        'x': lastWindowState.x,
        'y': lastWindowState.y,
        'width': lastWindowState.width,
        'height': lastWindowState.height,
        'min-width': 950,
        'min-height': 650,
        'web-preferences': {
            'preload': path.join(__dirname, 'browser.js'),
        }
    });

    win.loadURL('https://play.google.com/music/listen#/now');
    win.on('close', e => {
        if (!isQuitting) {
            e.preventDefault();
            win.hide();
        }
    });

    return win;
}

app.on('ready', () => {
    Menu.setApplicationMenu(appMenu);

    mainWindow = createMainWindow();

    const page = mainWindow.webContents;

    page.on('dom-ready', () => {
        page.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'));
        mainWindow.show();
        page.send('start');
    });

    mainWindow.on('page-title-updated', (e) => {
        e.preventDefault();

        if (page.canGoBack()) {
            page.send('show-back');
        } else {
            page.send('hide-back');
        }

        if (page.canGoForward()) {
            page.send('show-forward');
        } else {
            page.send('hide-forward');
        }
    });

    page.on('new-window', (e, url) => {
        e.preventDefault();
        electron.shell.openExternal(url);
    });

    globalShortcut.register('MediaPlayPause', function() {
        page.send('play');
    });

    globalShortcut.register('MediaPreviousTrack', function() {
        page.send('previous-track');
    });

    globalShortcut.register('MediaNextTrack', function() {
        page.send('next-track');
    });
});

app.on('before-quit', () => {
    isQuitting = true;
    globalShortcut.unregisterAll();

    if (!mainWindow.isFullScreen()) {
        storage.set('lastWindowState', mainWindow.getBounds())
    }
});

app.on('activate', () => {
    mainWindow.show();
});

ipc.on('notification-click', () => {
    mainWindow.show();
});
