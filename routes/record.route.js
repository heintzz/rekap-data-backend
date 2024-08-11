const express = require('express');
const router = express.Router();

const recordController = require('../controllers/record.controller');

router.get('/', recordController.getRecords);
router.get('/grouped', recordController.getGroupedRecordDateList);
router.post('/', recordController.createRecord);
router.get('/:id', recordController.getRecord);
router.get('/child/:id', recordController.getRecordsByChildId);
router.put('/:id', recordController.updateRecord);
router.delete('/:id', recordController.deleteRecord);

module.exports = router;
