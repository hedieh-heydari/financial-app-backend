const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    fromBox: { type: String, required: false }, 
    toBox: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const Deposit = mongoose.model("Deposit", depositSchema);
module.exports = Deposit;
