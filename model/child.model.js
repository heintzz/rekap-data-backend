const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const childSchema = new Schema({
  nama: {
    type: String,
    required: true,
  },
  nik: {
    type: String,
    required: true,
  },
  jenisKelamin: {
    type: String,
    required: true,
  },
  tanggalLahir: {
    type: Date,
    required: true,
  },
  alamat: {
    type: {
      dusun: {
        type: String,
        required: true,
      },
      rt: {
        type: Number,
        required: true,
      },
      rw: {
        type: Number,
        required: true,
      },
    },
  },
  idOrangTua: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Child', childSchema);
