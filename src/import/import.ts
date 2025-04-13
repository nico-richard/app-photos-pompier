import xlsx from 'node-xlsx';
import { createVehicle } from './vehicleCreation.js';
import { sequelize } from '../electron/database.js';

async function syncDatabase() {
  await sequelize.sync({ force: true });
}

async function parseVehicles(filePath: string) {
  const workSheetsFromFile = xlsx.parse(filePath);
  for (const sheet of workSheetsFromFile) {
    if (sheet.name.toUpperCase() === 'CITROEN') {
      for (const row of sheet.data as string[][]) {
        if (row && row[0] && row[0].startsWith(sheet.name.toUpperCase())) {
          await createVehicle(row, filePath);
        }
      }
    }
  }
}

export async function executeImport(filePath: string) {
  try {
    console.log('Chemin absolu du fichier:', filePath);
    await syncDatabase();
    await parseVehicles(filePath);
  } catch (e) {
    console.warn(e);
  }
}
