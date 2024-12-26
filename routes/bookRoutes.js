const express = require('express');
const router = express.Router();
const Book = require('../models/bookmodel'); 

router.get('/api/book/download/:title', async (req, res) => {
  try {
    const { title } = req.params;

    const book = await Book.findOne({ title });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Respond with the book content
    res.setHeader('Content-Disposition', `attachment; filename="${title}.txt"`);
    res.setHeader('Content-Type', 'text/plain');
    res.send(book.content); // Assuming `book.content` contains the text of the book
  } catch (error) {
    console.error('Error downloading book:', error);
    res.status(500).json({ message: 'Failed to download book' });
  }
});

module.exports = router;
