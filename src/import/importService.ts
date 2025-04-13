import xlsx from 'node-xlsx';

export const getRowValueAtIndex = (row: string[], index: number): string => {
  if (row && row[index] && row[index].length > 0) {
    return row[index].trim();
  }
  return '';
};

export const getNumberRowValueAtIndex = (row: string[], index: number): number | null => {
  if (row && row[index]) {
    return +row[index];
  }
  return null;
};


export const getBrandsForFile = (
  filePath: string
): { brand: string; count: number }[] => {
  console.log('Getting brands for file:', filePath);
  const workSheetsFromFile = xlsx.parse(filePath);
  return workSheetsFromFile.map((workSheet) => {
    const vehicleCount = workSheet.data.filter((line) => {
      if (line && line[0]) {
        return line[0].startsWith(workSheet.name.toUpperCase());
      }
    }).length;
    return { brand: workSheet.name, count: vehicleCount };
  });
};
