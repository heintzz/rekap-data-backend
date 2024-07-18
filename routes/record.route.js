const express = require('express');
const router = express.Router();

const recordController = require('../controllers/record.controller');

router.get('/', recordController.getRecords);
router.get('/grouped', recordController.getGroupedRecordDateList);
router.get('/:id', recordController.getRecord);
router.put('/:id', recordController.updateRecord);
router.post('/', recordController.createRecord);

module.exports = router;
