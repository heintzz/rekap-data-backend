const mongoose = require('mongoose');

/**
 * REQUIREMENTS
 * Vitamin A
 * 1 tahun 2x bulan Februari dan Agustus
 *
 * ASI Eksklusif
 * 6 bulan pertampa
 *
 * MPASI
 * 6 - 24 bulan
 */

const recordSchema = new mongoose.Schema({
  idAnak: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true,
  },
  usia: {
    type: Number,
    required: true,
  },
  beratBadan: {
    type: Number,
    required: true,
  },
  jenisKelamin: {
    type: String,
    required: true,
  },
  tinggiBadan: {
    type: Number,
    required: true,
  },
  lingkarKepala: Number,
  lingkarLengan: Number,
  vitaminA: {
    type: Boolean,
  },
  asi: {
    type: Boolean,
  },
  mpasi: {
    type: Boolean,
  },
  pertamaKali: {
    type: Boolean,
  },
  status: {
    type: {
      'bb/u': {
        type: String,
        required: true,
      },
      'tb/u': {
        type: String,
        required: true,
      },
      'bb/tb': {
        type: String,
        required: true,
      },
    },
  },
  statusPerkembangan: {
    type: mongoose.Mixed,
  },
  imunisasi: {
    type: Array,
    required: false,
  },
  tanggalPencatatan: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Record', recordSchema);
