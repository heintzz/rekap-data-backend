const Immunisation = require('../model/immunisation.model');

const createOrUpdate = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await Immunisation.findOneAndUpdate(
      { idAnak: id },
      { imunisasi: [...req.body.imunisasi], jenisKelamin: req.body.jenisKelamin },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: 'Data imunisasi tersimpan.',
      data: doc,
    });
  } catch (err) {
    console.error('Error in createOrUpdate:', err);
    res.status(500).json({
      message: 'An error occurred while saving the immunisation record.',
      error: err.message,
    });
  }
};

const getImmunisastionList = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await Immunisation.findOne({ idAnak: id });

    res.status(200).json({
      message: 'Data imunisasi berhasil didapatkan.',
      data: doc || [],
    });
  } catch (err) {
    console.error('Error in createOrUpdate:', err);
    res.status(500).json({
      message: 'An error occurred while saving the immunisation record.',
      error: err.message,
    });
  }
};

const immunisationController = {
  createOrUpdate,
  getImmunisastionList,
};

module.exports = immunisationController;
