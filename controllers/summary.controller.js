const Child = require('../model/child.model');
const Record = require('../model/record.model');
const Parent = require('../model/parent.model');

const getSummaries = async (req, res) => {
  try {
    const childLength = await Child.find().countDocuments().exec();
    const parentLength = await Parent.find().countDocuments().exec();

    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    const pemeriksaanBulanIniLength = await Record.find({
      tanggalPencatatan: {
        $gte: new Date(thisYear, thisMonth, 1),
        $lt: new Date(thisYear, thisMonth + 1, 1),
      },
    })
      .countDocuments()
      .exec();

    const pemeriksaanBurukLength = await Record.find({
      $or: [{ statusGizi: 'Gizi buruk' }, { statusGizi: 'Gizi kurang' }],
    })
      .countDocuments()
      .exec();

    const summary = {
      countChild: childLength,
      countParent: parentLength,
      countRecordThisMonth: pemeriksaanBulanIniLength,
      countMalnourishedChild: pemeriksaanBurukLength,
    };

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

const summaryController = {
  getSummaries,
};

module.exports = summaryController;
