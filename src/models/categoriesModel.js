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




module.exports = { Income, Outgo };
