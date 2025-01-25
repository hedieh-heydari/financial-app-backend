const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    logo: { type: String, default: "" },
  },
  { timestamps: true }
);

const Income = mongoose.model("Income", categorySchema);
const Outgo = mongoose.model("Outgo", categorySchema);


const creditCardBoxSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        logo: { type: String, default: "" },
        initialAmount: { type: Number, required: true },
    },
    { timestamps: true }
);

const CreditCardBox = mongoose.model("CreditCardBox", creditCardBoxSchema);

module.exports = { Income, Outgo, CreditCardBox };
