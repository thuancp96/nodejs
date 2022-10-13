const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  full_name: { type: String, required: [true, "Full name is required"] },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email",
    },
    required: [true, "Email required"],
  },
  sdt: { type: String, default: null },
  account: { type: String, required: true },
});

module.exports = mongoose.model("account_tvf", userSchema);
