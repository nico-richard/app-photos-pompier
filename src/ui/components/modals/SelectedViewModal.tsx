import React, { useEffect, useState } from 'react';
import { Image, List, Modal } from '@mantine/core';
import { View } from '../../../models/View';
import { Vehicle } from '../../../models/Vehicle';
import { MdConstruction, MdDateRange } from 'react-icons/md';
import { TbNumber123 } from 'react-icons/tb';
import { LuKeyRound } from 'react-icons/lu';
import { FaRegCommentAlt } from 'react-icons/fa';

interface SelectedVehicleModalProps {
  viewModalOpened: boolean;
  selectedView?: View;
  close: () => void;
}

const SelectedViewModal = (props: SelectedVehicleModalProps) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>();
  useEffect(() => {
    const getVehicle = async () => {
      const vehicleId = props.selectedView?.vehicleId;
      return vehicleId ? await window.vehicleAPI.getVehicle(vehicleId) : null;
    };
    getVehicle().then((vehicle) => {
      setSelectedVehicle(vehicle);
    });
  }, [props.selectedView]);
  return (
    <div>
      <Modal
        opened={props.viewModalOpened}
        onClose={props.close}
        withCloseButton={false}
        transitionProps={{
          transition: 'fade',
          duration: 200,
          timingFunction: 'linear',
        }}
        size="xl"
      >
        <Image src={`perso:///${props.selectedView?.url}`} />
        <h3>
          {selectedVehicle?.brand?.name} {selectedVehicle?.model}
        </h3>
        <List>
          {selectedVehicle?.equipment && selectedVehicle?.equipment !== '' && (
            <List.Item icon={<MdConstruction size={20} />}>
              <b>Equipement :</b> {selectedVehicle?.equipment}
            </List.Item>
          )}
          {selectedVehicle?.date && (
            <List.Item icon={<MdDateRange size={20} />}>
              <b>Date :</b> {selectedVehicle?.date}
            </List.Item>
          )}
          {selectedVehicle?.license && selectedVehicle?.license !== '' && (
            <List.Item icon={<TbNumber123 size={20} />}>
              <b>Immatriculation :</b> {selectedVehicle?.license}
            </List.Item>
          )}
          {selectedVehicle?.owner && selectedVehicle?.owner !== '' && (
            <List.Item icon={<LuKeyRound size={20} />}>
              <b>Propriétaire :</b> {selectedVehicle?.owner}
            </List.Item>
          )}
          {selectedVehicle?.comment && selectedVehicle?.comment !== '' && (
            <List.Item icon={<FaRegCommentAlt size={20} />}>
              <b>Commentaire :</b> {selectedVehicle?.comment}
            </List.Item>
          )}
        </List>
      </Modal>
    </div>
  );
};

export default SelectedViewModal;
