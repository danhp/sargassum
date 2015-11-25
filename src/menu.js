'use strict';
const app = require('app');
const Menu = require('menu');
const BrowserWindow = require('browser-window');
const shell = require('shell');
const appName = app.getName();

function sendAction(action) {
	const win = BrowserWindow.getAllWindows()[0];

	if (process.platform === 'darwin') {
		win.restore();
	}

	win.webContents.send(action);
}

const tpl = [
	{
		label: appName,
		submenu: [
			{label: `About ${appName}`, role: 'about'},
			{type: 'separator'},
			{label: 'Preferences...', accelerator: 'Cmd+,',
				click() {
					sendAction('show-preferences');
				}
			},
			{type: 'separator'},
			{label: `Hide ${appName}`, accelerator: 'Cmd+H', role: 'hide'},
			{label: 'Hide Others', accelerator: 'Cmd+Shift+H', role: 'hideothers'},
			{label: 'Show All', role: 'unhide'},
			{type: 'separator'},
			{label: `Quit ${appName}`, accelerator: 'Cmd+Q',
				click() {
					app.quit();
				}
			}
		]
	},

	{
		label: 'File',
		submenu: [
			{label: 'New Playlist', accelerator: 'CmdOrCtrl+N',
				click() {
					sendAction('new-playlist');
				}
			},
			{type: 'separator'},
			{label: 'Log Out', accelerator: 'CmdOrCtrl+Shift+W',
				click() {
					sendAction('log-out');
				}
			}
		]
	},

	{
		label: 'Edit',
		submenu: [
			{label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo'},
			{label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo'},
			{type: 'separator'},
			{label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut'},
			{label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy'},
			{label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste'},
			{label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall'},
			{type: 'separator'},
			{label: 'Search', accelerator: '/',
				click() {
					sendAction('search');
				}
			}
		]
	},

	{
		label: 'Window',
		role: 'window',
		submenu: [
			{label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize'},
			{label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close'},
			{type: 'separator'},
			{label: 'Go to Previous Page', accelerator: 'Cmd+[',
				click() {
					BrowserWindow.getAllWindows()[0].webContents.goBack();
				}
			},
			{label: 'Go to Next Page', accelerator: 'Cmd+]',
				click() {
					BrowserWindow.getAllWindows()[0].webContents.goForward();
				}
			},
			{type: 'separator'},
			{label: 'Bring All to Front', role: 'front'},
			{label: 'Toggle Full Screen', accelerator: 'Ctrl+Cmd+F',
				click() {
					const win = BrowserWindow.getAllWindows()[0];
					win.setFullScreen(!win.isFullScreen());
				}
			}
		]
	},
	{label: 'Help', role: 'help'}
];

const helpSubmenu = [
	{
		label: `${appName} Website...`,
		click() {
			shell.openExternal('https://github.com/phamdaniel/sargassum');
		}
	},
	{
		label: 'Report an Issue...',
		click() {
			shell.openExternal('https://gihub.com/phamdaniel/sargassum/issues');
		}
	}
];

tpl[tpl.length - 1].submenu = helpSubmenu;

module.exports = Menu.buildFromTemplate(tpl);
