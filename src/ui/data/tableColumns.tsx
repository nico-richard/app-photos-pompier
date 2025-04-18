import {
  MRT_Cell,
  MRT_Column,
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
} from 'mantine-react-table';
import { Vehicle } from '../../models/Vehicle';
import { View } from '../../models/View';
import { Brand } from '../../models/Brand';
import { Select } from '@mantine/core';

export const getVehicleColumns = (
  brands: Brand[]
): MRT_ColumnDef<Vehicle>[] => {
  return [
    {
      header: 'Marque',
      editVariant: 'select',
      accessorFn: (row) => row.brand?.name,
      id: 'brand',
      filterVariant: 'autocomplete',
      mantineEditSelectProps: {
        data: ['brand1', 'brand2'],
      },
      Edit: ({
        row,
        column,
      }: {
        cell: MRT_Cell<Vehicle>;
        column: MRT_Column<Vehicle>;
        row: MRT_Row<Vehicle>;
        table: MRT_TableInstance<Vehicle>;
      }) => {
        return (
          <Select
            data={brands.map((brand) => brand.name)}
            defaultValue={row.original.brand?.name}
            onChange={(selectedValue) => {
              row._valuesCache[column.id] = selectedValue
            }}
          />
        );
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
};
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
  },
];
