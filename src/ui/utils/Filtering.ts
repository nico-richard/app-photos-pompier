import { View } from '../../models/View';
import { ViewFilters } from '../../models/ViewFilters';

export const applyFilters = (
  view: View,
  filters: ViewFilters | undefined
): boolean => {
  if (!filters) return true;

  const vehicle = view.vehicle;
  if (!vehicle) return true;

  for (const [key, value] of Object.entries(filters)) {
    if (!value || (Array.isArray(value) && value.length === 0)) continue;

    switch (key) {
      case 'brand':
        if (
          !value
            .map((brand: string) => brand.toUpperCase())
            .includes(vehicle.brand?.name.toUpperCase())
        ) {
          return false;
        }
        break;

      case 'dateMin':
        if (vehicle?.date && vehicle.date < value) {
          return false;
        }
        break;

      case 'dateMax':
        if (vehicle?.date && vehicle.date > value) {
          return false;
        }
        break;

      default:
        const vehicleValue = vehicle[key as keyof typeof vehicle]
          ?.toString()
          .toLowerCase();
        if (!vehicleValue?.includes(value.toString().toLowerCase())) {
          return false;
        }
    }
  }

  // Si aucun filtre n'a invalidé la vue, on retourne true
  return true;
};
