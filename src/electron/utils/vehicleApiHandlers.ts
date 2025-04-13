import { Vehicle } from '../../models/Vehicle.js';
import { Brand } from '../../models/Brand.js';

export const createVehicle = async (vehicle: Vehicle) => {
  console.log(`Vehicle creation : ${ JSON.stringify(vehicle) }`);
  return await Vehicle.create({ ...vehicle });
};
export const getVehicle = async (vehicleId: number) => {
  return (await Vehicle.findOne({ where: { id: vehicleId } }))?.get({
    plain: true,
  }) as Vehicle;
};
export const getAllVehicles = async () => {
  return (await Vehicle.findAll({ include: { model: Brand, as: 'brand' } })).map((vehicle) =>
    vehicle.get({ plain: true })
  ) as Vehicle[];
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
