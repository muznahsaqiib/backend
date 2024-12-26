// middlewares/authenticate.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || '1502');
    req.user = decoded;  // Store decoded info on the request object
    next();  // Call the next middleware
  } catch (error) {
    console.error('Authentication failed:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authenticate;
