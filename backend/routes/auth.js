const express = require('express');
const router = express.Router();
const {
    register,
    login,
    verifyToken,
    registerValidation,
    loginValidation
} = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', registerValidation, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, login);

// @route   GET /api/auth/verify
// @desc    Verify token and get current user
// @access  Protected
router.get('/verify', auth, verifyToken);

module.exports = router;
