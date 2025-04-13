import { BrowserWindow, dialog } from 'electron';
import {
  getIconPath,
  getPreloadPath,
  getUIPath,
  isDev,
} from '../pathResolver.js';
import {
  checkFile,
  getVehiclesAndViews,
  getViewsByVehicle,
  importFile,
  initDb,
} from './ipcHandlers.js';
import { ipcMainHandle } from '../util.js';
import { sequelize } from '../database.js';
import {
  createVehicle,
  deleteVehicle,
  getAllVehicles,
  getVehicle,
  updateVehicle,
} from './vehicleApiHandlers.js';
import {
  createView,
  deleteView,
  getAllViews,
  getView,
  updateView,
} from './viewApiHandlers.js';
import {
  countBrands,
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrand, getBrandForName,
  updateBrand,
} from './brandApiHandlers.js';

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    width: 1400,
    height: 800,
    autoHideMenuBar: true,
    icon: getIconPath(),
  });

  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
  } else {
    mainWindow.loadFile(getUIPath());
  }

  mainWindow.webContents.openDevTools();

  initDb(sequelize);

  const selectFile = async () => {
    if (!mainWindow) return '';

    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
    });
    if (result.canceled) return '';

    return result.filePaths[0];
  };

  ipcMainHandle('getVehiclesAndViews', getVehiclesAndViews);
  ipcMainHandle('import', (file: string) => {
    importFile(file);
  });
  ipcMainHandle('selectFile', selectFile);
  ipcMainHandle('checkFile', (file: string) => checkFile(file));
  ipcMainHandle('getViewsByVehicle', (vehicleId: number) =>
    getViewsByVehicle(vehicleId)
  );

  ipcMainHandle('createVehicle', createVehicle);
  ipcMainHandle('getVehicle', getVehicle);
  ipcMainHandle('getAllVehicles', getAllVehicles);
  ipcMainHandle('updateVehicle', updateVehicle);
  ipcMainHandle('deleteVehicle', deleteVehicle);

  ipcMainHandle('createView', createView);
  ipcMainHandle('getView', getView);
  ipcMainHandle('getAllViews', getAllViews);
  ipcMainHandle('updateView', updateView);
  ipcMainHandle('deleteView', deleteView);

  ipcMainHandle('createBrand', createBrand);
  ipcMainHandle('getBrand', getBrand);
  ipcMainHandle('getBrandForName', getBrandForName);
  ipcMainHandle('countBrands', countBrands);
  ipcMainHandle('getAllBrands', getAllBrands);
  ipcMainHandle('updateBrand', updateBrand);
  ipcMainHandle('deleteBrand', deleteBrand);
};

export default createWindow;
