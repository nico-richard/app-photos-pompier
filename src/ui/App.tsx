import { useEffect, useState } from 'react';
import './App.css';
import Table from './components/Table';
import { Vehicle } from '../models/Vehicle';
import { Container, Image, MantineProvider, Tabs } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';
import '@mantine/notifications/styles.css';
import { View } from '../models/View';
import ImportFile from './components/ImportFile';
import { brandColumns, vehicleColumns } from './data/tableColumns';
import { theme } from './data/theme';
import ViewsGallery from './components/ViewsGallery';
import { ModalsProvider } from '@mantine/modals';
import { ViewFilters } from '../models/ViewFilters';
import fireTruck from '../assets/fireTruck.png';
import Home from './components/Home';
import BrandsList from './components/BrandsList';
import { applyFilters } from './utils/Filtering';
import { Brand } from '../models/Brand';
import { Notifications } from '@mantine/notifications';

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>('home');
  const [selectedVehicle, setSelectedVehicle] = useState<number>();
  const [views, setViews] = useState<View[]>([]);
  const [filteredViews, setFilteredViews] = useState<View[]>([]);
  const [viewFilters, setViewFilters] = useState<ViewFilters>();
  const [brandsCount, setBrandsCount] = useState<
    { name: string; count: number }[]
  >([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  function countBrandsOnDb() {
    window.brandAPI.countBrands().then((res) => setBrandsCount(res));
  }

  const getAllVehicles = () => {
    window.vehicleAPI.getAllVehicles().then((vehicles) => {
      console.log('Vehicles : ', vehicles);
      setVehicles(vehicles);
    });
  };

  const getAllViews = () => {
    window.viewAPI.getAllViews().then((views) => {
      console.log('Views : ', views);
      setViews(views.sort(() => Math.random() - 0.5));
    });
  };

  const getAllBrands = () => {
    window.brandAPI.getAllBrands().then((brands) => {
      console.log('Brands : ', brands);
      setBrands(brands);
    });
  };

  const handleFilterChange = (filters: ViewFilters) => {
    setViewFilters(filters);
  };

  useEffect(() => {
    getAllVehicles();
    countBrandsOnDb();
    getAllViews();
    getAllBrands();
  }, []);

  useEffect(() => {
    const filteredViews = views.filter((view) =>
      applyFilters(view, viewFilters)
    );
    setFilteredViews(filteredViews);
  }, [views, viewFilters]);

  function handleSelectVehicleInTable(row: Vehicle): void {
    setActiveTab('viewsGallery');
    setSelectedVehicle(row.id);
  }

  const handleVehicleUpdate = async (
    vehicleToUpdate: Vehicle,
    updatedData: Vehicle
  ) => {
    console.log('updatedData ', updatedData);
    const brandName = updatedData?.brand as unknown as string;
    if (!brandName) {
      console.log('No brand found');
      return;
    }
    const brandEntity = await window.brandAPI.getBrandForName(brandName);
    if (!brandEntity) {
      console.log('No brand entity found for name : ' + brandName);
      return;
    }
    return window.vehicleAPI.updateVehicle(vehicleToUpdate, {
      ...updatedData,
      brandId: brandEntity.id,
    });
  };

  return (
    <MantineProvider theme={theme} defaultColorScheme={'dark'}>
      <Notifications />
      <ModalsProvider>
        <Image
          src={fireTruck}
          w={40}
          h={40}
          style={{ position: 'absolute', top: 10, left: 10 }}
        />
        <Container style={{ margin: '1rem' }} fluid>
          <Tabs
            value={activeTab}
            onChange={(value: string | null) => {
              setActiveTab(value);
              if (value === 'vehicleList') {
                getAllVehicles();
              }
            }}
            keepMounted={false}
            variant={'pills'}
            color={theme.colors!.red![7]}
          >
            <Tabs.List h={40}>
              <Tabs.Tab style={{ marginLeft: 30 }} value="home">
                Accueil
              </Tabs.Tab>
              <Tabs.Tab value="vehicleList">Véhicules</Tabs.Tab>
              <Tabs.Tab value="viewsGallery">Vues</Tabs.Tab>
              <Tabs.Tab value="import">Import</Tabs.Tab>
              <Tabs.Tab value="brandsList">Marques</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="home">
              <Home />
            </Tabs.Panel>
            <Tabs.Panel value="vehicleList">
              <Table
                data={vehicles}
                columns={vehicleColumns}
                setActiveTab={setActiveTab}
                refreshData={() => {
                  getAllVehicles();
                  getAllViews();
                  getAllBrands();
                }}
                onCreate={(vehicleToCreate) =>
                  window.vehicleAPI.createVehicle(vehicleToCreate)
                }
                onUpdate={handleVehicleUpdate}
                onDelete={(vehicleToDelete) =>
                  window.vehicleAPI.deleteVehicle(vehicleToDelete.id)
                }
                onSelectRow={handleSelectVehicleInTable}
                tableOptions={brands}
              />
            </Tabs.Panel>
            <Tabs.Panel value="viewsGallery">
              <ViewsGallery
                views={filteredViews}
                onFilterChange={handleFilterChange}
                brands={brandsCount}
              />
            </Tabs.Panel>
            <Tabs.Panel value="import">
              <ImportFile />
            </Tabs.Panel>
            <Tabs.Panel value="brandsList">
              <BrandsList
                brands={brandsCount}
                onBrandChange={countBrandsOnDb}
              />
              <Table data={brands} columns={brandColumns} />
            </Tabs.Panel>
          </Tabs>
        </Container>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
