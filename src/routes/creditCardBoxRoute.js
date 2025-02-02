const express = require("express");
const {
  addCreditCardBox,
  getCreditCardBoxes,
  updateCreditCardBox,
} = require("../controllers/creditCardBoxController");
const router = express.Router();
const upload = require('../utils/multerConfig');

router.get("/", getCreditCardBoxes); // GET /api/credit-card-boxes
router.post("/", upload.single('logo'), addCreditCardBox); // POST /api/credit-card-boxes
router.put("/:id", upload.single('logo'), updateCreditCardBox); // PUT /api/credit-card-boxes/:id

module.exports = router;