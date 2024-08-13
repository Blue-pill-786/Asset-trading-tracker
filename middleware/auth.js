const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure you have the User model imported

module.exports = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID decoded from the token
    const user = await User.findById(decoded.userId);
   
    if (!user) return res.status(401).json({ message: 'User not found' });

    // Set the userId in the request object
    req.userId = user._id;
    next();
  } catch (error) {
    console.error('Authentication error:', error); // Log the error for debugging
    res.status(401).json({ message: 'Invalid token' });
  }
};
