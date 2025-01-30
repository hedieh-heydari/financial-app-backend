const Withdrawal = require('../models/widthrawalModel');
const Wallet = require('../models/walletModel');

// Get All Withdrawals
exports.getWithdrawals = async (req, res) => {
  try {
    // Fetch all withdrawals from DB
    const withdrawals = await Withdrawal.find().populate('fromBox toBox');
    
    // Send response with the withdrawals data
    res.status(200).json({ message: 'Withdrawals retrieved successfully', withdrawals });
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a New Withdrawal
exports.addWithdrawal = async (req, res) => {
  const { amount, date, fromBox, toBox, description } = req.body;

  try {
    // Create a new Withdrawal
    const withdrawal = new Withdrawal({ amount, date, fromBox, toBox, description });
    await withdrawal.save();

    // Update the total wallet amount (subtract withdrawal amount)
    const wallet = await Wallet.findOne();
    if (wallet) {
      wallet.totalAmount -= parseFloat(amount);
      await wallet.save();
    } else {
      // If no wallet exists, create one with the negative withdrawal amount
      await Wallet.create({ totalAmount: -parseFloat(amount) });
    }

    // Send response with the created withdrawal data
    res.status(201).json({ message: 'Withdrawal added successfully', withdrawal });
  } catch (error) {
    console.error('Error adding withdrawal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update an Existing Withdrawal
exports.updateWithdrawal = async (req, res) => {
  const { id } = req.params; // Get withdrawal ID from params
  const { amount, date, fromBox, toBox, description } = req.body;

  try {
    // Find the existing withdrawal by ID
    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });

    // Adjust the total wallet amount (subtract old amount and add new amount)
    const wallet = await Wallet.findOne();
    if (wallet) {
      wallet.totalAmount = wallet.totalAmount + withdrawal.amount - parseFloat(amount);
      await wallet.save();
    }

    // Update the withdrawal fields with new data
    withdrawal.amount = amount;
    withdrawal.date = date;
    withdrawal.fromBox = fromBox;
    withdrawal.toBox = toBox;
    withdrawal.description = description;

    // Save the updated withdrawal
    await withdrawal.save();

    // Send response with the updated withdrawal data
    res.status(200).json({ message: 'Withdrawal updated successfully', withdrawal });
  } catch (error) {
    console.error('Error updating withdrawal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a Withdrawal
exports.deleteWithdrawal = async (req, res) => {
  const { id } = req.params; // Get withdrawal ID from params

  try {
    // Find and delete the withdrawal by ID
    const withdrawal = await Withdrawal.findByIdAndDelete(id);
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });

    // Update the wallet total amount (add back the withdrawal amount)
    const wallet = await Wallet.findOne();
    if (wallet) {
      wallet.totalAmount += withdrawal.amount;
      await wallet.save();
    }

    // Send response confirming the deletion
    res.status(200).json({ message: 'Withdrawal deleted successfully' });
  } catch (error) {
    console.error('Error deleting withdrawal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
