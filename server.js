//Aurhor (MUZNAH SAQIB UET 2022-CD-CE-1)
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('./models/user-model');
const Book = require('./models/bookmodel');
const userRoutes = require('./routes/user-routes');
const jwt = require('jsonwebtoken');
const authenticate = require('./middlewares/authenticate');
const progressRoute = require('./routes/progressRoute');
const updateprofile = require('./routes/user-routes');
const changepassword=require('./routes/user-routes');
const app = express();
const port = process.env.PORT || 3000; 

require('dotenv').config();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({ origin: '*' }));  

app.use(userRoutes);  


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vintage-reads', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('Could not connect to MongoDB:', error);
    process.exit(1);  
  });


app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/api', progressRoute);
app.use('/api',updateprofile);
app.use('./api',changepassword);
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books', error });
  }
});

app.post('/api/signup', async (req, res) => {
    const { username, email, password, accountName } = req.body;
  
    try {
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use. Please choose another email.' });
      }
  
      const newUser = new User({
        username,
        email,
        password,  
        accountName,
      });
  
   
      await newUser.save();
  
    
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.JWT_SECRET || '1502',  
        { expiresIn: '1h' }  
      );
  
  
      res.status(201).json({
        message: 'Sign-up successful!',
        user: {
          username: newUser.username,
          email: newUser.email,
          accountName: newUser.accountName,
        },
        token,  
      });
  
    } catch (error) {
      console.error('Error signing up user:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  

app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found. Please register first.' });
    }

   
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || '1502',  
      { expiresIn: '1h' }  
    );

 
    res.status(200).json({
      message: 'Sign-in successful!',
      user,
      token, 
    });
  } catch (error) {
    console.error('Error signing in user:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});



app.get('/api/user/profile', authenticate, async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1]; 
      if (!token) return res.status(401).json({ message: 'Token required' });
  
      const decoded = jwt.verify(token, '1502');
      const userId = decoded.id;

      const user = await User.findById(userId).select('username email accountName');
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      return res.status(200).json({
        username: user.username,
        email: user.email,
        accountName: user.accountName,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      return res.status(500).json({ message: 'Error fetching profile', error });
    }
  });


app.listen(port,'0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
  