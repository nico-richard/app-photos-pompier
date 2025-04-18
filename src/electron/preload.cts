import { Vehicle } from '../models/Vehicle';
import { View } from '../models/View';
import { Brand } from '../models/Brand';

const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
  getVehiclesAndViews: () => ipcInvoke('getVehiclesAndViews'),
  import: (file: string) => ipcInvoke('import', file),
  selectFile: () => ipcInvoke('selectFile'),
  selectFiles: () => ipcInvoke('selectFiles'),
  checkFile: (file: string) => ipcInvoke('checkFile', file),
  getViewsByVehicle: (vehicleId: number) =>
    ipcInvoke('getViewsByVehicle', vehicleId),
} satisfies Window['electron']);

electron.contextBridge.exposeInMainWorld('vehicleAPI', {
  createVehicle: (vehicle: Vehicle) => ipcInvoke('createVehicle', vehicle),
  getVehicle: (vehicleId: number) => ipcInvoke('getVehicle', vehicleId),
  getVehicleForView: (view: View) => ipcInvoke('getVehicleForView', view),
  getMinMaxVehiclesDate: () => ipcInvoke('getMinMaxVehiclesDate'),
  getAllVehicles: () => ipcInvoke('getAllVehicles'),
  updateVehicle: (vehicleToUpdate: Vehicle, vehicle: Vehicle) =>
    ipcInvoke('updateVehicle', { vehicleToUpdate, vehicle }),
  deleteVehicle: (vehicleId: number) => ipcInvoke('deleteVehicle', vehicleId),
} satisfies Window['vehicleAPI']);

electron.contextBridge.exposeInMainWorld('viewAPI', {
  createView: (view: View) => ipcInvoke('createView', view),
  getView: (viewId: number) => ipcInvoke('getView', viewId),
  getAllViews: () => ipcInvoke('getAllViews'),
  updateView: (viewToUpdate: View, view: View) =>
    ipcInvoke('updateView', { viewToUpdate, view }),
  deleteView: (viewId: number) => ipcInvoke('deleteView', viewId),
} satisfies Window['viewAPI']);

electron.contextBridge.exposeInMainWorld('brandAPI', {
  createBrand: (brand: Brand) => ipcInvoke('createBrand', brand),
  getBrand: (brandId: number) => ipcInvoke('getBrand', brandId),
  getBrandForName: (brandName: string) =>
    ipcInvoke('getBrandForName', brandName),
  countBrands: () => ipcInvoke('countBrands'),
  getAllBrands: () => ipcInvoke('getAllBrands'),
  updateBrand: (brandToUpdate: Brand, brand: Brand) =>
    ipcInvoke('updateBrand', { brandToUpdate, brand }),
  deleteBrand: (brandId: number) => ipcInvoke('deleteBrand', brandId),
} satisfies Window['brandAPI']);

function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key,
  args?: any
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key, args);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}

function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key]
) {
  electron.ipcRenderer.send(key, payload);
}
