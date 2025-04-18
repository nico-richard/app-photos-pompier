import xlsx from 'node-xlsx';
import { createVehicle } from './vehicleCreation.js';
import { sequelize } from '../electron/database.js';
import { Brand } from '../models/Brand.js';

async function syncDatabase() {
  await sequelize.sync();
}

async function parseExcelSheets(filePath: string) {
  const sheets = xlsx.parse(filePath);
  for (const sheet of sheets) {
    // if (sheet.name.toUpperCase() === 'CITROEN') {
    const sheetName = sheet.name.toUpperCase();
    await Brand.create({ name: sheetName });
    for (const row of sheet.data as string[][]) {
      if (row && row[0] && row[0].startsWith(sheetName)) {
        await createVehicle(row, filePath, sheetName);
      }
    }
    // }
  }
}

export async function executeImport(filePath: string) {
  try {
    console.log('Chemin absolu du fichier:', filePath);
    await syncDatabase();
    await parseExcelSheets(filePath);
  } catch (e) {
    console.warn(e);
  }
}
