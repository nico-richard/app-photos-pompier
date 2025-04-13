import React, { useEffect, useState } from 'react';
import { ViewFilters } from '../../models/ViewFilters';
import {
  ComboboxItem,
  ComboboxLikeRenderOptionInput,
  Container,
  MultiSelect,
  RangeSlider,
  Text,
  TextInput,
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

interface ViewFilterProps {
  onFilterChange: (filters: ViewFilters) => void;
  brands: { name: string; count: number }[];
}

function ViewFilter(props: ViewFilterProps) {
  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const [modelFilter, setModelFilter] = useState<string>('');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('');
  const [ownerFilter, setOwnerFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<[number, number]>([1900, 2025]);

  useEffect(() => {
    props.onFilterChange({
      brand: brandFilter,
      model: modelFilter,
      equipment: equipmentFilter,
      owner: ownerFilter,
      dateMin: dateFilter[0],
      dateMax: dateFilter[1],
    });
  }, [brandFilter, modelFilter, equipmentFilter, ownerFilter, dateFilter]);

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
      <h3>Filtres</h3>
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
        min={1900}
        max={2030}
        value={dateFilter}
        labelAlwaysOn
        style={{ marginTop: '2rem' }}
        onChange={setDateFilter}
      />
    </Container>
  );
}

export default ViewFilter;
