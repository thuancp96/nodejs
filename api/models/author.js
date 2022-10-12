const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    default: "",
  },
  gender: {
    type: Boolean,
    required: true,
  },
});

const Author = mongoose.model("author", AuthorSchema);

module.exports = Author;
