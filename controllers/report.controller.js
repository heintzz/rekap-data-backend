const Record = require('../model/record.model');
const path = require('path');
const ExcelJS = require('exceljs');
const reportEntity = require('../entities/report');
const fs = require('fs');
const { getChildSummary, getRecordedChild } = require('../entities/child.js');

const getBBTBHeaders = (worksheet) => {
  const headers = {};
  let monthCount = 0;
  worksheet.getRow(9).eachCell((cell, colNumber) => {
    let value = cell.value.toLowerCase();
    if (cell.value === 'BB' || cell.value === 'TB') {
      value = `${value}_${reportEntity.monthWithPrev[monthCount]}`;
      if ((colNumber + 1) % 2 == 0) {
        monthCount++;
      }
    }
    if (value === 'bulan') {
      value = 'usia';
    }
    if (value === 'tanggal lahir') {
      value = 'tanggalLahir';
    }
    if (value === 'nama ortu') {
      value = 'namaOrtu';
    }
    headers[value] = colNumber;
  });
  return headers;
};

const commitBBTBData = (data, worksheet, headers) => {
  data.forEach((row, rowIndex) => {
    const excelRow = worksheet.getRow(rowIndex + 10);
    for (const [key, value] of Object.entries(row)) {
      if (headers[key] !== undefined) {
        excelRow.getCell(headers[key]).value = value;
      }
      excelRow.getCell(headers['no']).value = rowIndex + 1;
    }
    excelRow.commit();
  });
};

const commitJumlahBalita = (subVillageStats, worksheet, row) => {
  const data = Object.values(subVillageStats).flatMap((item) => [item.l, item.p]);
  data.map((item, index) => {
    worksheet.getCell(row, index + 2).value = item;
  });
};

const commitJumlahBalitaDitimbang = (subVillageStats, worksheet, row) => {
  const data = Object.values(subVillageStats).flatMap((item) => [item.l, item.p]);
  data.map((item, index) => {
    worksheet.getCell(row, index + 14).value = item;
  });
};

const commitJumlahBalitaNaik = (data, month) => {
  const summary = {
    '0-5': { l: 0, p: 0 },
    '6-11': { l: 0, p: 0 },
    '12-23': { l: 0, p: 0 },
    '24-35': { l: 0, p: 0 },
    '36-59': { l: 0, p: 0 },
    total: { l: 0, p: 0 },
    O: { l: 0, p: 0 },
    B: { l: 0, p: 0 },
    T: { l: 0, p: 0 },
    '2T': { l: 0, p: 0 },
  };

  data.map((row) => {
    const now = row[`bb_${reportEntity.month[month]}`] || null;
    const prev1 = row[`bb_${reportEntity.month[month - 1]}`] || null;
    const prev2 = row[`bb_${reportEntity.month[month - 2]}`] || null;

    const jenisKelamin = row.l === 'x' ? 'l' : 'p';

    if (now) {
      summary['total'][jenisKelamin]++;
    }

    const isEmpty = !now;
    const prevEmpty = !prev1;
    const prevTwoEmpty = !prev2;

    const usia = row.usia;

    let difference = 0;

    const differenceOne = now - prev1.toFixed(2);
    const differenceTwo = prev1 - prev2.toFixed(2);

    if (isEmpty && prevEmpty && prevTwoEmpty) {
      summary['T'][jenisKelamin]++;
    } else if (now) {
      if (prevEmpty) {
        summary['T'][jenisKelamin]++;
      } else {
        if (usia <= 5) {
          if (difference >= reportEntity.rangeToBoundaries[usia]) {
            summary['0-5'][jenisKelamin]++;
          } else {
            summary['T'][jenisKelamin]++;
          }
        } else if (usia >= 6 && usia <= 7) {
          if (difference >= reportEntity.rangeToBoundaries['6-7']) {
            summary['6-11'][jenisKelamin]++;
          } else {
            summary['T'][jenisKelamin]++;
          }
        } else if (usia >= 8 && usia <= 11) {
          if (difference >= reportEntity.rangeToBoundaries['8-11']) {
            summary['6-11'][jenisKelamin]++;
          } else {
            summary['T'][jenisKelamin]++;
          }
        } else if (usia >= 12 && usia <= 23) {
          if (difference >= reportEntity.rangeToBoundaries['12-60']) {
            summary['12-23'][jenisKelamin]++;
          } else {
            summary['T'][jenisKelamin]++;
          }
        } else if (usia >= 24 && usia <= 35) {
          if (difference >= reportEntity.rangeToBoundaries['12-60']) {
            summary['24-35'][jenisKelamin]++;
          } else {
            summary['T'][jenisKelamin]++;
          }
        } else if (usia >= 36 && usia <= 59) {
          if (difference >= reportEntity.rangeToBoundaries['12-60']) {
            summary['36-59'][jenisKelamin]++;
          } else {
            summary['T'][jenisKelamin]++;
          }
        }
      }
    } else {
      if (differenceOne <= 0 && differenceTwo <= 0) {
        summary['2T'][jenisKelamin]++;
      }
    }

    // kalo ada dua data baru diitung -> 2T
    // kalo kosong2 terus -> T

    if (now)
      if (!prev1 && !now) {
        summary['2T'][jenisKelamin]++;
      } else if (!now) {
        summary['T'][jenisKelamin]++;
        console.log('tidak hadir');
      } else {
        difference = parseFloat((now - prev1).toFixed(2)) * 1000;
        if (usia <= 5) {
          if (difference >= reportEntity.rangeToBoundaries[usia]) {
            summary['0-5'][jenisKelamin]++;
          } else {
            summary['T'][jenisKelamin]++;
            console.log('tidak naik berat badan');
          }
        } else if (usia >= 6 && usia <= 7) {
          if (difference >= reportEntity.rangeToBoundaries['6-7']) {
            summary['6-11'][jenisKelamin]++;
          } else {
            summary['T'][jenisKelamin]++;
            console.log('tidak naik berat badan');
          }
        } else if (usia >= 8 && usia <= 11) {
          if (difference >= reportEntity.rangeToBoundaries['8-11']) {
            summary['6-11'][jenisKelamin]++;
          } else {
            summary['T'][jenisKelamin]++;
            console.log('tidak naik berat badan');
          }
        } else if (usia >= 12 && usia <= 23) {
          if (difference >= reportEntity.rangeToBoundaries['12-60']) {
            summary['12-23'][jenisKelamin]++;
          } else {
            summary['T'][jenisKelamin]++;
            console.log('tidak naik berat badan');
          }
        } else if (usia >= 24 && usia <= 35) {
          if (difference >= reportEntity.rangeToBoundaries['12-60']) {
            summary['24-35'][jenisKelamin]++;
          } else {
            summary['T'][jenisKelamin]++;
            console.log('tidak naik berat badan');
          }
        } else if (usia >= 36 && usia <= 59) {
          if (difference >= reportEntity.rangeToBoundaries['12-60']) {
            summary['36-59'][jenisKelamin]++;
          } else {
            summary['T'][jenisKelamin]++;
            console.log('tidak naik berat badan');
          }
        }
      }
  });

  count = Object.values(summary).flatMap((item) => [item.l, item.p]);
  return count;
};

