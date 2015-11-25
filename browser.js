'use strict';
const ipc = require('ipc');

ipc.on('show-preferences', () => {
	document.querySelector('a.tooltip[data-type*="accountsetting"]').click();
});

ipc.on('log-out', () => {
	document.querySelector('#gb_71').click();
});

ipc.on('play', () => {
	document.querySelector('paper-icon-button[data-id~="play-pause"]').click();
});

ipc.on('next-track', () => {
	document.querySelector('paper-icon-button[data-id~="forward"]').click();
});

ipc.on('previous-track', () => {
	document.querySelector('paper-icon-button[data-id~="rewind"]').click();
});

ipc.on('new-playlist', () => {
	document.querySelector('#new-playlist').click();
});

ipc.on('search', () => {
	document.querySelector('.material-search').focus();
});

// BACK AND FORWARD
ipc.on('start', () => {
	const divBack = document.createElement('div');
	divBack.id = 'back-button';
	divBack.onclick = function () {
		window.history.back();
	};

	const divForward = document.createElement('div');
	divForward.id = 'forward-button';
	divForward.onclick = function () {
		window.history.forward();
	};

	const node = document.querySelector('#material-one-left');
	node.appendChild(divBack);
	node.appendChild(divForward);
});

ipc.on('show-back', () => {
	const node = document.getElementById('back-button');
	node.setAttribute('style', '-webkit-filter:invert(100%)');
});

ipc.on('hide-back', () => {
	const node = document.getElementById('back-button');
	node.setAttribute('style', '-webkit-filter:invert(75%)');
});

ipc.on('show-forward', () => {
	const node = document.getElementById('forward-button');
	node.setAttribute('style', '-webkit-filter:invert(100%)');
});

ipc.on('hide-forward', () => {
	const node = document.getElementById('forward-button');
	node.setAttribute('style', '-webkit-filter:invert(75%)');
});

/* eslint-disable no-native-reassign, no-undef */
// Extend and replace the native notifications.
const NativeNotification = Notification;

Notification = function (title, options) {
	const notification = new NativeNotification(title, options);
	notification.addEventListener('click', () => {
		ipc.send('notification-click');
	});

	return notification;
};
Notification.prototype = NativeNotification.prototype;
Notification.permission = NativeNotification.permission;
Notification.requestPermission = NativeNotification.requestPermission.bind(Notification);
/* eslint-enable no-native-reassign, no-undef */
