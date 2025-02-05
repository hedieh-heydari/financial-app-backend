const { CreditCardBox } = require("../models/creditCardBoxModel");
const Wallet = require("../models/walletModel");
const verifyToken = require('../controllers/tokenController');

exports.getCreditCardBoxes = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const userId = await verifyToken(token);
    const boxes = await CreditCardBox.find({ userId });
    res.status(200).json({ message: "جعبه‌های کارت اعتباری با موفقیت بازیابی شدند", boxes });
  } catch (error) {
    console.error("خطا در بازیابی جعبه‌های کارت اعتباری:", error);
    res.status(500).json({ message: "خطای داخلی سرور" });
  }
};

exports.addCreditCardBox = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { title, initialAmount } = req.body;

  try {
    const userId = await verifyToken(token);

    const box = new CreditCardBox({
      title,
      logo: req.file ? req.file.filename : "",
      initialAmount,
      userId,
    });
    await box.save();

    const wallet = await Wallet.findOne();
    if (wallet) {
      wallet.totalAmount += parseFloat(initialAmount);
      await wallet.save();
    } else {
      await Wallet.create({ totalAmount: parseFloat(initialAmount) });
    }

    res.status(201).json({ message: "جعبه کارت اعتباری با موفقیت اضافه شد", box });
  } catch (error) {
    console.error("خطا در افزودن جعبه کارت اعتباری:", error);
    res.status(500).json({ message: "خطای داخلی سرور" });
  }
};

exports.updateCreditCardBox = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { id } = req.params;
  const { title, initialAmount } = req.body;

  try {
    const userId = await verifyToken(token);

    const box = await CreditCardBox.findById(id);
    if (!box) return res.status(404).json({ message: "جعبه کارت اعتباری یافت نشد" });

    if (box.userId.toString() !== userId) {
      return res.status(403).json({ message: "شما فقط می‌توانید جعبه‌های خود را بروزرسانی کنید" });
    }

    const wallet = await Wallet.findOne();
    if (wallet) {
      wallet.totalAmount = wallet.totalAmount - box.initialAmount + parseFloat(initialAmount);
      await wallet.save();
    }

    box.title = title;
    box.logo = req.file ? req.file.filename : box.logo;
    box.initialAmount = parseFloat(initialAmount);
    await box.save();

    res.status(200).json({ message: "جعبه کارت اعتباری با موفقیت بروزرسانی شد", box });
  } catch (error) {
    console.error("خطا در بروزرسانی جعبه کارت اعتباری:", error);
    res.status(500).json({ message: "خطای داخلی سرور" });
  }
};
