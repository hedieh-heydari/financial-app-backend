const express = require('express');
const { getDeposits, addDeposit, updateDeposit, deleteDeposit } = require('../controllers/depositController');

const router = express.Router();

router.get('/', getDeposits);
router.post('/', addDeposit);
router.put('/:id', updateDeposit);
router.delete('/:id', deleteDeposit);

module.exports = router;
