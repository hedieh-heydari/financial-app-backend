const express = require('express');
const { getUserDetails } = require('../controllers/userController'); 
const router = express.Router();

// Get user details by ID
router.get('/:userId', getUserDetails);

module.exports = router;
