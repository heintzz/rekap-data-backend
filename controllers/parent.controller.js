const Parent = require('../model/parent.model');

const getParentsList = async (req, res) => {
  try {
    const parents = await Parent.find().exec();

    res.status(200).json({
      success: true,
      message: 'Data orang tua berhasil didapatkan',
      data: parents,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

const addParentData = async (req, res) => {
  const { nama, noKk, dusun, rt, rw } = req.body;

  const existingParent = await Parent.findOne({ noKk }).exec();

  if (existingParent) {
    return res.status(400).json({
      success: false,
      message: 'Data keluarga sudah ada',
    });
  }

  try {
    const parent = await Parent.create({
      nama,
      noKk,
      alamat: {
        dusun,
        rt,
        rw,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Data keluarga berhasil ditambahkan',
      data: parent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

const parentController = {
  addParentData,
  getParentsList,
};

module.exports = parentController;
