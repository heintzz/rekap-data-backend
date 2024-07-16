const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  nama: {
    type: String,
    required: true,
  },
  kataSandi: {
    type: String,
    required: true,
  },
  peran: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
