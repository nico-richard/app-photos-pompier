type EventPayloadMapping = {
  getVehiclesAndViews: { vehicles: Vehicle[]; views: View[] };
  import: void;
  selectFile: string;
  selectFiles: string[];
  checkFile: { brand: string; count: number }[];
  getViewsByVehicle: View[];

  // Vehicle
  createVehicle: Vehicle;
  getVehicle: Vehicle;
  getVehicleForView: Vehicle;
  getMinMaxVehiclesDate: { min: number, max: number };
  getAllVehicles: Vehicle[];
  updateVehicle: Vehicle;
  deleteVehicle: Vehicle;

  // View
  createView: View;
  checkIfViewExists: boolean;
  getView: View;
  getAllViews: View[];
  updateView: View;
  deleteView: View;

  // Brand
  createBrand: Brand;
  getBrand: Brand;
  getBrandForName: Brand;
  countBrands: { name: string; count: number }[];
  getAllBrands: Brand[];
  updateBrand: Brand;
  deleteBrand: Brand;
};

interface Window {
  electron: {
    getVehiclesAndViews: () => Promise<{ vehicles: Vehicle[]; views: View[] }>;
    import: (filePath: string) => Promise<void>;
    selectFile: () => Promise<string>;
    selectFiles: () => Promise<string[]>;
    checkFile: (
      filePath: string
    ) => Promise<{ brand: string; count: number }[]>;
    getViewsByVehicle: (vehicleId: number) => Promise<View[]>;
  };
  vehicleAPI: {
    createVehicle: (vehicle: Vehicle) => Promise<Vehicle>;
    getVehicle: (vehicleId: number) => Promise<Vehicle>;
    getVehicleForView: (view: View) => Promise<Vehicle>;
    getMinMaxVehiclesDate: () => Promise<{ min: number, max: number }>;
    getAllVehicles: () => Promise<Vehicle[]>;
    updateVehicle: (
      vehicleToUpdate: Vehicle,
      vehicle: Vehicle
    ) => Promise<Vehicle>;
    deleteVehicle: (vehicleId: number) => Promise<Vehicle>;
  };
  viewAPI: {
    createView: (view: View) => Promise<View>;
    checkIfViewExists: (view: View) => Promise<boolean>;
    getView: (viewId: number) => Promise<View>;
    getAllViews: () => Promise<View[]>;
    updateView: (viewToUpdate: View, view: View) => Promise<View>;
    deleteView: (viewId: number) => Promise<View>;
  };
  brandAPI: {
    createBrand: (brand: Brand) => Promise<Brand>;
    getBrand: (brandId: number) => Promise<Brand>;
    getBrandForName: (brandName: string) => Promise<Brand>;
    countBrands: () => Promise<{ name: string; count: number }[]>;
    getAllBrands: () => Promise<Brand[]>;
    updateBrand: (brandToUpdate: Brand, brand: Brand) => Promise<Brand>;
    deleteBrand: (brandId: number) => Promise<Brand>;
  };
}
