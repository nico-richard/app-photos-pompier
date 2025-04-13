import { Button } from '@mantine/core';
import React from 'react';

interface BrandsListProps {
  brands: { name: string; count: number }[];
  onBrandChange: () => void;
}

const BrandsList = ({ brands, onBrandChange }: BrandsListProps) => {
  return (
    <div>
      <h1>Marques actuellement enregistrées</h1>
      <ul>
        {brands.map((data, index) => {
          return (
            <li key={index}>
              {data.name}: {data.count}
            </li>
          );
        })}
      </ul>
      <p>
        Total:{' '}
        {brands.reduce((acc, current) => {
          return acc + current.count;
        }, 0)}{' '}
        véhicules
      </p>
      <Button onClick={onBrandChange}>Actualiser</Button>
    </div>
  );
};

export default BrandsList;
