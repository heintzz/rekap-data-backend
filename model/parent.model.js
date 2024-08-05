const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parentSchema = new Schema({
  nama: {
    type: String,
    required: true,
  },
  nik: {
    type: String,
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
});

module.exports = mongoose.model('Parent', parentSchema);
