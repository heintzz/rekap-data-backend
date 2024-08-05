const Parent = require('../model/parent.model');
const Child = require('../model/child.model');
const Record = require('../model/record.model');

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
  const { nama, nik, dusun, rt, rw } = req.body;

  const existingParent = await Parent.findOne({ nik }).exec();

  if (existingParent) {
    return res.status(400).json({
      success: false,
      message: 'Data keluarga sudah ada',
    });
  }

  try {
    const parent = await Parent.create({
      nama,
      nik,
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

const deleteParentData = async (req, res) => {
  const { id } = req.params;

  try {
    const parent = await Parent.findById(id);
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Data orang tua tidak ditemukan',
      });
    }

    await Parent.deleteOne({ _id: id });

    const childs = await Child.find({ idOrangTua: id }).exec();

    if (childs.length > 0) {
      await Child.deleteMany({ idOrangTua: id });
      await Record.deleteMany({ idAnak: { $in: childs.map((child) => child._id) } });
    }

    res.status(200).json({
      success: true,
      message: 'Data orang tua berhasil dihapus',
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
  deleteParentData,
};

module.exports = parentController;
