const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    fromBox: { type: String, required: false }, // Optional for cash deposits
    toBox: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const Deposit = mongoose.model("Deposit", depositSchema);
module.exports = Deposit;
