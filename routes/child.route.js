const express = require('express');
const router = express.Router();

const verifyMiddleware = require('../middleware/verifyToken');
const childController = require('../controllers/child.controller');

router.get('/', verifyMiddleware.verifyToken, childController.getChildrenList);
router.post('/', verifyMiddleware.verifyToken, childController.addChildData);

module.exports = router;
