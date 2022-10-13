const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Tên sản phẩm bắt buộc"] },
  description: { type: String, default: null },
  buy_price: { type: Number, required: [true, "giá mua bắt buộc"] },
  sell_price: { type: Number, required: [true, "giá bán bắt buộc"] },
  image: { type: String, default: null },
});

module.exports = mongoose.model("products", userSchema);
