import { Sequelize } from 'sequelize';
import { Vehicle } from '../../models/Vehicle.js';
import { View } from '../../models/View.js';
import { executeImport } from '../../import/import.js';
import { getBrandsForFile } from '../../import/importService.js';

export const getVehiclesAndViews = async (): Promise<{
  vehicles: Vehicle[];
  views: View[];
}> => {
  const vehicles = (await Vehicle.findAll()).map((vehicle) =>
    vehicle.get({ plain: true })
  ) as Vehicle[];
  const views = (await View.findAll()).map((view) =>
    view.get({ plain: true })
  ) as View[];
  return { vehicles, views };
};

export const initDb = async (sequelize: Sequelize) => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export const importFile = async (file: string) => {
  try {
    console.log('Importing file : ', file);
    await executeImport(file);
    console.log('Imported');
  } catch (error: any) {
    console.error('Error executing import module:', error);
  }
};

export const checkFile = async (file: string) => {
  return getBrandsForFile(file);
};

export const getViewsByVehicle = async (vehicleId: number) => {
  const views = await View.findAll({ where: { vehicleId: vehicleId } });
  return views.map((view) => view.get({ plain: true })) as View[];
};
