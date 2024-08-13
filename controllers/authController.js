const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Controller for user signup
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller for user login
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signup, login };
