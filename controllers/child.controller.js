const Child = require('../model/child.model');
const Record = require('../model/record.model');

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

const getChildById = async (req, res) => {
  const { id } = req.params;

  try {
    const child = await Child.findById(id).exec();

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Data anak tidak ditemukan',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data anak berhasil didapatkan',
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

const updateChildData = async (req, res) => {
  const { id } = req.params;

  try {
    const child = await Child.findById(id);
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Data anak tidak ditemukan',
      });
    }

    const updatedChild = await Child.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Data anak berhasil diperbarui',
      data: updatedChild,
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

const getChildrenByParentId = async (req, res) => {
  try {
    const { id } = req.params;
    const children = await Child.find({ idOrangTua: id }).exec();

    res.status(200).json({
      success: true,
      message: 'Data anak berhasil didapatkan',
      data: children,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

const deleteChildData = async (req, res) => {
  const { id } = req.params;

  try {
    const child = await Child.findById(id);
    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Data anak tidak ditemukan',
      });
    }

    await Record.deleteMany({ idAnak: id });
    await Child.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: 'Data anak berhasil dihapus',
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
  getChildById,
  updateChildData,
  deleteChildData,
  getChildrenList,
  getChildrenByParentId,
};

module.exports = childController;
