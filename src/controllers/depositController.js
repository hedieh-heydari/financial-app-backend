const Deposit = require('../models/depositModel');
const Wallet = require('../models/walletModel');

// Get All Deposits
exports.getDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find().populate('fromBox toBox');
    res.status(200).json({ message: 'Deposits retrieved successfully', deposits });
  } catch (error) {
    console.error('Error fetching deposits:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add a New Deposit
exports.addDeposit = async (req, res) => {
  const { amount, date, fromBox, toBox, description } = req.body;

  try {
    const deposit = new Deposit({ amount, date, fromBox, toBox, description });
    await deposit.save();

    // Update total wallet amount
    const wallet = await Wallet.findOne();
    if (wallet) {
      wallet.totalAmount += parseFloat(amount);
      await wallet.save();
    } else {
      await Wallet.create({ totalAmount: parseFloat(amount) });
    }

    res.status(201).json({ message: 'Deposit added successfully', deposit });
  } catch (error) {
    console.error('Error adding deposit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a Deposit
exports.updateDeposit = async (req, res) => {
  const { id } = req.params;
  const { amount, date, fromBox, toBox, description } = req.body;

  try {
    const deposit = await Deposit.findById(id);
    if (!deposit) return res.status(404).json({ message: 'Deposit not found' });

    // Adjust total wallet amount
    const wallet = await Wallet.findOne();
    if (wallet) {
      wallet.totalAmount = wallet.totalAmount - deposit.amount + parseFloat(amount);
      await wallet.save();
    }

    deposit.amount = amount;
    deposit.date = date;
    deposit.fromBox = fromBox;
    deposit.toBox = toBox;
    deposit.description = description;
    await deposit.save();

    res.status(200).json({ message: 'Deposit updated successfully', deposit });
  } catch (error) {
    console.error('Error updating deposit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a Deposit
exports.deleteDeposit = async (req, res) => {
  const { id } = req.params;

  try {
    const deposit = await Deposit.findByIdAndDelete(id);
    if (!deposit) return res.status(404).json({ message: 'Deposit not found' });

    // Reduce wallet amount
    const wallet = await Wallet.findOne();
    if (wallet) {
      wallet.totalAmount -= deposit.amount;
      await wallet.save();
    }

    res.status(200).json({ message: 'Deposit deleted successfully' });
  } catch (error) {
    console.error('Error deleting deposit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
