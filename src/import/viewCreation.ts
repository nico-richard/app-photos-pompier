import { View } from '../models/View.js';
import path from 'path';

async function createView(vehicleId: number, name: string, filePath: string) {
  const url = path.join(path.dirname(filePath), name) + '.JPG';
  await View.build({
    name,
    vehicleId,
    url,
  }).save();
}

export async function handleViewCreation(
  vehicleId: number,
  viewsString: string,
  filePath: string
): Promise<void> {
  const views = viewsString?.match(/\d+([a-zA-Z]+)/);
  const viewName = viewsString?.replace(/\d+[a-zA-Z]+/, (match) =>
    match.replace(/[a-zA-Z]+/, '')
  );
  await createView(vehicleId, viewName ?? '', filePath);
  if (views && views[1]) {
    for (const view of views[1].split('')) {
      await createView(vehicleId, viewName + view, filePath);
    }
  }
}
