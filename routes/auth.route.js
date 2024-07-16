const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const VerifyMiddleware = require('../middleware/verifyToken');

router.post('/register', authController.handleUserSignup);
router.post('/login', authController.handleUserLogin);
router.get('/profile', VerifyMiddleware.verifyToken, authController.getUserProfile);

module.exports = router;
