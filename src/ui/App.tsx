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
import { brandColumns, getVehicleColumns } from './data/tableColumns';
import { theme } from './data/theme';
import ViewsGallery from './components/ViewsGallery';
import { ModalsProvider } from '@mantine/modals';
import { ViewFilters } from '../models/ViewFilters';
import fireTruck from '../assets/fireTruck.png';
import Home from './components/Home';
import { applyFilters } from './utils/Filtering';
import { Brand } from '../models/Brand';
import { Notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import VehicleDetailsModal from './components/modals/VehicleDetailsModal';
import ReactMarkdown from 'react-markdown';

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>('home');
  const [views, setViews] = useState<View[]>([]);
  const [filteredViews, setFilteredViews] = useState<View[]>([]);
  const [viewFilters, setViewFilters] = useState<ViewFilters>();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [withFilters, setWithFilters] = useState<boolean>(true);
  const [addViewForVehicleModalOpened, addViewForVehicleModalTriggers] =
    useDisclosure(false);
  const [vehicleDetailsModalOpened, vehicleDetailsModalTriggers] =
    useDisclosure(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(
    undefined
  );
  const [markdownContent, setMarkdownContent] = useState('');

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

  const handleAddViewForRow = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    addViewForVehicleModalTriggers.open();
  };

  useEffect(() => {
    getAllVehicles();
    getAllViews();
    getAllBrands();
    fetch('../../readme.md')
      .then((response) => response.text())
      .then((text) => setMarkdownContent(text));
  }, []);

  useEffect(() => {
    const filteredViews = views.filter((view) =>
      applyFilters(view, viewFilters)
    );
    setFilteredViews(filteredViews);
  }, [views, viewFilters]);

  function handleSelectVehicleInTable(row: Vehicle): void {
    setSelectedVehicle(row);
    vehicleDetailsModalTriggers.open();
  }

  const handleVehicleUpdate = async (
    vehicleToUpdate: Vehicle,
    updatedData: Vehicle
  ): Promise<Vehicle | null> => {
    const brandEntity = await getBrandEntity(updatedData);
    if (brandEntity == null) {
      return null;
    }
    return window.vehicleAPI.updateVehicle(vehicleToUpdate, {
      ...updatedData,
      brandId: brandEntity.id,
    });
  };

  async function getBrandEntity(vehicle: Vehicle) {
    const brandName = vehicle?.brand as unknown as string;
    if (!brandName) {
      console.log('No brand found');
      return null;
    }
    const brandEntity = await window.brandAPI.getBrandForName(brandName);
    if (!brandEntity) {
      console.log('No brand entity found for name : ' + brandName);
      return null;
    }
    return brandEntity;
  }

  const handleVehicleCreation = async (
    vehicleToCreate: Vehicle
  ): Promise<Vehicle | null> => {
    const brandEntity = await getBrandEntity(vehicleToCreate);
    if (brandEntity == null) {
      return null;
    }
    return window.vehicleAPI.createVehicle({
      ...vehicleToCreate,
      brandId: brandEntity.id,
    });
  };

  return (
    <MantineProvider theme={theme} defaultColorScheme={'dark'}>
      <Notifications />
      <VehicleDetailsModal
        addViewForVehicleModalOpened={addViewForVehicleModalOpened}
        selectedVehicle={selectedVehicle}
        close={addViewForVehicleModalTriggers.close}
        title={'Ajouter des photos'}
        views={views}
        selectAndAddButtons
      />
      <VehicleDetailsModal
        addViewForVehicleModalOpened={vehicleDetailsModalOpened}
        selectedVehicle={selectedVehicle}
        close={vehicleDetailsModalTriggers.close}
        title={'Détails du véhicule'}
        views={views}
      />
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
              if (value !== 'viewsGallery') {
                setWithFilters(true);
              }
              if (value === 'vehicleList') {
                getAllVehicles();
              }
              if (value === 'viewsGallery') {
                getAllViews();
              }
              setActiveTab(value);
            }}
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
              <Tabs.Tab value="help">Aide</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="home">
              <Home />
            </Tabs.Panel>
            <Tabs.Panel value="vehicleList">
              <Table
                data={vehicles}
                columns={getVehicleColumns(brands)}
                setActiveTab={setActiveTab}
                selectTooltip
                refreshData={() => {
                  getAllVehicles();
                  getAllViews();
                  getAllBrands();
                }}
                onCreate={handleVehicleCreation}
                onUpdate={handleVehicleUpdate}
                onDelete={(vehicleToDelete) =>
                  window.vehicleAPI.deleteVehicle(vehicleToDelete.id)
                }
                onSelectRow={handleSelectVehicleInTable}
                onAddViewForRow={handleAddViewForRow}
                tableOptions={brands}
              >
                Liste des véhicules
              </Table>
            </Tabs.Panel>
            <Tabs.Panel value="viewsGallery">
              <ViewsGallery
                views={filteredViews}
                onFilterChange={handleFilterChange}
                brands={brands}
                withFilters={withFilters}
              />
            </Tabs.Panel>
            <Tabs.Panel value="import">
              <ImportFile />
              <Tabs.Panel value="brandsList">
                <Table
                  data={brands}
                  columns={brandColumns}
                  refreshData={() => {
                    getAllBrands();
                  }}
                  onCreate={(vehicleToCreate) =>
                    window.brandAPI.createBrand(vehicleToCreate)
                  }
                  onUpdate={(brandToUpdate, updatedData) =>
                    window.brandAPI.updateBrand(brandToUpdate, updatedData)
                  }
                  onDelete={(vehicleToDelete) =>
                    window.brandAPI.deleteBrand(vehicleToDelete.id)
                  }
                >
                  Liste des marques
                </Table>
              </Tabs.Panel>
            </Tabs.Panel>
            <Tabs.Panel value="help">
              <ReactMarkdown>{markdownContent}</ReactMarkdown>
            </Tabs.Panel>
          </Tabs>
        </Container>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
