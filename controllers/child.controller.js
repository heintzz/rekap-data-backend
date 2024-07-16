const Child = require('../model/child.model');

const getChildrenList = async (req, res) => {
  try {
    const children = await Child.find().exec();

    res.status(200).json({
      success: true,
      message: 'Data anak berhasil didapatkan',
      data: children,
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

const addChildData = async (req, res) => {
  const { nama, nik, jenisKelamin, tanggalLahir, dusun, rt, rw, idOrangTua } = req.body;

  const existingChild = await Child.findOne({ nik }).exec();
  if (existingChild) {
    return res.status(400).json({
      success: false,
      message: 'Data anak sudah terdaftar',
    });
  }

  try {
    const child = await Child.create({
      nama,
      nik,
      jenisKelamin,
      tanggalLahir,
      alamat: {
        dusun,
        rt,
        rw,
      },
      idOrangTua,
    });

    res.status(200).json({
      success: true,
      message: 'Data anak berhasil ditambahkan',
      data: child,
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

const childController = {
  addChildData,
  getChildrenList,
};

module.exports = childController;
