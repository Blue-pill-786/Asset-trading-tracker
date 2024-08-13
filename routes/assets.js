const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { createAsset, updateAsset, publishAsset, getAssetDetails } = require('../controllers/assetController');

// Create Asset / Save as Draft
router.post('/', authMiddleware, createAsset);

// Update Asset
router.post('/:id', authMiddleware, updateAsset);

// List Asset on Marketplace
router.put('/:id/publish', authMiddleware, publishAsset);

// Get Asset Details
router.get('/:id', getAssetDetails);


module.exports = router;
