import {
  getNumberRowValueAtIndex,
  getRowValueAtIndex,
} from './importService.js';
import { Vehicle } from '../models/Vehicle.js';
import { handleViewCreation } from './viewCreation.js';
import { Brand } from '../models/Brand.js';

export async function createVehicle(row: string[], filePath: string) {
  const firstColumn = getRowValueAtIndex(row, 0);
  const firstColumnSplitBySpace = firstColumn && firstColumn.split(' ');
  const brand = firstColumnSplitBySpace && firstColumnSplitBySpace[0];
  const firstColumnWithoutBrand = firstColumn.replace(brand, '');
  const model = firstColumnWithoutBrand && firstColumnWithoutBrand.trim();
  const equipment = getRowValueAtIndex(row, 1);
  const owner = getRowValueAtIndex(row, 2);
  const viewString = getRowValueAtIndex(row, 3);
  const date = getNumberRowValueAtIndex(row, 4);
  const comment = getRowValueAtIndex(row, 5);
  const license = getRowValueAtIndex(row, 6);

  const brandEntity = await Brand.findOne({
    where: { name: brand },
  });
  if (!brandEntity) {
    console.log('No brand found for name : ' + brand);
    return;
  }
  const vehicle = await Vehicle.build({
    brandId: brandEntity.id,
    model: model,
    equipment: equipment,
    owner: owner,
    date: date,
    comment: comment,
    license: license,
  }).save();
  await handleViewCreation(vehicle.id, viewString, filePath);
}
