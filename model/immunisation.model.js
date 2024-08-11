const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const immunisationSchema = new Schema({
  idAnak: {
    type: String,
    required: true,
  },
  jenisKelamin: {
    type: String,
    required: true,
  },
  imunisasi: Array,
});

module.exports = mongoose.model('Immunisation', immunisationSchema);
