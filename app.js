const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const authRoutes = require('./routes/auth');
const assetRoutes = require('./routes/assets');
const requestRoutes = require('./routes/requests');
require('dotenv').config();
const db = require('./config/mongodb');
const { getUserAssets } = require('./controllers/assetController');
const auth = require('./middleware/auth');
const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/assets', assetRoutes);
app.use('/requests', requestRoutes);
app.get('/users/:id/assets', auth, getUserAssets)

db.connect();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
