
const mongoose = require("mongoose");
const creditCardBoxSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        logo: { type: String, default: "" },
        initialAmount: { type: Number, required: true },
    },
    { timestamps: true }
);

const CreditCardBox = mongoose.model("CreditCardBox", creditCardBoxSchema);

module.exports = {CreditCardBox };
