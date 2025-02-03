const { CreditCardBox } = require("../models/creditCardBoxModel");
const Deposit = require("../models/depositModel");
const Withdrawal = require("../models/widthrawalModel");
const moment = require("moment-jalaali");

// Get Total Money from All Boxes
exports.getTotalMoney = async (req, res) => {
  try {
    // Fetch all boxes
    const boxes = await CreditCardBox.find();

    // Calculate the total sum of all box balances
    const totalMoney = boxes.reduce((sum, box) => sum + box.initialAmount, 0);

    res.status(200).json({ totalMoney });
  } catch (error) {
    console.error("Error fetching total money:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//both desposits and withdrawals list
exports.getAllTransactions = async (req, res) => {
  try {
    // Fetch deposits and withdrawals
    const deposits = await Deposit.find().populate("fromBox toBox");
    const withdrawals = await Withdrawal.find().populate("fromBox toBox");

    // Format transactions to a unified structure
    const formattedDeposits = deposits.map((deposit) => ({
      type: "deposit",
      amount: deposit.amount,
      date: deposit.date.toISOString().split("T")[0], // Format date (YYYY-MM-DD)
      fromBox: deposit.fromBox ? deposit.fromBox.name : "Cash",
      toBox: deposit.toBox ? deposit.toBox.name : "Unknown",
      description: deposit.description,
    }));

    const formattedWithdrawals = withdrawals.map((withdrawal) => ({
      type: "withdrawal",
      amount: withdrawal.amount,
      date: withdrawal.date.toISOString().split("T")[0],
      fromBox: withdrawal.fromBox ? withdrawal.fromBox.name : "Unknown",
      toBox: withdrawal.toBox ? withdrawal.toBox.name : "Cash",
      description: withdrawal.description,
    }));

    // Combine transactions and sort by date (Newest first)
    const transactions = [...formattedDeposits, ...formattedWithdrawals].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTotalTransactions = async (req, res) => {
  try {
    // Sum of all deposit amounts
    const depositResult = await Deposit.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalDeposits = depositResult.length > 0 ? depositResult[0].total : 0;

    // Sum of all withdrawal amounts
    const withdrawalResult = await Withdrawal.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalWithdrawals =
      withdrawalResult.length > 0 ? withdrawalResult[0].total : 0;

    res.status(200).json({ totalDeposits, totalWithdrawals });
  } catch (error) {
    console.error("Error fetching total transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTopWithdrawals = async (req, res) => {
  try {
    // Aggregate withdrawals by name and sum amounts
    const withdrawals = await Withdrawal.aggregate([
      {
        $group: {
          _id: "$description", // Group by description (category)
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { totalAmount: -1 } }, // Sort by total amount (descending)
      { $limit: 5 }, // Get top 5 withdrawals
    ]);

    // Calculate total sum of all withdrawals
    const totalWithdrawals = await Withdrawal.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalSum =
      totalWithdrawals.length > 0 ? totalWithdrawals[0].total : 1; // Avoid division by zero

    // Format response with percentage calculation
    const topWithdrawals = withdrawals.map((w) => ({
      name: w._id,
      amount: w.totalAmount,
      percentage: parseFloat(((w.totalAmount / totalSum) * 100).toFixed(1)), // Round to 1 decimal
    }));

    res.status(200).json({ totalWithdrawals: totalSum, topWithdrawals });
  } catch (error) {
    console.error("Error fetching top withdrawals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

