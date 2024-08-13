const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure you have the User model imported


module.exports = async (req, res, next) => {
  try {
    // Extract token from Authorization header (format: Bearer <token>)
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Extract the nested token from the payload
        const nestedToken = decoded.token;
        if (!nestedToken) return res.status(401).json({ message: 'No nested token found' });


    // Verify and decode the nested token
    const nestedDecoded = jwt.verify(nestedToken, process.env.JWT_SECRET);
   

    // Extract user ID from the nested token payload
    const userId = nestedDecoded.id; // Adjust based on your nested JWT payload structure
    

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    // Attach user ID to request object
    req.userId = user._id;
    next();
  } catch (error) {
    console.error('Authentication error:', error); // Log the error for debugging
    res.status(401).json({ message: 'Invalid token' });
  }
};
