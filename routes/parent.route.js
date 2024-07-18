const express = require('express');
const router = express.Router();

const parentController = require('../controllers/parent.controller');

router.get('/', parentController.getParentsList);
router.post('/', parentController.addParentData);

module.exports = router;
