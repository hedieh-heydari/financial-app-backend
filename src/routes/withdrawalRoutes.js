const express = require('express');
const { getWithdrawals, addWithdrawal, deleteWithdrawal, updateWithdrawal } = require('../controllers/withdrawalController');

const router = express.Router();


router.get('/', getWithdrawals);

router.post('/', addWithdrawal);

router.put('/:id', updateWithdrawal);

router.delete('/:id', deleteWithdrawal);


module.exports = router;
