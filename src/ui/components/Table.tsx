import React, { ReactNode, useEffect, useMemo } from 'react';
import {
  LiteralUnion,
  MantineReactTable,
  MRT_ColumnDef,
  MRT_Row,
  MRT_RowData,
  MRT_TableInstance,
  MRT_TableOptions,
  useMantineReactTable,
} from 'mantine-react-table';
import { MRT_Localization_FR } from 'mantine-react-table/locales/fr/index.esm.mjs';
import {
  ActionIcon,
  Button,
  Flex,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  IconEdit,
  IconPhotoPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';
import { DeepKeys } from '@tanstack/react-table';
import { notifications } from '@mantine/notifications';

interface TableProps<T extends MRT_RowData> {
  data: T[];
  columns: MRT_ColumnDef<T>[];
  setActiveTab?: Function;
  selectedId?: number;
  refreshData?: Function;
  selectTooltip?: boolean;
  onCreate?: (object: T) => Promise<T | null>;
  onUpdate?: (
    objectToUpdate: T,
    object: Record<LiteralUnion<DeepKeys<T> & string>, any>
  ) => Promise<T | null>;
  onDelete?: (row: T) => Promise<T>;
  onSelectRow?: (row: T) => void;
  onAddViewForRow?: (row: T) => void;
  tableOptions?: any;
  children?: ReactNode;
}

const Table = <T extends MRT_RowData>(props: TableProps<T>) => {
  const theme = useMantineTheme();
  const columns = useMemo<MRT_ColumnDef<T>[]>(
    () => props.columns,
    [props.columns]
  );

  useEffect(() => {
    if (columns.find((col) => col.id === 'vehicleId')) {
      table.setColumnFilters([
        {
          id: 'vehicleId',
          value: props.selectedId,
        },
      ]);
    }
  }, [props.selectedId]);

  const handleSelectRow = (row: MRT_Row<T>) => {
    props.onSelectRow?.(row.original);
  };

  const handleAddViewForRow = (row: MRT_Row<T>) => {
    props.onAddViewForRow?.(row.original);
  };

  const handleEditRow = (row: MRT_Row<T>, table: MRT_TableInstance<T>) => {
    table.setEditingRow(row);
  };

  const handleDeleteRow = async (row: T) => {
    if (props.onDelete) {
      console.log('Delete: ', row);
      await props.onDelete(row);
      props.refreshData?.();
    }
  };

  const handleSaveCreation: MRT_TableOptions<T>['onCreatingRowSave'] = async ({
    values,
    exitCreatingMode,
  }) => {
    if (props.onCreate) {
      console.log('Create: ', values);
      const t = await props.onCreate(values as any);
      if (!t) {
        notifications.show({
          title: 'Erreur de création de la ligne',
          message: 'Impossible de sauvegarder les modifications',
          color: 'red',
        });
        return;
      }
      notifications.show({
        title: 'Succès',
        message: 'Ligne créée avec succès',
        color: 'green',
      });
      exitCreatingMode();
      props.refreshData?.();
    }
  };

  const handleSaveEdition: MRT_TableOptions<T>['onEditingRowSave'] = async ({
    row,
    values,
    table,
    exitEditingMode,
  }) => {
    console.log('values : ', values);
    console.log('row : ', row);
    console.log('table : ', table);
    if (props.onUpdate) {
      console.log('Edit: ', values);
      const t = await props.onUpdate(row.original, values);
      if (!t) {
        notifications.show({
          title: 'Erreur de modification de la ligne',
          message: 'Impossible de sauvegarder les modifications',
          color: 'red',
        });
        return;
      }
      notifications.show({
        title: 'Succès',
        message: 'Ligne modifiée avec succès',
        color: 'green',
      });
      exitEditingMode();
    }
  };

  const openDeleteConfirmModal = (row: MRT_Row<T>) =>
    modals.openConfirmModal({
      title: 'Voulez vous vraiment supprimer cette ligne ?',
      labels: { confirm: 'Supprimer', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      onConfirm: () => handleDeleteRow(row.original),
    });

  const table = useMantineReactTable<T>({
    columns,
    data: props.data,
    localization: MRT_Localization_FR,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableFacetedValues: true,
    createDisplayMode: 'row',
    editDisplayMode: 'row',
    enableEditing: true,
    onCreatingRowSave: handleSaveCreation,
    onEditingRowSave: handleSaveEdition,
    initialState: {
      density: 'xs',
      pagination: { pageIndex: 0, pageSize: 20 },
      columnPinning: {
        right: ['mrt-row-actions'],
      },
    },
    enableFilterMatchHighlighting: false,
    enableRowActions:
      props.data.find((data) => {
        return data.brand;
      }) !== undefined,
    renderRowActions: ({
      row,
      table,
    }: {
      row: MRT_Row<T>;
      table: MRT_TableInstance<T>;
    }) => (
      <Flex gap="sm">
        {props.selectTooltip && (
          <>
            <Tooltip label="Détails">
              <ActionIcon
                color={theme.colors!.blue[7]}
                onClick={() => handleSelectRow(row)}
              >
                <IconSearch />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Ajouter photo">
              <ActionIcon
                color={theme.colors!.green[8]}
                onClick={() => handleAddViewForRow(row)}
              >
                <IconPhotoPlus />
              </ActionIcon>
            </Tooltip>
          </>
        )}
        <Tooltip label="Éditer">
          <ActionIcon
            color={theme.colors!.orange[7]}
            onClick={() => handleEditRow(row, table)}
          >
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Supprimer">
          <ActionIcon
            color={theme.colors!.red[9]}
            onClick={() => {
              openDeleteConfirmModal(row);
            }}
          >
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        color={theme.colors!.green[9]}
        onClick={() => table.setCreatingRow(true)}
      >
        Ajouter
      </Button>
    ),
  });

  return (
    <div>
      <h1>{props.children}</h1>
      <MantineReactTable table={table} />
    </div>
  );
};
export default Table;
