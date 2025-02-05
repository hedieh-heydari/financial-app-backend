const Withdrawal = require('../models/widthrawalModel');
const Wallet = require('../models/walletModel');
const verifyToken = require('../controllers/tokenController'); 


exports.getWithdrawals = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  
  try {
    const userId = await verifyToken(token);
    
    const withdrawals = await Withdrawal.find({ userId }).populate('fromBox toBox');
    
    res.status(200).json({ message: 'برداشت‌ها با موفقیت بازیابی شدند', withdrawals });
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
};

exports.addWithdrawal = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  
  const { amount, date, fromBox, toBox, description } = req.body;

  try {
    const userId = await verifyToken(token);

    const withdrawal = new Withdrawal({ userId, amount, date, fromBox, toBox, description });
    await withdrawal.save();

    const wallet = await Wallet.findOne();
    if (wallet) {
      wallet.totalAmount -= parseFloat(amount);
      await wallet.save();
    } else {
      await Wallet.create({ totalAmount: -parseFloat(amount) });
    }

    res.status(201).json({ message: 'برداشت با موفقیت اضافه شد', withdrawal });
  } catch (error) {
    console.error('Error adding withdrawal:', error);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
};



exports.updateWithdrawal = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  
  const { id } = req.params; 
  const { amount, date, fromBox, toBox, description } = req.body;

  try {
    const userId = await verifyToken(token);

    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) return res.status(404).json({ message: 'برداشت پیدا نشد' });
    
    if (withdrawal.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'شما مجاز به به‌روزرسانی این برداشت نیستید' });
    }

    const wallet = await Wallet.findOne();
    if (wallet) {
      wallet.totalAmount = wallet.totalAmount + withdrawal.amount - parseFloat(amount);
      await wallet.save();
    }

    withdrawal.amount = amount;
    withdrawal.date = date;
    withdrawal.fromBox = fromBox;
    withdrawal.toBox = toBox;
    withdrawal.description = description;

    await withdrawal.save();

    res.status(200).json({ message: 'برداشت با موفقیت به‌روزرسانی شد', withdrawal });
  } catch (error) {
    console.error('Error updating withdrawal:', error);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
};



exports.deleteWithdrawal = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  
  const { id } = req.params; 

  try {
    const userId = await verifyToken(token);

    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) return res.status(404).json({ message: 'برداشت پیدا نشد' });

    if (withdrawal.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'شما مجاز به حذف این برداشت نیستید' });
    }

    await Withdrawal.findByIdAndDelete(id);

    const wallet = await Wallet.findOne();
    if (wallet) {
      wallet.totalAmount += withdrawal.amount;
      await wallet.save();
    }

    res.status(200).json({ message: 'برداشت با موفقیت حذف شد' });
  } catch (error) {
    console.error('Error deleting withdrawal:', error);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
};
