import { View } from '../models/View.js';
import path from 'path';
import { getImageHash } from '../electron/util.js';

async function createView(vehicleId: number, name: string, filePath: string) {
  const url = path.join(path.dirname(filePath), name) + '.JPG';
  const hash = getImageHash(url);
  const viewsWithHash = await View.findAll({ where: { hash: hash } });
  const isViewExisting = viewsWithHash.length > 0;
  if (isViewExisting) {
    console.log(
      'View [',
      url,
      '] already exists : [',
      viewsWithHash.map((view) => view.toString()),
      ']'
    );
    return false;
  }
  await View.build({
    name,
    vehicleId,
    url,
    hash,
  }).save();
  return true;
}

export async function handleViewCreation(
  vehicleId: number,
  viewsString: string,
  filePath: string
): Promise<number> {
  const views = viewsString?.match(/\d+([a-zA-Z]+)/);
  const viewName = viewsString?.replace(/\d+[a-zA-Z]+/, (match) =>
    match.replace(/[a-zA-Z]+/, '')
  );
  let failedViews = 0;
  failedViews += (await createView(vehicleId, viewName ?? '', filePath))
    ? 0
    : 1;
  if (views && views[1]) {
    for (const view of views[1].split('')) {
      failedViews += (await createView(vehicleId, viewName + view, filePath))
        ? 0
        : 1;
    }
  }
  return failedViews;
}
