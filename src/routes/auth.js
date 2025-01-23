const express = require('express');
const router = express.Router();

const { signup, login, updateProfile } = require('../controllers/authController');

// Public Routes
router.post('/signup', signup);
router.post('/login', login);

// Protected Routes
router.put('/update-profile', updateProfile);

module.exports = router;
