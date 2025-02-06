const Deposit = require('../models/depositModel');
const Wallet = require('../models/walletModel');
const verifyToken = require('../controllers/tokenController');

exports.getDeposits = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const userId = await verifyToken(token);
    
    const deposits = await Deposit.find({ userId }).populate('fromBox toBox');
    res.status(200).json({ message: 'سپرده‌ها با موفقیت دریافت شدند', deposits });
  } catch (error) {
    console.error('Error fetching deposits:', error);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
};

exports.addDeposit = async (req, res) => {
  const { amount, date, fromBox, toBox, description } = req.body;

  try {
    const token = req.headers.authorization?.split(' ')[1];
    const userId = await verifyToken(token);
    
    const deposit = new Deposit({ amount, date, fromBox, toBox, description, userId });
    await deposit.save();

    const wallet = await Wallet.findOne();
    if (wallet) {
      wallet.totalAmount += parseFloat(amount);
      await wallet.save();
    } else {
      await Wallet.create({ totalAmount: parseFloat(amount) });
    }

    res.status(201).json({ message: 'سپرده با موفقیت اضافه شد', deposit });
  } catch (error) {
    console.error('Error adding deposit:', error);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
};

exports.updateDeposit = async (req, res) => {
  const { id } = req.params;
  const { amount, date, fromBox, toBox, description } = req.body;

  try {
    const token = req.headers.authorization?.split(' ')[1];
    const userId = await verifyToken(token);

    const deposit = await Deposit.findById(id);
    if (!deposit) return res.status(404).json({ message: 'سپرده پیدا نشد' });
    if (deposit.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'مجوز ویرایش این سپرده را ندارید' });
    }

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

    res.status(200).json({ message: 'سپرده با موفقیت به روز رسانی شد', deposit });
  } catch (error) {
    console.error('Error updating deposit:', error);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
};

exports.deleteDeposit = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { id } = req.params;

  try {
    const userId = await verifyToken(token);
    const deposit = await Deposit.findById(id);
    if (!deposit) return res.status(404).json({ message: 'سپرده پیدا نشد' });
    if (deposit.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'مجوز حذف این سپرده را ندارید' });
    }

    await Deposit.findByIdAndDelete(id);


    const wallet = await Wallet.findOne();
    if (wallet) {
      wallet.totalAmount -= deposit.amount;
      await wallet.save();
    }

    // await deposit.remove();

    res.status(200).json({ message: 'سپرده با موفقیت حذف شد' });
  } catch (error) {
    console.error('Error deleting deposit:', error);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
};
