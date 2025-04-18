import { View } from '../../models/View.js';

export const createView = async (view: View) => {
  console.log(`View creation : ${JSON.stringify(view)}`);
  return await View.create(view);
};
export const getView = async (viewId: number) => {
  return (
    await View.findOne({
      where: { id: viewId },
      include: { all: true, nested: true },
    })
  )?.get({
    plain: true,
  }) as View;
};
export const getAllViews = async () => {
  return (await View.findAll({ include: { all: true, nested: true } })).map(
    (view) => view.get({ plain: true })
  ) as View[];
};
export const updateView = async (args: { viewToUpdate: View; view: View }) => {
  return await View.update(args.view, {
    where: { id: args.viewToUpdate.id },
  });
};
export const deleteView = async (viewId: number) => {
  return await View.destroy({ where: { id: viewId } });
};
