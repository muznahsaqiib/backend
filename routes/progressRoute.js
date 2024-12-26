const express = require('express');
const router = express.Router();
const User = require('../models/user-model'); // Adjust the path as necessary

// Save or update progress
router.post('/progress', async (req, res) => {
  const { email, title, image, currentPage, percentageRead } = req.body;

  try {
    // Validate required fields
    if (!email || !title || currentPage === undefined || percentageRead === undefined) {
      return res.status(400).json({ message: 'Invalid request. Missing required fields.' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the book already exists in the user's library
    const bookIndex = user.user_lib.findIndex((book) => book.title === title);

    if (bookIndex !== -1) {
      // Update existing book's progress
      user.user_lib[bookIndex].currentPage = currentPage;
      user.user_lib[bookIndex].percentageRead = percentageRead;
    } else {
      // Add a new book to the library
      user.user_lib.push({ title, image, currentPage, percentageRead });
    }

    // Save the user document
    await user.save();
    res.status(200).json({ message: 'Progress saved or updated successfully.' });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ message: 'An error occurred while saving progress.' });
  }
});


// Get incomplete books (wishlist)
router.get('/wishlist/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const incompleteBooks = user.user_lib.filter((book) => book.percentageRead < 100);
    res.json(incompleteBooks);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Failed to fetch wishlist.' });
  }
});

module.exports = router;
