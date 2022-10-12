const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  pagecount: {
    type: Number,
    default: "",
    min: 0,
    required: true,
  },
  price: {
    type: Number,
    default: "",
    min: 0,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "author",
  },
  coverImage: {
    type: String,
  },
});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
