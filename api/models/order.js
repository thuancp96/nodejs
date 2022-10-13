const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account_tvf",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  },
  quality: { type: Number, min: 1, required: true },
  date: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("orders", userSchema);
