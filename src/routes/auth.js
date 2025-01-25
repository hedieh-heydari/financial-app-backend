const express = require('express');
const router = express.Router();
// const { authenticateToken } = require('../middleware/authMiddleware');


const { signup, login, updateProfile, logout } = require('../controllers/authController');

// Public Routes
router.post('/signup', signup);
router.post('/login', login);

// Protected Routes
router.put('/update-profile', updateProfile);
router.post('/logout', logout);



// if needed to protect routes for logedin
// router.get('/profile', authenticateToken, (req, res) => {
//     res.status(200).json({ message: 'Protected user profile', user: req.user });
//   });

module.exports = router;
