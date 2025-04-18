import { Vehicle } from '../../models/Vehicle.js';
import { Brand } from '../../models/Brand.js';
import { View } from '../../models/View.js';
import { sequelize } from '../database.js';
import { QueryTypes } from 'sequelize';

export const createVehicle = async (vehicle: Vehicle) => {
  console.log(`Vehicle creation : ${JSON.stringify(vehicle)}`);
  return await Vehicle.create(vehicle);
};
export const getVehicle = async (vehicleId: number) => {
  return (
    await Vehicle.findOne({
      where: { id: vehicleId },
      include: { all: true, nested: true },
    })
  )?.get({
    plain: true,
  }) as Vehicle;
};
export const getVehicleForView = async (view: View) => {
  return view.vehicle;
};
export const getMinMaxVehiclesDate = async (): Promise<{
  min: number;
  max: number;
}> => {
  const result = await sequelize.query<{ min: number; max: number }>(
    `select min(date) as min, max(date) as max
     from vehicle`,
    { type: QueryTypes.SELECT }
  );
  return result.length > 0 ? result[0] : { min: 0, max: 10000 };
};
export const getAllVehicles = async () => {
  return (
    await Vehicle.findAll({ include: { model: Brand, as: 'brand' } })
  ).map((vehicle) => vehicle.get({ plain: true })) as Vehicle[];
};
export const updateVehicle = async (args: {
  vehicleToUpdate: Vehicle;
  vehicle: Vehicle;
}) => {
  return await Vehicle.update(args.vehicle, {
    where: { id: args.vehicleToUpdate.id },
  });
};
export const deleteVehicle = async (vehicleId: number) => {
  return await Vehicle.destroy({ where: { id: vehicleId } });
};
