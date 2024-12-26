const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Sub-schema for book progress
const bookProgressSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  currentPage: { type: Number, default: 0 },
  percentageRead: { type: Number, default: 0 },
});

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountName: { type: String, required: true },
  user_lib: [bookProgressSchema], // Added user_lib to store book progress
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
