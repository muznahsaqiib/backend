const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  pdfLink: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  pages: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  released: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  contentFile: {
    type: String,
    required: true
  }
});


const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
