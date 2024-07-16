const express = require('express');
const router = express.Router();

const verifyMiddleware = require('../middleware/verifyToken');
const parentController = require('../controllers/parent.controller');

router.get('/', verifyMiddleware.verifyToken, parentController.getParentsList);
router.post('/', verifyMiddleware.verifyToken, parentController.addParentData);

module.exports = router;
