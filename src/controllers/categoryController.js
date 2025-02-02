const { Income, Outgo } = require("../models/categoriesModel");

// Get List of Categories
exports.getIncomeCategories = async (req, res) => {
  try {
    const categories = await Income.find();
    res
      .status(200)
      .json({ message: "Categories retrieved successfully", categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getOutgoCategories = async (req, res) => {
  try {
    const categories = await Outgo.find();
    res
      .status(200)
      .json({ message: "Categories retrieved successfully", categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add New Category
exports.addIncomeCategory = async (req, res) => {
  const { title } = req.body;
  const CategoryModel = Income;

  try {
    const category = new CategoryModel({
      title,
      logo: req.file ? req.file.filename : "", // Save the filename
    });
    await category.save();
    res.status(201).json({ message: "Category added successfully", category });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.addOutgoCategory = async (req, res) => {
  const { title } = req.body;
  const CategoryModel = Outgo;

  try {
    const category = new CategoryModel({
      title,
      logo: req.file ? req.file.filename : "", // Save the filename
    });
    await category.save();
    res.status(201).json({ message: "Category added successfully", category });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Category
exports.updateIncomeCategory = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const CategoryModel = Income;

  try {
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { title, logo: req.file ? req.file.filename : undefined },
      { new: true }
    );
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateOutgoCategory = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const CategoryModel = Outgo;

  try {
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { title, logo: req.file ? req.file.filename : undefined },
      { new: true }
    );
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
