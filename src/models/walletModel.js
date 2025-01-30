const mongoose = require('mongoose');

  const walletSchema = new mongoose.Schema({
    totalAmount: { type: Number, required: true, default: 0 },
  }, { timestamps: true });
  
  const Wallet = mongoose.model('Wallet', walletSchema);
  module.exports = Wallet;