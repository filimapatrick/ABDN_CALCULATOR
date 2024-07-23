import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export const loadCsvData = () => {
  const filePath = path.resolve('./public/ABDS.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const { data } = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  return data;
};
