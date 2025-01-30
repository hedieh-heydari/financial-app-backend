const express = require('express');
const { getWithdrawals, addWithdrawal, deleteWithdrawal, updateWithdrawal } = require('../controllers/withdrawalController');

const router = express.Router();


// Get All Withdrawals
router.get('/', getWithdrawals);

// Create a New Withdrawal
router.post('/', addWithdrawal);

// Update an Existing Withdrawal
router.put('/:id', updateWithdrawal);

// Delete a Withdrawal
router.delete('/:id', deleteWithdrawal);


module.exports = router;
