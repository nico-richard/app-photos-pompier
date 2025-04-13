import { MRT_ColumnDef } from 'mantine-react-table';
import { Vehicle } from '../../models/Vehicle';
import { View } from '../../models/View';
import { Brand } from '../../models/Brand';

export const vehicleColumns: MRT_ColumnDef<Vehicle>[] = [
  {
    header: 'Marque',
    editVariant: 'select',
    accessorFn: (row) => row.brand?.name,
    id: 'brand',
    mantineEditSelectProps: {
      data: ['Renault', 'Peugeot'],
    },
    size: 1,
  },
  {
    header: 'Modèle',
    accessorKey: 'model',
    size: 1,
  },
  {
    header: 'Équipment',
    accessorKey: 'equipment',
    size: 1,
  },
  {
    header: 'Propriétaire',
    accessorKey: 'owner',
    size: 1,
  },
  {
    header: 'Date',
    accessorKey: 'date',
    filterVariant: 'range-slider',
    filterFn: 'betweenInclusive',
    mantineFilterRangeSliderProps: {
      minRange: 5,
    },
    size: 1,
  },
  {
    header: 'Commentaire',
    accessorKey: 'comment',
    size: 1,
  },
  {
    header: 'Immatriculation',
    accessorKey: 'license',
    size: 1,
  },
];
export const vueColumns: MRT_ColumnDef<View>[] = [
  {
    header: 'Véhicule',
    accessorKey: 'vehicleId',
    filterFn: 'equals',
    size: 1,
  },
  {
    header: 'Nom',
    accessorKey: 'name',
    size: 1,
  },
  {
    header: 'Url',
    accessorKey: 'url',
    size: 1,
  },
];
export const brandColumns: MRT_ColumnDef<Brand>[] = [
  {
    header: 'Nom',
    accessorKey: 'name',
    size: 1,
  }
];
