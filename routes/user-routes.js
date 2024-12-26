const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const authenticate =require('../middlewares/authenticate')
const router = express.Router();

const secret = '1502'; 


const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded; 
    next();
  });
};

router.get('/user', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/api/user/update', authenticate, async (req, res) => {
  const { username, accountName } = req.body;

  // req.user is added by the authenticate middleware
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);  // Find user by ID (from the token)

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update profile fields
    user.username = username || user.username;
    user.accountName = accountName || user.accountName;

    await user.save();
    res.json(user);  // Send the updated user profile back
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
});

module.exports = router;
