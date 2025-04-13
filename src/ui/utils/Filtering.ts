import { View } from '../../models/View';
import { ViewFilters } from '../../models/ViewFilters';

export const applyFilters = (
  view: View,
  filters: ViewFilters | undefined
): boolean => {
  if (!filters) return true;

  return Object.entries(filters).every(([key, value]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return true;
    }

    const viewValue = view.vehicle?.[key as keyof typeof view.vehicle]
      ?.toString()
      .toLowerCase();

    if (Array.isArray(value)) {
      return value.includes(viewValue || '');
    }

    if (typeof value === 'number') {
      switch (key) {
        case 'dateMin':
          return view.vehicle?.date ? view.vehicle?.date >= value : true;
        case 'dateMax':
          return view.vehicle?.date ? view.vehicle?.date <= value : true;
        default:
          return true;
      }
    }

    return viewValue?.includes(value.toString().toLowerCase());
  });
};