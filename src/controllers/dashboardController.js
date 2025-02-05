const { CreditCardBox } = require("../models/creditCardBoxModel");
const Deposit = require("../models/depositModel");
const Withdrawal = require("../models/widthrawalModel");
const verifyToken = require("../controllers/tokenController"); 

exports.getTotalMoney = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const userId = await verifyToken(token);

    const boxes = await CreditCardBox.find({ userId });

    const totalMoney = boxes.reduce((sum, box) => sum + box.initialAmount, 0);
    res.status(200).json({ totalMoney });
  } catch (error) {
    console.error("Error fetching total money:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getAllTransactions = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const userId = await verifyToken(token);

    const deposits = await Deposit.find({ userId }).populate("fromBox toBox");
    const withdrawals = await Withdrawal.find({ userId }).populate("fromBox toBox");

    const formattedDeposits = deposits.map((deposit) => ({
      type: "deposit",
      amount: deposit.amount,
      date: deposit.date.toISOString().split("T")[0],
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
    const token = req.headers.authorization.split(' ')[1];
    const userId = await verifyToken(token);

    const deposits = await Deposit.find({ userId });
    const totalDeposits = deposits.reduce((sum, deposit) => sum + deposit.amount, 0);



    const withdrawals = await Withdrawal.find({ userId });
    const totalWithdrawals = withdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0);

    res.status(200).json({
      totalDeposits,
      totalWithdrawals
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching totals', error: error.message });
  }
};


exports.getTopWithdrawals = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const userId = await verifyToken(token);

    const withdrawals = await Withdrawal.find({ userId });

    const groupedWithdrawals = withdrawals.reduce((acc, withdrawal) => {
      const toBox = withdrawal.toBox || 'Unknown'; 
      if (!acc[toBox]) {
        acc[toBox] = { totalAmount: 0, withdrawals: [] };
      }
      acc[toBox].totalAmount += withdrawal.amount;
      acc[toBox].withdrawals.push(withdrawal);
      return acc;
    }, {});

    const topWithdrawals = Object.entries(groupedWithdrawals)
      .map(([toBox, { totalAmount, withdrawals }]) => ({
        toBox,
        totalAmount,
        withdrawals: withdrawals
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount) 
      .slice(0, 5); 
    res.status(200).json({
      totalWithdrawals: withdrawals.reduce((acc, curr) => acc + curr.amount, 0),
      topWithdrawals
    });
  } catch (error) {
    console.error('Error fetching top withdrawals:', error);
    res.status(500).json({ message: 'Error fetching top withdrawals', error: error.message });
  }
};
