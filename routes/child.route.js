const express = require('express');
const router = express.Router();

const childController = require('../controllers/child.controller');

router.get('/', childController.getChildrenList);
router.get('/:id', childController.getChildById);
router.put('/:id', childController.updateChildData);
router.delete('/:id', childController.deleteChildData);
router.post('/', childController.addChildData);

module.exports = router;
