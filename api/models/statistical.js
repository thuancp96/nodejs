const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  start_date: { type: String, required: true },
  end_date: { type: String, required: true },
  link: { type: String, required: true },
});

module.exports = mongoose.model("statisticals", userSchema);
