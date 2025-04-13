import { app, BrowserWindow, protocol } from 'electron';
import handleProtocol, { protocolName } from './utils/protocolHandler.js';
import createWindow from './utils/windowCreation.js';
import { closeDb, initDb } from './database.js';

protocol.registerSchemesAsPrivileged([
  { scheme: protocolName, privileges: { bypassCSP: true } },
]);
app.whenReady().then(async () => {
  try {
    handleProtocol();
    await initDb();
    await createWindow();

    app.on('activate', async () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        await createWindow();
      }
    });
  } catch (error) {
    console.error('Erreur lors de l’initialisation de l’application:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    closeDb();
    app.quit();
  }
});

app.on('before-quit', closeDb);
