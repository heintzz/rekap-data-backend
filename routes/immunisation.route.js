const express = require('express');
const router = express.Router();

const immunisationController = require('../controllers/immunisation.controller');

router.put('/:id', immunisationController.createOrUpdate);
router.get('/:id', immunisationController.getImmunisastionList);

module.exports = router;
