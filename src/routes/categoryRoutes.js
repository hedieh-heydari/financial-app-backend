const express = require("express");
const {
  getCategories,
  addCategory,
  updateCategory,
  addCreditCardBox,
  getCreditCardBoxes,
  updateCreditCardBox,
} = require("../controllers/categoryController");
const router = express.Router();
const upload = require('../utils/multerConfig');

router.get("/:type", getCategories); // GET /api/categories/income or /api/categories/outgo
router.post("/:type",  upload.single('logo'),addCategory); // POST /api/categories/income or /api/categories/outgo
router.put("/:type/:id", upload.single('logo'), updateCategory); // PUT /api/categories/income/:id or /api/categories/outgo/:id
router.get("/", getCreditCardBoxes); // GET /api/credit-card-boxes
router.post("/", upload.single('logo'), addCreditCardBox); // POST /api/credit-card-boxes
router.put("/:id", upload.single('logo'), updateCreditCardBox); // PUT /api/credit-card-boxes/:id

module.exports = router;
