const data = require('../data');
const Record = require('../model/record.model');

const weightOverAgeEnum = {
  WOA_0: 'Berat badan sangat kurang',
  WOA_1: 'Berat badan kurang',
  WOA_2: 'Berat badan normal',
  WOA_3: 'Risiko berat badan lebih',
};

const heightOverAgeStatus = {
  HOA_0: 'Sangat pendek',
  HOA_1: 'Pendek',
  HOA_2: 'Normal',
  HOA_3: 'Tinggi',
};

const weightOverHeightStatus = {
  WOH_0: 'Gizi buruk',
  WOH_1: 'Gizi kurang',
  WOH_2: 'Gizi normal',
  WOH_3: 'Berisiko gizi lebih',
  WOH_4: 'Gizi lebih (overweight)',
  WOH_5: 'Obesitas',
};

const inferWeightOverAgeStatus = (age, weight, gender) => {
  let bbPerUmur;

  if (gender === 'L') {
    const median = data.lakiLaki.bbPerUmur.median[age];
    bbPerUmur =
      weight < median
        ? (weight - median) / (median - data.lakiLaki.bbPerUmur['-1_SD'][age])
        : (weight - median) / (data.lakiLaki.bbPerUmur['+1_SD'][age] - median);
  } else {
    const median = data.perempuan.bbPerUmur.median[age];
    bbPerUmur =
      weight < median
        ? (weight - median) / (median - data.perempuan.bbPerUmur['-1_SD'][age])
        : (weight - median) / (data.perempuan.bbPerUmur['+1_SD'][age] - median);
  }

  if (bbPerUmur < -3) {
    return weightOverAgeEnum.WOA_0;
  } else if (bbPerUmur <= -2) {
    return weightOverAgeEnum.WOA_1;
  } else if (bbPerUmur <= 1) {
    return weightOverAgeEnum.WOA_2;
  } else {
    return weightOverAgeEnum.WOA_3;
  }
};

const inferHeightOverAgeStatus = (age, height, gender) => {
  let tbPerUmur;
  if (gender === 'L') {
    const median = data.lakiLaki.tbPerUmur.median[age];
    tbPerUmur =
      height < median
        ? (height - median) / (median - data.lakiLaki.tbPerUmur['-1_SD'][age])
        : (height - median) / (data.lakiLaki.tbPerUmur['+1_SD'][age] - median);
  } else {
    const median = data.perempuan.tbPerUmur.median[age];
    tbPerUmur =
      height < median
        ? (height - median) / (median - data.perempuan.tbPerUmur['-1_SD'][age])
        : (height - median) / (data.perempuan.tbPerUmur['+1_SD'][age] - median);
  }

  if (tbPerUmur <= -3) {
    return heightOverAgeStatus.HOA_0;
  } else if (tbPerUmur <= -2) {
    return heightOverAgeStatus.HOA_1;
  } else if (tbPerUmur <= 1) {
    return heightOverAgeStatus.HOA_2;
  } else {
    return heightOverAgeStatus.HOA_3;
  }
};

const inferWeightOverHeightStatus = (age, weight, height, gender) => {
  const lowerBound = 45.0;
  const difference = height - lowerBound;
  const remainder = difference % 0.5;

  const target =
    remainder < 0.25 ? lowerBound + Math.floor(difference) : lowerBound + Math.ceil(difference);

  const ageRange = age <= 24 ? '0-24' : '24-60';

  if (gender === 'L') {
    const index = data.lakiLaki.bbPerTb[ageRange].tinggiBadan.findIndex(
      (value) => value === target
    );

    const median = data.lakiLaki.bbPerTb[ageRange].median[index];
    bbPerTb =
      weight < median
        ? (weight - median) / (median - data.lakiLaki.bbPerTb[ageRange]['-1_SD'][index])
        : (weight - median) / (data.lakiLaki.bbPerTb[ageRange]['+1_SD'][index] - median);
  } else {
    const index = data.perempuan.bbPerTb[ageRange].tinggiBadan.findIndex(
      (value) => value === target
    );
    const median = data.perempuan.bbPerTb[ageRange].median[index];
    bbPerTb =
      weight < median
        ? (weight - median) / (median - data.perempuan.bbPerTb[ageRange]['-1_SD'][index])
        : (weight - median) / (data.perempuan.bbPerTb[ageRange]['+1_SD'][index] - median);
  }

  if (bbPerTb <= -3) {
    return weightOverHeightStatus.WOH_0;
  } else if (bbPerTb <= -2) {
    return weightOverHeightStatus.WOH_1;
  } else if (bbPerTb <= 1) {
    return weightOverHeightStatus.WOH_2;
  } else if (bbPerTb <= 2) {
    return weightOverHeightStatus.WOH_3;
  } else if (bbPerTb <= 3) {
    return weightOverHeightStatus.WOH_4;
  } else {
    return weightOverHeightStatus.WOH_5;
  }
};

