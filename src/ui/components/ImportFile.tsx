import React, { useState } from 'react';
import { Button, Container, Flex, useMantineTheme } from '@mantine/core';

const ImportFile = () => {
  const theme = useMantineTheme();
  const [file, setFile] = useState<string>('');
  const [fileInfos, setFileInfos] = useState<
    { brand: string; count: number }[]
  >([]);
  const [fileChecked, setFileChecked] = useState<boolean>(false);

  const handleCheckFile = async () => {
    console.log('Checking File : ', file);
    window.electron.checkFile(file).then((data) => {
      setFileInfos(data);
      setFileChecked(true);
    });
  };

  const handleImportFile = async () => {
    await window.electron.import(file);
  };

  const handleSelectFile = async () =>
    window.electron.selectFile().then((file) => setFile(file));

  const handleReset = () => {
    setFile('');
    setFileInfos([]);
    setFileChecked(false);
  };

  return (
    <Container>
      <h1>
        Importer des données à partir d'un fichier
      </h1>
      <Flex direction="row" gap="md" align="center">
        <Flex direction="column" gap="md" style={{ flex: '1' }}>
          <Button color={theme.colors!.blue![9]} onClick={handleSelectFile}>
            Sélectionner un fichier
          </Button>
          <Button
            color={theme.colors.violet[9]}
            onClick={handleCheckFile}
            disabled={file === ''}
          >
            Vérifier
          </Button>
          <Button
            color={theme.colors!.green![9]}
            onClick={handleImportFile}
            disabled={file === '' || !fileChecked}
          >
            Importer
          </Button>
        </Flex>
        <Flex
          direction="column"
          gap="md"
          style={{
            flex: '1',
          }}
        >
          <h3
            style={{
              textAlign: 'center',
              backgroundColor: theme.colors.gray[8],
              padding: '1rem',
              margin: '0',
              borderRadius: '5px',
            }}
          >
            {file
              ? file.split('\\')[file.split('\\').length - 1]
              : 'Aucun fichier choisi'}
          </h3>
          <Button
            color={theme.colors.yellow[9]}
            onClick={handleReset}
            disabled={file === ''}
          >
            Réinitialiser
          </Button>
        </Flex>
      </Flex>
      {fileInfos && (
        <ul>
          {fileInfos.map((info, index) => (
            <li key={index}>
              {info.brand} : {info.count}
            </li>
          ))}
        </ul>
      )}
      {fileInfos && (
        <p>
          Total :{' '}
          {fileInfos.reduce((acc, current) => {
            return acc + current.count;
          }, 0)}
        </p>
      )}
    </Container>
  );
};

export default ImportFile;
