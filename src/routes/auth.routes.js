const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

router.post('/register', authController.registerUser);
router.post('/login', authController.logUserIn);
router.post('/logout', authController.logout);
module.exports = router;
