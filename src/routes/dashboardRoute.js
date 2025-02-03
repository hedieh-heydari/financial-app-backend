const express = require('express');
const { getTotalMoney } = require('../controllers/dashboardController');

const router = express.Router();

// GET total money from all boxes
router.get('/total-money', getTotalMoney);

module.exports = router;
