const Child = require('../model/child.model');
const { monthNames } = require('./report');

const calculateAgeInMonths = (birthDate, year, month) => {
  const today = new Date(year, month);
  const birth = new Date(birthDate);
  let ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12;
  ageInMonths -= birth.getMonth();
  ageInMonths += today.getMonth();
  return ageInMonths;
};

const getSubVillageSummary = (data, dusun, year, month) => {
  const children = data.filter((child) => child.alamat.dusun === dusun);
  const childSummary = {
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
  };

  children.forEach((child) => {
    const ageInMonths = calculateAgeInMonths(child.tanggalLahir, year, month);
    childSummary.total[child.jenisKelamin.toLowerCase()]++;
    if (ageInMonths >= 0 && ageInMonths <= 5) {
      if (child.jenisKelamin === 'L') {
        childSummary['0-5']['l']++;
      } else if (child.jenisKelamin === 'P') {
        childSummary['0-5']['p']++;
      }
    } else if (ageInMonths >= 6 && ageInMonths <= 11) {
      if (child.jenisKelamin === 'L') {
        childSummary['6-11']['l']++;
      } else if (child.jenisKelamin === 'P') {
        childSummary['6-11']['p']++;
      }
    } else if (ageInMonths >= 12 && ageInMonths <= 23) {
      if (child.jenisKelamin === 'L') {
        childSummary['12-23']['l']++;
      } else if (child.jenisKelamin === 'P') {
        childSummary['12-23']['p']++;
      }
    } else if (ageInMonths >= 24 && ageInMonths <= 35) {
      if (child.jenisKelamin === 'L') {
        childSummary['24-35']['l']++;
      } else if (child.jenisKelamin === 'P') {
        childSummary['24-35']['p']++;
      }
    } else if (ageInMonths >= 36 && ageInMonths <= 59) {
      if (child.jenisKelamin === 'L') {
        childSummary['36-59']['l']++;
      } else if (child.jenisKelamin === 'P') {
        childSummary['36-59']['p']++;
      }
    }
  });

  return childSummary;
};

const getChildSummary = async (year, month) => {
  try {
    const children = await Child.find();
    const pegundunganSummary = getSubVillageSummary(children, 'Pegundungan', year, month);
    const simparSummary = getSubVillageSummary(children, 'Simpar', year, month);
    const srandilSummary = getSubVillageSummary(children, 'Srandil', year, month);
    const childSummary = {
      pegundungan: pegundunganSummary,
      simpar: simparSummary,
      srandil: srandilSummary,
    };
    return childSummary;
  } catch (error) {
    console.log(error);
    return {};
  }
};

const getRecordedChild = (data, year, month) => {
  const childSummary = {
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
  };

  const filteredData = data.filter((row) => row.hasOwnProperty(`bb_${monthNames[month]}`));

  if (filteredData.length === 0) {
    return childSummary;
  }

  filteredData.forEach((child) => {
    const [day, month, year] = child.tanggalLahir.split('/');
    const dateObject = new Date(year, month, day);
    const ageInMonths = calculateAgeInMonths(dateObject, year, month);
    const jenisKelamin = child.l === 'x' ? 'l' : 'p';
    childSummary.total[jenisKelamin]++;
    if (ageInMonths >= 0 && ageInMonths <= 5) {
      childSummary['0-5'][jenisKelamin]++;
    } else if (ageInMonths >= 6 && ageInMonths <= 11) {
      childSummary['6-11'][jenisKelamin]++;
    } else if (ageInMonths >= 12 && ageInMonths <= 23) {
      childSummary['12-23'][jenisKelamin]++;
    } else if (ageInMonths >= 24 && ageInMonths <= 35) {
      childSummary['24-35'][jenisKelamin]++;
    } else if (ageInMonths >= 36 && ageInMonths <= 59) {
      childSummary['36-59'][jenisKelamin]++;
    }
  });

  return childSummary;
};

module.exports = {
  getChildSummary,
  getRecordedChild,
};
