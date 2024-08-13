const express = require('express');
const router = express.Router();

const summaryController = require('../controllers/summary.controller');

router.get('/', summaryController.getSummaries);
router.get('/status', summaryController.getChildrenByRecordStatus);

module.exports = router;
