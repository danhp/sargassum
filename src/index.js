'use strict';
const path = require('path');
const fs = require('fs');
const app = require('app');
const BrowserWindow = require('browser-window');
const shell = require('shell');
const globalShortcut = require('global-shortcut');
const Menu = require('menu');
const appMenu = require('./menu');

let mainWindow;

function createMainWindow() {
    const win = new BrowserWindow({
        'title': app.getName(),
        'show': false,
        'width': 1050,
        'height': 700,
        'min-width': 950,
        'min-height': 650,
        'web-preferences': {
            'preload': path.join(__dirname, 'browser.js'),
        }
    });

    win.loadUrl('https://play.google.com/music/listen#/now');
    win.on('closed', app.quit);

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
        shell.openExternal(url);
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

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});
