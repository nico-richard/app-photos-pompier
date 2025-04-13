import { Brand } from '../../models/Brand.js';

export const createBrand = async (brand: Brand) => {
  console.log(`Brand creation : ${JSON.stringify(brand)}`);
  return await Brand.create({ ...brand });
};
export const getBrand = async (brandId: number) => {
  return (await Brand.findOne({ where: { id: brandId } }))?.get({
    plain: true,
  }) as Brand;
};
export const getBrandForName = async (brandName: string) => {
  return (await Brand.findOne({ where: { name: brandName } }))?.get({
    plain: true,
  }) as Brand;
};
export const countBrands = async (): Promise<
  { name: string; count: number }[]
> => {
  // return await sequelize.query<{ name: string; count: number }>(
  //   'select name, count() as count from brand group by name',
  //   {
  //     type: QueryTypes.SELECT,
  //   }
  // );
  return new Promise((resolve, reject) => {});
};
export const getAllBrands = async () => {
  return (await Brand.findAll()).map((brand) =>
    brand.get({ plain: true })
  ) as Brand[];
};
export const updateBrand = async (args: {
  brandToUpdate: Brand;
  brand: Brand;
}) => {
  return await Brand.update(args.brand, {
    where: { id: args.brandToUpdate.id },
  });
};
export const deleteBrand = async (brandId: number) => {
  return await Brand.destroy({ where: { id: brandId } });
};
