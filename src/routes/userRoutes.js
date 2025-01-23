const express = require('express');
const { getUserDetails } = require('../controllers/userController'); // Adjust path if needed
const router = express.Router();

// Get user details by ID
router.get('/:userId', getUserDetails);

module.exports = router;
