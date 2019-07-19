const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookSchema = new Schema({
  title: String,
  description: String,
  image_url: String,
  author: { type : ObjectId, ref: 'authors' },
  rating: Number
});

const Book = mongoose.model("Book", bookSchema, "books");

module.exports = Book;