import path from 'path';
import { app } from 'electron';

export function getPreloadPath() {
  return path.join(
    app.getAppPath(),
    isDev() ? '.' : '..',
    '/dist-electron/electron/preload.cjs'
  );
}

export function getUIPath() {
  return path.join(app.getAppPath(), '/dist-react/index.html');
}

export function getAssetPath() {
  return path.join(app.getAppPath(), isDev() ? '.' : '..', '/src/assets');
}

export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function getIconPath(): string {
  return path.join(app.getAppPath(), 'src', 'assets', 'fireTruck.png');
}

export function getDbPath(): string {
  return isDev()
    ? path.join(app.getAppPath(), 'src', 'db.sqlite')
    : path.join(app.getPath('userData'), 'db.sqlite');
}

export function getImportPath(): string {
  return path.join(
    app.getAppPath(),
    isDev() ? '.' : '..',
    '/dist-electron/import/import.js'
  );
}

export function getImportFilePath(): string {
  return path.join(app.getAppPath(), 'src', 'fichier.xls');
}
