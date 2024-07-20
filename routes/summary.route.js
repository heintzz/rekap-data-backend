const express = require('express');
const router = express.Router();

const summaryController = require('../controllers/summary.controller');

router.get('/', summaryController.getSummaries);

module.exports = router;
