'use strict';
const ipc = require('ipc');

ipc.on('show-preferences', () => {
    document.querySelector("a.tooltip[data-type*='accountsetting']").click();
});

ipc.on('log-out', () => {
    document.querySelector('#gb_71').click();
});

ipc.on('play', () => {
    document.querySelector("paper-icon-button[data-id~='play-pause']").click();
});

ipc.on('next-track', () => {
    document.querySelector("paper-icon-button[data-id~='forward']").click();
});

ipc.on('previous-track', () => {
    document.querySelector("paper-icon-button[data-id~='rewind']").click();
});
