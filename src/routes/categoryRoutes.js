const express = require("express");
const {
  addCategory,
  updateCategory,
  getIncomeCategories,
  getOutgoCategories,
  addIncomeCategory,
  addOutgoCategory,
  updateIncomeCategory,
  updateOutgoCategory,
} = require("../controllers/categoryController");
const router = express.Router();
const upload = require("../utils/multerConfig");

router.get("/income", getIncomeCategories);
router.get("/outgo", getOutgoCategories);
router.post("/income", upload.single("logo"), addIncomeCategory); 
router.post("/outgo", upload.single("logo"), addOutgoCategory);
router.put("/income/:id", upload.single("logo"), updateIncomeCategory);
router.put("/outgo/:id", upload.single("logo"), updateOutgoCategory);

module.exports = router;
