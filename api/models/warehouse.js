const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  },
  buy_quality: { type: Number, required: [true, "Số lượng nhập vào bắt buộc"] },
  remaining_quality: { type: Number, required: true, min: 0 },
  total_quality: { type: Number, required: true },
});

module.exports = mongoose.model("warehouses", userSchema);
