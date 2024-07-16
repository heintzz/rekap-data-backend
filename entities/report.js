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

const monthWithPrev = {
  0: 'desember_prev',
  1: 'januari',
  2: 'februari',
  3: 'maret',
  4: 'april',
  5: 'mei',
  6: 'juni',
  7: 'juli',
  8: 'agustus',
  9: 'september',
  10: 'oktober',
  11: 'november',
  12: 'desember',
};

const monthNames = [
  'desember_prev',
  'januari',
  'februari',
  'maret',
  'april',
  'mei',
  'juni',
  'juli',
  'agustus',
  'september',
  'oktober',
  'november',
  'desember',
];

const monthCapital = {
  0: 'Januari',
  1: 'Februari',
  2: 'Maret',
  3: 'April',
  4: 'Mei',
  5: 'Juni',
  6: 'Juli',
  7: 'Agustus',
  8: 'September',
  9: 'Oktober',
  10: 'November',
  11: 'Desember',
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

const reportEntity = {
  month,
  monthCapital,
  monthWithPrev,
  monthNames,
  rangeToBoundaries,
};

module.exports = reportEntity;
