import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Flex,
  Grid,
  Image,
  useMantineTheme,
} from '@mantine/core';
import { View } from '../../models/View';
import { useDisclosure } from '@mantine/hooks';
import SelectedVehicleModal from './SelectedVehicleModal';
import ViewFilter from './ViewFilter';
import { ViewFilters } from '../../models/ViewFilters';

interface ViewsGalleryProps {
  views: View[];
  onFilterChange: (filters: ViewFilters) => void;
  brands: { name: string, count: number }[];
}

const ViewsGallery = (props: ViewsGalleryProps) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedView, setSelectedView] = useState<View | undefined>(undefined);
  const [vehicleModalOpened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  useEffect(() => {}, []);

  const handleLoadMore = () => setVisibleCount((prev) => prev + 6);

  return (
    <div>
      <h1>Gallerie des photos</h1>
      <Flex justify="space-evenly">
        <SelectedVehicleModal
          vehicleModalOpened={vehicleModalOpened}
          close={close}
          selectedImage={selectedView}
        />
        <ViewFilter onFilterChange={props.onFilterChange} brands={props.brands} />
        <Container
          fluid
          style={{
            margin: '1.5rem 0 0 0',
            paddingTop: '1.5rem',
            overflowY: 'auto',
            height: '80vh',
            borderRadius: '5px',
            backgroundColor: theme.colors.black[6],
          }}
        >
          <Grid align="center">
            {props.views.slice(0, visibleCount).map((view, index) => (
              <Grid.Col span={4} key={index}>
                <label>
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
                </label>
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
