import React, { useEffect, useState } from 'react';
import { Vehicle } from '../../../models/Vehicle';
import {
  Button,
  Container,
  Grid,
  Image,
  List,
  Modal,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { MdConstruction, MdDateRange } from 'react-icons/md';
import { TbNumber123 } from 'react-icons/tb';
import { LuKeyRound } from 'react-icons/lu';
import { FaRegCommentAlt } from 'react-icons/fa';
import { IconX } from '@tabler/icons-react';
import { View } from '../../../models/View';

interface AddViewForVehicleModalProps {
  addViewForVehicleModalOpened: boolean;
  close: () => void;
  selectedVehicle: Vehicle | undefined;
  title: string;
  views?: View[];
  selectAndAddButtons?: boolean;
}

const VehicleDetailsModal = (props: AddViewForVehicleModalProps) => {
  const [displayedImages, setDisplayedImages] = useState<string[]>([]);
  const theme = useMantineTheme();

  useEffect(() => {
    console.log('views :', props.views);
    if (props.views) {
      const images = props.views
        .filter((view) => {
          return view.url && view.vehicle?.id === props.selectedVehicle?.id;
        })
        .map((image) => image.url!);
      console.log(images);
      setDisplayedImages(images);
    }
  }, [props.selectedVehicle]);

  const handleImportImage = async () => {
    await window.electron.selectFiles().then((files) => {
      setDisplayedImages([...displayedImages, ...files]);
    });
  };

  const handleAddImportedImages = async () => {
    for (const image of displayedImages) {
      if (!props.selectedVehicle?.id) {
        console.log('Vehicle id not found');
      }
      const view = {
        name: image.split('\\')[image.split('\\').length - 1].split('.')[0],
        url: image,
        vehicleId: props.selectedVehicle?.id!,
      };
      console.log('Creates view : ', view);
      await window.viewAPI.createView(view);
    }
  };

  const vehicle = props.selectedVehicle;

  return (
    <Modal
      opened={props.addViewForVehicleModalOpened}
      onClose={props.close}
      withCloseButton={false}
      transitionProps={{
        transition: 'fade',
        duration: 200,
        timingFunction: 'linear',
      }}
      size="xl"
    >
      <Title order={1} mb={20}>
        {props.title}
      </Title>
      <Title order={2} mb={20}>
        Véhicule : {vehicle?.brand?.name} {vehicle?.model}
      </Title>
      <List>
        {vehicle?.equipment && vehicle?.equipment !== '' && (
          <List.Item icon={<MdConstruction size={20} />}>
            <b>Equipement :</b> {vehicle?.equipment}
          </List.Item>
        )}
        {vehicle?.date && (
          <List.Item icon={<MdDateRange size={20} />}>
            <b>Date :</b> {vehicle?.date}
          </List.Item>
        )}
        {vehicle?.license && vehicle?.license !== '' && (
          <List.Item icon={<TbNumber123 size={20} />}>
            <b>Immatriculation :</b> {vehicle?.license}
          </List.Item>
        )}
        {vehicle?.owner && vehicle?.owner !== '' && (
          <List.Item icon={<LuKeyRound size={20} />}>
            <b>Propriétaire :</b> {vehicle?.owner}
          </List.Item>
        )}
        {vehicle?.comment && vehicle?.comment !== '' && (
          <List.Item icon={<FaRegCommentAlt size={20} />}>
            <b>Commentaire :</b> {vehicle?.comment}
          </List.Item>
        )}
      </List>
      <hr />
      {props.selectAndAddButtons && (
        <Button
          color={theme.colors!.blue[9]}
          onClick={handleImportImage}
          mb={20}
        >
          Sélectionner des photos
        </Button>
      )}
      <Container mt={20} style={{ backgroundColor: theme.colors.black[6], borderRadius: '5px' }}>
        <Grid align="center">
          {displayedImages.map((image, index) => (
            <Grid.Col span={4} key={index}>
              <div className="icon-container">
                {props.selectAndAddButtons &&
                  <IconX
                    className="icon"
                    size={25}
                    onClick={() => {
                      setDisplayedImages(
                        displayedImages.filter(
                          (_, filteredIndex) => filteredIndex !== index
                        )
                      );
                      console.log(image);
                    }}
                  />
                }
                <Image src={`perso:///${image}`} radius="sm" />
              </div>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
      {props.selectAndAddButtons && (
        <Button
          color={theme.colors!.green[9]}
          onClick={handleAddImportedImages}
          mt={20}
          disabled={displayedImages.length === 0}
        >
          Ajouter
        </Button>
      )}
      <style>
        {`
          .icon-container {
            position: relative;
          }
          .icon {
            position: absolute;
            top: 2px;
            right: 2px;
            color: black;
            cursor: pointer;
            border: 2px solid black;
            border-radius: 5px;
            background-color: white;
            opacity: 0.5;
          }
          .icon:hover {
            transform: scale(1);
            background-color: red;
            opacity: 1;
          }
          `}
      </style>
    </Modal>
  );
};
export default VehicleDetailsModal;
