import React, { useEffect, useState } from 'react';
import { ViewFilters } from '../../models/ViewFilters';
import {
  Button,
  ComboboxItem,
  ComboboxLikeRenderOptionInput,
  Container,
  MultiSelect,
  RangeSlider,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import {
  SiCitroen,
  SiFiat,
  SiFord,
  SiLandrover,
  SiMercedes,
  SiMitsubishi,
  SiNissan,
  SiOpel,
  SiPeugeot,
  SiRenault,
  SiVolkswagen,
} from 'react-icons/si';
import { FaCar } from 'react-icons/fa';
import { Brand } from '../../models/Brand';
import { View } from '../../models/View';

interface ViewFilterProps {
  onFilterChange: (filters: ViewFilters) => void;
  brands: Brand[];
  views: View[];
}

function ViewFilter(props: ViewFilterProps) {
  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const [modelFilter, setModelFilter] = useState<string>('');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('');
  const [ownerFilter, setOwnerFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<[number, number]>([1899, 2031]);
  const [minMaxDates, setMinMaxDates] = useState<{
    min: number;
    max: number;
  }>({ min: 0, max: 0 });
  const theme = useMantineTheme();

  const getMinMaxVehiclesDate = async () =>
    await window.vehicleAPI.getMinMaxVehiclesDate();

  useEffect(() => {
    console.log('useEffect 1 triggered');
    props.onFilterChange({
      brand: brandFilter,
      model: modelFilter,
      equipment: equipmentFilter,
      owner: ownerFilter,
      dateMin: dateFilter[0],
      dateMax: dateFilter[1],
    });
  }, [brandFilter, modelFilter, equipmentFilter, ownerFilter, dateFilter]);

  useEffect(() => {
    const extractedDates = props.views
      .map((view) => view.vehicle?.date)
      .filter((value): value is number => typeof value === 'number');

    if (extractedDates.length > 0) {
      const minDate = Math.min(...extractedDates);
      const maxDate = Math.max(...extractedDates);
      if (minDate !== dateFilter[0] || maxDate !== dateFilter[1]) {
        setDateFilter([minDate, maxDate]);
      }
    }

    getMinMaxVehiclesDate().then((minMax) => {
      console.log('minmax', minMax);
      setMinMaxDates(minMax);
    });
  }, []);

  const clear = () => {
    setBrandFilter([]);
    setModelFilter('');
    setEquipmentFilter('');
    setOwnerFilter('');
    setDateFilter([minMaxDates.min, minMaxDates.max]);
  };

  function getLogo(item: ComboboxLikeRenderOptionInput<ComboboxItem>) {
    switch (item.option.value) {
      case 'renault':
        return <SiRenault size={20} />;
      case 'peugeot':
        return <SiPeugeot size={20} />;
      case 'citroen':
        return <SiCitroen size={20} />;
      case 'fiat':
        return <SiFiat size={20} />;
      case 'ford':
        return <SiFord size={20} />;
      case 'land':
        return <SiLandrover size={20} />;
      case 'mercedes':
        return <SiMercedes size={20} />;
      case 'mitsubishi':
        return <SiMitsubishi size={20} />;
      case 'nissan':
        return <SiNissan size={20} />;
      case 'opel':
        return <SiOpel size={20} />;
      case 'panhard':
        return <FaCar size={20} />;
      case 'volkswagen':
        return <SiVolkswagen size={20} />;
      default:
        return '';
    }
  }

  const renderOption = (item: ComboboxLikeRenderOptionInput<ComboboxItem>) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {getLogo(item)}
        {item.option.label}
      </div>
    );
  };

  return (
    <Container
      style={{ paddingRight: 25, paddingLeft: 0, margin: 0, minWidth: '300px' }}
    >
      <Title order={3} mb={20}>
        Filtres
      </Title>
      <MultiSelect
        value={brandFilter}
        onChange={setBrandFilter}
        label="Marque"
        data={props.brands.map((brand) => {
          return { label: brand.name, value: brand.name.toLocaleLowerCase() };
        })}
        searchable
        renderOption={renderOption}
        clearable
        nothingFoundMessage="Aucune marque trouvée"
        hidePickedOptions
      />
      <TextInput
        label="Modèle"
        value={modelFilter}
        onChange={(event) => setModelFilter(event.currentTarget.value)}
      />
      <TextInput
        label="Équipement"
        value={equipmentFilter}
        onChange={(event) => setEquipmentFilter(event.currentTarget.value)}
      />
      <TextInput
        label="Propriétaire"
        value={ownerFilter}
        onChange={(event) => setOwnerFilter(event.currentTarget.value)}
      />
      <Text>Date</Text>
      <RangeSlider
        min={minMaxDates ? minMaxDates.min : 1900}
        max={minMaxDates ? minMaxDates.max : 2030}
        value={dateFilter}
        labelAlwaysOn
        style={{ marginTop: '2rem' }}
        onChange={setDateFilter}
      />
      <Button mt={20} color={theme.colors!.yellow![9]} onClick={clear}>
        Tout effacer
      </Button>
    </Container>
  );
}

export default ViewFilter;
