import { ipcMain, WebContents, WebFrameMain } from 'electron';
import { getUIPath, isDev } from './pathResolver.js';
import { pathToFileURL } from 'url';

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
    key: Key,
    handler: (
        args: any
    ) => Promise<EventPayloadMapping[Key]> | EventPayloadMapping[Key]
) {
    ipcMain.handle(key, (event, args) => {
        validateEventFrame(event.senderFrame);
        return handler(args);
    });
}

export function ipcMainOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    handler: (payload: EventPayloadMapping[Key]) => void
) {
    ipcMain.on(key, (event, payload) => {
        validateEventFrame(event.senderFrame);
        return handler(payload);
    });
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    webContents: WebContents,
    payload: EventPayloadMapping[Key]
) {
    webContents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain) {
    if (isDev() && new URL(frame.url).host === 'localhost:5123') {
        return;
    }
    if (frame.url !== pathToFileURL(getUIPath()).toString()) {
        throw new Error('Malicious event');
    }
}
export { isDev };
