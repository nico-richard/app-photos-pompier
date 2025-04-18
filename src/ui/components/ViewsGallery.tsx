import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Flex,
  Grid,
  Image,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { View } from '../../models/View';
import { useDisclosure } from '@mantine/hooks';
import SelectedViewModal from './modals/SelectedViewModal';
import ViewFilter from './ViewFilter';
import { ViewFilters } from '../../models/ViewFilters';
import { Brand } from '../../models/Brand';
import { Vehicle } from '../../models/Vehicle';

interface ViewsGalleryProps {
  views: View[];
  onFilterChange: (filters: ViewFilters) => void;
  brands: Brand[];
  withFilters: boolean;
}

const ViewsGallery = (props: ViewsGalleryProps) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedView, setSelectedView] = useState<View | undefined>(undefined);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>();
  const [vehicleModalOpened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  useEffect(() => {
    setSelectedVehicle(props.views[0]?.vehicle);
  }, []);

  const handleLoadMore = () => setVisibleCount((prev) => prev + 6);

  return (
    <div>
      <Title order={1} m={20}>
        Gallerie des photos
      </Title>
      {!props.withFilters && (
        <h3
          style={{
            textAlign: 'center',
            marginBottom: 0,
          }}
        >
          {' '}
          {`${selectedVehicle?.brand?.name} ${selectedVehicle?.model}`}
        </h3>
      )}
      <Flex justify="space-evenly">
        <SelectedViewModal
          viewModalOpened={vehicleModalOpened}
          close={close}
          selectedView={selectedView}
        />
        {props.withFilters && (
          <ViewFilter
            onFilterChange={props.onFilterChange}
            brands={props.brands}
            views={props.views}
          />
        )}
        <Container
          fluid
          style={{
            padding: '1rem',
            overflowY: 'auto',
            maxHeight: '80vh',
            borderRadius: '5px',
            backgroundColor: theme.colors.black[6],
          }}
        >
          <Grid align="center">
            {props.views.slice(0, visibleCount).map((view, index) => (
              <Grid.Col span={4} key={index}>
                <Image
                  src={`perso:///${view.url}`}
                  loading="lazy"
                  radius="sm"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedView(view);
                    open();
                  }}
                />
              </Grid.Col>
            ))}
          </Grid>
          {props.views.length > 0 && visibleCount <= props.views.length && (
            <Button
              onClick={handleLoadMore}
              disabled={visibleCount >= props.views.length}
              style={{ marginTop: '1rem' }}
            >
              Charger plus
            </Button>
          )}
        </Container>
      </Flex>
    </div>
  );
};
export default ViewsGallery;
