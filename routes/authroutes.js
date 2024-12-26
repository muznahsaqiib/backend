const express = require('express');
const router = express.Router();
const signIn = require('../controllers/signIn');
const getUserProfile = require('../controllers/getUserProfile');
const authenticate = require('../middlewares/authenticate');  

router.post('/signin', signIn);  
router.get('/profile', authenticate, getUserProfile);  

module.exports = router;