const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    fromBox: { type: mongoose.Schema.Types.ObjectId, ref: 'CreditCardBox', required: false }, // Optional for cash deposits
    toBox: { type: mongoose.Schema.Types.ObjectId, ref: 'CreditCardBox', required: true },
    description: { type: String, default: '' },
  }, { timestamps: true });
  
  const Deposit = mongoose.model('Deposit', depositSchema);
  module.exports = Deposit;
  