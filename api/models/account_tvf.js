const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, unique: true },
  sdt: { type: String, default: null },
  account: { type: String, required: true },
});

module.exports = mongoose.model("account_tvf", userSchema);