async function generateSummary(year) {
  const startDate = new Date(year - 1, 11, 1);
  const endDate = new Date(year + 1, 0, 1);

  const pipeline = [
    {
      $match: {
        tanggalPencatatan: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $lookup: {
        from: 'children',
        let: { idAnak: { $toObjectId: '$idAnak' } },
        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$idAnak'] } } }],
        as: 'infoAnak',
      },
    },
    {
      $unwind: '$infoAnak',
    },
    {
      $lookup: {
        from: 'parents',
        let: { idOrangTua: { $toObjectId: '$infoAnak.idOrangTua' } },
        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$idOrangTua'] } } }],
        as: 'infoOrtu',
      },
    },
    {
      $unwind: '$infoOrtu',
    },
    {
      $group: {
        _id: {
          idAnak: '$idAnak',
          month: { $month: '$tanggalPencatatan' },
          year: { $year: '$tanggalPencatatan' },
        },
        infoAnak: { $first: '$infoAnak' },
        infoOrtu: { $first: '$infoOrtu' },
        beratBadan: { $first: '$beratBadan' },
        tinggiBadan: { $first: '$tinggiBadan' },
        pertamaKali: { $first: '$pertamaKali' },
      },
    },
    {
      $group: {
        _id: '$_id.idAnak',
        infoAnak: { $first: '$infoAnak' },
        infoOrtu: { $first: '$infoOrtu' },
        monthlyData: {
          $push: {
            month: '$_id.month',
            year: '$_id.year',
            beratBadan: '$beratBadan',
            tinggiBadan: '$tinggiBadan',
            pertamaKali: '$pertamaKali',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        nama: '$infoAnak.nama',
        nik: '$infoAnak.nik',
        l: { $cond: [{ $eq: ['$infoAnak.jenisKelamin', 'L'] }, 'x', ''] },
        p: { $cond: [{ $eq: ['$infoAnak.jenisKelamin', 'P'] }, 'x', ''] },
        namaOrtu: '$infoOrtu.nama',
        rt: '$infoAnak.alamat.rt',
        rw: '$infoAnak.alamat.rw',
        alamat: `$infoAnak.alamat.dusun`,
        tanggalLahir: { $dateToString: { format: '%d/%m/%Y', date: '$infoAnak.tanggalLahir' } },
        usia: {
          $add: [
            {
              $multiply: [
                {
                  $subtract: [{ $year: new Date() }, { $year: '$infoAnak.tanggalLahir' }],
                },
                12,
              ],
            },
            {
              $subtract: [{ $month: new Date() }, { $month: '$infoAnak.tanggalLahir' }],
            },
          ],
        },
        monthlyData: 1,
      },
    },
  ];

  const results = await Record.aggregate(pipeline);

  return results.map((child) => {
    const summary = {
      nama: child.nama,
      nik: child.nik,
      l: child.l,
      p: child.p,
      tanggalLahir: child.tanggalLahir,
      usia: child.usia,
      namaOrtu: child.namaOrtu,
      rt: child.rt,
      rw: child.rw,
      alamat: child.alamat,
    };

    child.monthlyData.forEach((data) => {
      const month = data.month === 12 ? (data.year === year ? 12 : 0) : data.month;
      const monthName = reportEntity.monthNames[month];
      summary[`bb_${monthName}`] = parseFloat(data.beratBadan).toFixed(1);
      summary[`tb_${monthName}`] = parseFloat(data.tinggiBadan).toFixed(1);
      summary.pertamaKali = data.pertamaKali;
    });

    return summary;
  });
}

const generateReport = async (year, month, data, subVillageStats) => {
  const pegundunganData = data.filter((row) => row.alamat === 'Pegundungan');
  const simparData = data.filter((row) => row.alamat === 'Simpar');
  const srandilData = data.filter((row) => row.alamat === 'Srandil');

  const workbook = new ExcelJS.Workbook();
  const templatePath = path.join(__dirname, 'template.xlsx');
  console.log(templatePath);

  await workbook.xlsx.readFile(templatePath);
  const worksheetOne = workbook.getWorksheet('Mentari I');
  const worksheetTwo = workbook.getWorksheet('Mentari II');
  const worksheetThree = workbook.getWorksheet('Mentari III');
  const worksheetFour = workbook.getWorksheet('Laporan Bulanan');

  const headersSheetOne = getBBTBHeaders(worksheetOne);
  const headersSheetTwo = getBBTBHeaders(worksheetTwo);
  const headersSheetThree = getBBTBHeaders(worksheetThree);

  commitBBTBData(pegundunganData, worksheetOne, headersSheetOne);
  commitBBTBData(simparData, worksheetTwo, headersSheetTwo);
  commitBBTBData(srandilData, worksheetThree, headersSheetThree);

  commitJumlahBalita(subVillageStats['pegundungan'], worksheetFour, 29);
  commitJumlahBalita(subVillageStats['simpar'], worksheetFour, 30);
  commitJumlahBalita(subVillageStats['srandil'], worksheetFour, 31);

  commitJumlahBalitaDitimbang(getRecordedChild(pegundunganData, month), worksheetFour, 29);
  commitJumlahBalitaDitimbang(getRecordedChild(simparData, month), worksheetFour, 30);
  commitJumlahBalitaDitimbang(getRecordedChild(srandilData, month), worksheetFour, 31);

  const headersSheetFour = {};
  worksheetFour.getRow(4).eachCell((cell, colNumber) => {
    let value = cell.value.toLowerCase();
    value = `${value}_${colNumber}`;
    headersSheetFour[value] = colNumber;
  });

  const count = commitJumlahBalitaNaik(data, month - 1);
  count.forEach((item, index) => {
    const jenisKelamin = index % 2 === 0 ? 'l' : 'p';
    worksheetFour.getCell(5, headersSheetFour[`${jenisKelamin}_${index + 1}`]).value = item;
  });

  const outputPath = '/tmp';

  try {
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const filePath = path.join(
      outputPath,
      `TB BB ${reportEntity.monthCapital[month - 1]} Pegundungan ${year}.xlsx`
    );
    await workbook.xlsx.writeFile(filePath);
    return filePath;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const downloadReport = async (req, res) => {
  let year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
  let month = req.query.month ? parseInt(req.query.month) : null;

  try {
    const summary = await generateSummary(year);
    const childSummary = await getChildSummary();
    const filePath = await generateReport(year, month, summary, childSummary);

    if (!filePath) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate report',
      });
    }

    console.log(`Report generated at ${filePath}`);
    res.status(200).download(filePath, (err) => {
      if (err) {
        console.error(err);
      } else {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`File ${filePath} deleted successfully.`);
          }
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const reportController = {
  downloadReport,
};

module.exports = reportController;
