const bcrypt = require('bcrypt');
const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleUserSignup = async (req, res) => {
  const { nama, kataSandi, peran } = req.body;

  if (!nama || !kataSandi)
    return res.status(400).json({
      success: false,
      message: 'Nama dan kata sandi harus diisi',
    });

  const duplicate = await User.findOne({ nama }).exec();

  if (duplicate)
    return res.status(409).json({
      success: false,
      message: 'Pengguna dengan nama tersebut sudah ada',
    });

  try {
    const hashedPassword = await bcrypt.hash(kataSandi, 10);
    const user = await User.create({
      nama,
      kataSandi: hashedPassword,
      peran: peran || 'kader',
    });
    res.status(200).json({
      success: true,
      message: `Pengguna ${user.nama} terbuat`,
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

const handleUserLogin = async (req, res) => {
  const { nama, kataSandi } = req.body;

  if (!nama || !kataSandi)
    return res.status(400).json({
      success: false,
      message: 'Nama dan kata sandi harus diisi',
    });

  const user = await User.findOne({ nama }).exec();

  if (!user)
    return res.status(404).json({
      success: false,
      message: 'Pengguna tidak ditemukan',
    });

  const match = await bcrypt.compare(kataSandi, user.kataSandi);
  if (!match)
    return res.status(401).json({
      success: false,
      message: 'Kredensial tidak valid',
    });

  const token = jwt.sign(
    {
      id: user._id,
      nama: user.nama,
      peran: user.peran,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );

  res.status(200).json({
    success: true,
    message: 'Berhasil login',
    token,
  });
};

const getUserProfile = async (req, res) => {
  const { id } = req;
  const user = await User.findOne({ _id: id }).exec();

  if (!user)
    return res.status(404).json({
      success: false,
      message: 'Pengguna tidak ditemukan',
    });

  res.status(200).json({
    success: true,
    message: 'Berhasil mendapatkan profil pengguna',
    data: user,
  });
};

const authController = {
  handleUserSignup,
  handleUserLogin,
  getUserProfile,
};

module.exports = authController;