const inferNutritionStatus = (usia, beratBadan, tinggiBadan, jenisKelamin) => {
  const weightOverAgeStatus = inferWeightOverAgeStatus(usia, beratBadan, jenisKelamin);
  const heightOverAgeStatus = inferHeightOverAgeStatus(usia, tinggiBadan, jenisKelamin);
  const weightOverHeightStatus = inferWeightOverHeightStatus(
    usia,
    beratBadan,
    tinggiBadan,
    jenisKelamin
  );

  const status = {
    'bb/u': weightOverAgeStatus,
    'tb/u': heightOverAgeStatus,
    'bb/tb': weightOverHeightStatus,
  };

  return status;
};

const createRecord = async (req, res) => {
  const { usia, beratBadan, jenisKelamin, tinggiBadan } = req.body;

  const status = inferNutritionStatus(usia, beratBadan, tinggiBadan, jenisKelamin);

  try {
    const record = await Record.create({
      ...req.body,
      status,
    });
    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateRecord = async (req, res) => {
  const recordId = req.params.id;

  try {
    const record = await Record.findById(recordId);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Pemeriksaan tidak ditemukan' });
    }

    const updatedRecord = await Record.findByIdAndUpdate(
      recordId,
      { ...req.body },
      { new: true, runValidators: true }
    );

    const newStatus = inferNutritionStatus(
      req.body?.usia ? req.body.usia : updatedRecord.usia,
      req.body?.beratBadan ? req.body.beratBadan : updatedRecord.beratBadan,
      req.body?.tinggiBadan ? req.body.tinggiBadan : updatedRecord.tinggiBadan,
      req.body?.jenisKelamin ? req.body.jenisKelamin : updatedRecord.jenisKelamin
    );

    updatedRecord.status = newStatus;

    await updatedRecord.save();

    res.status(200).json({
      success: true,
      data: updatedRecord,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRecords = async (req, res) => {
  const { month, year } = req.query;

  if (month && year) {
    try {
      const records = await Record.find({
        tanggalPencatatan: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1),
        },
      })
        .sort({ tanggalPencatatan: -1 })
        .populate('idAnak');

      res.status(200).json({
        success: true,
        data: records,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else if (month && !year) {
    const thisYear = new Date().getFullYear();
    try {
      const records = await Record.find(
        {
          tanggalPencatatan: {
            $gte: new Date(thisYear, month - 1, 1),
            $lt: new Date(thisYear, month, 1),
          },
        }
          .sort({ tanggalPencatatan: -1 })
          .populate('idAnak')
      );

      res.status(200).json({
        success: true,
        data: records,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else if (!month && year) {
    try {
      const records = await Record.find(
        {
          tanggalPencatatan: {
            $gte: new Date(year, 0, 1),
            $lt: new Date(year, 12, 1),
          },
        }
          .sort({ tanggalPencatatan: -1 })
          .populate('idAnak')
      );

      res.status(200).json({
        success: true,
        data: records,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else
    try {
      const records = await Record.find().sort({ tanggalPencatatan: -1 }).populate('idAnak');
      res.status(200).json({
        success: true,
        data: records,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

const getRecordsByChildId = async (req, res) => {
  const idAnak = req.params.id;

  try {
    const record = await Record.find({ idAnak }).sort({ tanggalPencatatan: -1 });
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Pencatatan tidak ditemukan',
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getGroupedRecordDateList = async (_, res) => {
  try {
    const records = await Record.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$tanggalPencatatan' },
            month: { $month: '$tanggalPencatatan' },
          },
        },
      },
      {
        $sort: {
          '_id.year': -1,
          '_id.month': -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: records?.length > 0 ? records.map((record) => record._id) : [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRecord = async (req, res) => {
  const recordId = req.params.id;

  try {
    const record = await Record.findById(recordId);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Pemeriksaan tidak ditemukan' });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const recordController = {
  getRecord,
  getRecords,
  getGroupedRecordDateList,
  getRecordsByChildId,
  createRecord,
  updateRecord,
};

module.exports = recordController;
