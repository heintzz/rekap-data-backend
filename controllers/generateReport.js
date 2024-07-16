const express = require('express');
const exceljs = require('exceljs');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const data = [
  {
    nama: 'Muhammad Hasnan Regard',
    nik: '3372050605030005',
    l: 'x',
    p: '',
    tglLahir: '01/01/2021',
    usia: 12,
    bb_januari: 10,
    tb_januari: 100,
    bb_februari: 11.2,
    tb_februari: 110,
    bb_mei: 12,
    tb_mei: 120,
    namaOrtu: 'Titik Eko',
    alamat: 'Pegundungan',
    rt: '1',
    rw: '2',
  },
  {
    nama: 'Axel Jayana Regard',
    nik: '3372050605030005',
    l: 'x',
    p: '',
    tglLahir: '01/01/2021',
    usia: 12,
    bb_januari: 10,
    tb_januari: 100,
    bb_mei: 12,
    tb_mei: 120,
    bb_juni: 12.2,
    tb_juni: 120,
    bb_juli: 12.4,
    tb_juli: 120,
    alamat: 'Pegundungan',
    rt: '1',
    rw: '2',
  },
  {
    nama: 'Vienza Citra Regard',
    nik: '3372050605030005',
    l: '',
    p: 'x',
    tglLahir: '01/01/2021',
    usia: 12,
    bb_januari: 10,
    tb_januari: 100,
    bb_februari: 11.1,
    tb_februari: 110,
    bb_maret: 12,
    tb_maret: 120,
    bb_mei: 12,
    tb_mei: 120,
    alamat: 'Pegundungan',
    rt: '1',
    rw: '2',
  },
];

const month = {
  0: 'januari',
  1: 'februari',
  2: 'maret',
  3: 'april',
  4: 'mei',
  5: 'juni',
  6: 'juli',
  7: 'agustus',
  8: 'september',
  9: 'oktober',
  10: 'november',
  11: 'desember',
};

const rangeToBoundaries = {
  1: 800,
  2: 900,
  3: 800,
  4: 600,
  5: 500,
  '6-7': 400,
  '8-11': 300,
  '12-60': 200,
};

const summary = {
  '0-5': {
    l: 0,
    p: 0,
  },
  '6-11': {
    l: 0,
    p: 0,
  },
  '12-23': {
    l: 0,
    p: 0,
  },
  '24-35': {
    l: 0,
    p: 0,
  },
  '36-59': {
    l: 0,
    p: 0,
  },
  total: {
    l: 0,
    p: 0,
  },
  O: {
    l: 0,
    p: 0,
  },
  B: {
    l: 0,
    p: 0,
  },
  T: {
    l: 0,
    p: 0,
  },
  '2T': {
    l: 0,
    p: 0,
  },
};

app.get('/download-template', async (req, res) => {
  const workbook = new exceljs.Workbook();
  const templatePath = path.join(__dirname, 'template.xlsx');

  await workbook.xlsx.readFile(templatePath);
  const worksheetOne = workbook.getWorksheet(1);
  const worksheetTwo = workbook.getWorksheet('Statistik Cacah');

  if (!worksheetTwo) {
    console.error('Second worksheet not found');
    return res.status(404).send('Second worksheet not found in the template');
  }

  const outputPath = './output';

  const headersSheetOne = {};
  let monthCount = 0;
  worksheetOne.getRow(9).eachCell((cell, colNumber) => {
    let value = cell.value.toLowerCase();
    if (cell.value === 'BB' || cell.value === 'TB') {
      value = `${value}_${month[monthCount]}`;
      if ((colNumber + 1) % 2 == 0) {
        monthCount++;
      }
    }
    if (value === 'bulan') {
      value = 'usia';
    }
    if (value === 'tanggal lahir') {
      value = 'tglLahir';
    }
    if (value === 'nama ortu') {
      value = 'namaOrtu';
    }
    headersSheetOne[value] = colNumber;
  });

  const headersSheetTwo = {};
  worksheetTwo.getRow(4).eachCell((cell, colNumber) => {
    let value = cell.value.toLowerCase();
    value = `${value}_${colNumber}`;
    headersSheetTwo[value] = colNumber;
  });

  data.forEach((row, rowIndex) => {
    const excelRow = worksheetOne.getRow(rowIndex + 10);
    for (const [key, value] of Object.entries(row)) {
      if (headersSheetOne[key] !== undefined) {
        excelRow.getCell(headersSheetOne[key]).value = value;
      }
      excelRow.getCell(headersSheetOne['no']).value = rowIndex + 1;
    }
    excelRow.commit();
  });

  const thisMonth = new Date().getMonth();

  data.map((row) => {
    const now = row[`bb_${month[thisMonth]}`] || null;
    const prev = row[`bb_${month[thisMonth - 1]}`] || null;

    const jenisKelamin = row.l === 'x' ? 'l' : 'p';
    const usia = row.usia;

    let difference = 0;

    if (!prev && !now) {
      summary['2T'][jenisKelamin]++;
      console.log('tidak hadir dua hari');
    } else if (!now) {
      summary['T'][jenisKelamin]++;
      console.log('tidak hadir');
    } else {
      difference = parseFloat((now - prev).toFixed(2)) * 1000;
      if (usia <= 5) {
        if (difference >= rangeToBoundaries[usia]) {
          summary['0-5'][jenisKelamin]++;
        } else {
          console.log('tidak naik berat badan');
        }
      } else if (usia >= 6 && usia <= 7) {
        if (difference >= rangeToBoundaries['6-7']) {
          summary['6-11'][jenisKelamin]++;
        } else {
          console.log('tidak naik berat badan');
        }
      } else if (usia >= 8 && usia <= 11) {
        if (difference >= rangeToBoundaries['8-11']) {
          summary['6-11'][jenisKelamin]++;
        } else {
          console.log('tidak naik berat badan');
        }
      } else if (usia >= 12 && usia <= 23) {
        if (difference >= rangeToBoundaries['12-60']) {
          summary['12-23'][jenisKelamin]++;
        } else {
          console.log('tidak naik berat badan');
        }
      } else if (usia >= 24 && usia <= 35) {
        if (difference >= rangeToBoundaries['12-60']) {
          summary['24-35'][jenisKelamin]++;
        } else {
          console.log('tidak naik berat badan');
        }
      } else if (usia >= 36 && usia <= 59) {
        if (difference >= rangeToBoundaries['12-60']) {
          summary['36-59'][jenisKelamin]++;
        } else {
          console.log('tidak naik berat badan');
        }
      }
    }
  });

  summary.total['l'] =
    summary['0-5']['l'] +
    summary['6-11']['l'] +
    summary['12-23']['l'] +
    summary['24-35']['l'] +
    summary['36-59']['l'];

  summary.total['p'] =
    summary['0-5']['p'] +
    summary['6-11']['p'] +
    summary['12-23']['p'] +
    summary['24-35']['p'] +
    summary['36-59']['p'];

  count = Object.values(summary).flatMap((item) => [item.l, item.p]);

  count.forEach((item, index) => {
    const jenisKelamin = index % 2 === 0 ? 'l' : 'p';
    worksheetTwo.getCell(5, headersSheetTwo[`${jenisKelamin}_${index + 1}`]).value = item;
  });

  try {
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const filePath = path.join(outputPath, 'template.xlsx');
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, 'template.xlsx', (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Error sending file');
      }
    });
  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).send('Error creating file');
  }
});
