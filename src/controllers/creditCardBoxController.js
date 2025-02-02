const { CreditCardBox } = require("../models/creditCardBoxModel");
const Wallet = require("../models/walletModel");

exports.getCreditCardBoxes = async (req, res) => {
  try {
    const boxes = await CreditCardBox.find();
    res
      .status(200)
      .json({ message: "Credit card boxes retrieved successfully", boxes });
  } catch (error) {
    console.error("Error fetching credit card boxes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add New Credit Card Box
exports.addCreditCardBox = async (req, res) => {
  const { title, initialAmount } = req.body;

  try {
    const box = new CreditCardBox({
      title,
      logo: req.file ? req.file.filename : "",
      initialAmount,
    });
    await box.save();

    // Update total wallet amount
    const wallet = await Wallet.findOne();
    if (wallet) {
      wallet.totalAmount += parseFloat(initialAmount);
      await wallet.save();
    } else {
      await Wallet.create({ totalAmount: parseFloat(initialAmount) });
    }

    res
      .status(201)
      .json({ message: "Credit card box added successfully", box });
  } catch (error) {
    console.error("Error adding credit card box:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Update Credit Card Box
exports.updateCreditCardBox = async (req, res) => {
  const { id } = req.params;
  const { title, initialAmount } = req.body;

  try {
    const box = await CreditCardBox.findById(id);
    if (!box)
      return res.status(404).json({ message: "Credit card box not found" });

    // Adjust wallet total amount
    const wallet = await Wallet.findOne();
    if (wallet) {
      wallet.totalAmount =
        wallet.totalAmount - box.initialAmount + parseFloat(initialAmount);
      await wallet.save();
    }

    // Update the credit card box
    box.title = title;
    box.logo = req.file ? req.file.filename : box.logo;
    box.initialAmount = parseFloat(initialAmount);
    await box.save();

    res
      .status(200)
      .json({ message: "Credit card box updated successfully", box });
  } catch (error) {
    console.error("Error updating credit card box:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
