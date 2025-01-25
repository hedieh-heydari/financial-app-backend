const { Income, Outgo, CreditCardBox } = require("../models/categoriesModel");
const Wallet = require("../models/walletModel");

// Get List of Categories
exports.getCategories = async (req, res) => {
  try {
    const categories =
      req.params.type === "income" ? await Income.find() : await Outgo.find();
    res
      .status(200)
      .json({ message: "Categories retrieved successfully", categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add New Category
exports.addCategory = async (req, res) => {
    const { title } = req.body;
    const CategoryModel = req.params.type === 'income' ? Income : Outgo;
  
    try {
      const category = new CategoryModel({
        title,
        logo: req.file ? req.file.filename : '', // Save the filename
      });
      await category.save();
      res.status(201).json({ message: 'Category added successfully', category });
    } catch (error) {
      console.error('Error adding category:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Update Category
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const CategoryModel = req.params.type === 'income' ? Income : Outgo;
  
    try {
      const category = await CategoryModel.findByIdAndUpdate(
        id,
        { title, logo: req.file ? req.file.filename : undefined },
        { new: true }
      );
      if (!category) return res.status(404).json({ message: 'Category not found' });
      res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

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
        logo: req.file ? req.file.filename : '',
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
  
      res.status(201).json({ message: 'Credit card box added successfully', box });
    } catch (error) {
      console.error('Error adding credit card box:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
// Update Credit Card Box
exports.updateCreditCardBox = async (req, res) => {
    const { id } = req.params;
    const { title, initialAmount } = req.body;
  
    try {
      const box = await CreditCardBox.findById(id);
      if (!box) return res.status(404).json({ message: 'Credit card box not found' });
  
      // Adjust wallet total amount
      const wallet = await Wallet.findOne();
      if (wallet) {
        wallet.totalAmount = wallet.totalAmount - box.initialAmount + parseFloat(initialAmount);
        await wallet.save();
      }
  
      // Update the credit card box
      box.title = title;
      box.logo = req.file ? req.file.filename : box.logo;
      box.initialAmount = parseFloat(initialAmount);
      await box.save();
  
      res.status(200).json({ message: 'Credit card box updated successfully', box });
    } catch (error) {
      console.error('Error updating credit card box:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
