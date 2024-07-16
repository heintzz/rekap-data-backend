const express = require('express');
const router = express.Router();

const verifyMiddleware = require('../middleware/verifyToken');
const recordController = require('../controllers/record.controller');

router.get('/', verifyMiddleware.verifyToken, recordController.getRecords);
router.get('/grouped', verifyMiddleware.verifyToken, recordController.getGroupedRecordDateList);
router.get('/:id', verifyMiddleware.verifyToken, recordController.getRecord);
router.post('/', verifyMiddleware.verifyToken, recordController.createRecord);

module.exports = router;
