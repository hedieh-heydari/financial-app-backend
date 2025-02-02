
const mongoose = require("mongoose");
const creditCardBoxSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        logo: { type: String, default: "" },
        initialAmount: { type: Number, required: true },
    },
    { timestamps: true }
);

const CreditCardBox = mongoose.model("CreditCardBox", creditCardBoxSchema);

module.exports = {CreditCardBox };
