const express = require("express");
const {
  getTotalMoney,
  getAllTransactions,
  getTotalTransactions,
  getTopWithdrawals,
} = require("../controllers/dashboardController");

const router = express.Router();

// GET total money from all boxes
router.get("/total-money", getTotalMoney);
router.get("/transactions", getAllTransactions);
router.get("/total-transactions", getTotalTransactions);
router.get("/top-withdrawals", getTopWithdrawals);

module.exports = router;

