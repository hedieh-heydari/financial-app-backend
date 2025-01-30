const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  fromBox: { type: mongoose.Schema.Types.ObjectId, ref: 'CreditCardBox', required: true },
  toBox: { type: mongoose.Schema.Types.ObjectId, ref: 'CreditCardBox', required: false }, // Optional for cash withdrawals
  description: { type: String, default: '' },
}, { timestamps: true });

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);
module.exports = Withdrawal;
