const { Income, Outgo } = require("../models/categoriesModel");
const verifyToken = require('./tokenController'); 

exports.getIncomeCategories = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const userId = await verifyToken(token); 

    const categories = await Income.find({ userId }); 

    res.status(200).json({ message: "دسته‌بندی‌ها با موفقیت دریافت شدند", categories });
  } catch (error) {
    console.error("خطا در دریافت دسته‌بندی‌ها:", error);
    res.status(500).json({ message: error.message || "خطای داخلی سرور" });
  }
};

exports.getOutgoCategories = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const userId = await verifyToken(token); 

    const categories = await Outgo.find({ userId });

    res.status(200).json({ message: "دسته‌بندی‌ها با موفقیت دریافت شدند", categories });
  } catch (error) {
    console.error("خطا در دریافت دسته‌بندی‌ها:", error);
    res.status(500).json({ message: error.message || "خطای داخلی سرور" });
  }
};


exports.addIncomeCategory = async (req, res) => {
  const { title } = req.body;
  const CategoryModel = Income;

  try {

    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const userId = await verifyToken(token);

    const category = new CategoryModel({
      title,
      logo: req.file ? req.file.filename : "", 
      userId, 
    });

    await category.save();
    res.status(201).json({ message: "دسته‌بندی با موفقیت اضافه شد", category });
  } catch (error) {
    console.error("خطا در اضافه کردن دسته‌بندی:", error);
    res.status(500).json({ message: error.message || "خطای داخلی سرور" });
  }
};


exports.addOutgoCategory = async (req, res) => {
  const { title } = req.body;
  const CategoryModel = Outgo;

  try {

    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const userId = await verifyToken(token);

    const category = new CategoryModel({
      title,
      logo: req.file ? req.file.filename : "", 
      userId, 
    });

    await category.save();
    res.status(201).json({ message: "دسته‌بندی با موفقیت اضافه شد", category });
  } catch (error) {
    console.error("خطا در اضافه کردن دسته‌بندی:", error);
    res.status(500).json({ message: error.message || "خطای داخلی سرور" });
  }
};


exports.updateIncomeCategory = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const CategoryModel = Income;

  try {

    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Get userId from the token
    const userId = await verifyToken(token);

    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { title, logo: req.file ? req.file.filename : undefined, userId }, 
      { new: true }
    );
    if (!category)
      return res.status(404).json({ message: "دسته‌بندی پیدا نشد" });
    
    res.status(200).json({ message: "دسته‌بندی با موفقیت بروزرسانی شد", category });
  } catch (error) {
    console.error("خطا در بروزرسانی دسته‌بندی:", error);
    res.status(500).json({ message: error.message || "خطای داخلی سرور" });
  }
};


exports.updateOutgoCategory = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const CategoryModel = Outgo;

  try {

    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const userId = await verifyToken(token);

    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { title, logo: req.file ? req.file.filename : undefined, userId }, 
      { new: true }
    );
    if (!category)
      return res.status(404).json({ message: "دسته‌بندی پیدا نشد" });
    
    res.status(200).json({ message: "دسته‌بندی با موفقیت بروزرسانی شد", category });
  } catch (error) {
    console.error("خطا در بروزرسانی دسته‌بندی:", error);
    res.status(500).json({ message: error.message || "خطای داخلی سرور" });
  }
};
