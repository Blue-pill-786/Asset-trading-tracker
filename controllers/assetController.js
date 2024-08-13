const Asset = require('../models/Asset');

// Create Asset / Save as Draft
const createAsset = async (req, res) => {
  const { name, description, image, status } = req.body;
  try {
    const asset = new Asset({ name, description, image, status, creator: req.userId, currentHolder: req.userId });
   
    await asset.save();
    res.status(201).json({ message: 'Asset created successfully', assetId: asset._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Asset
const updateAsset = async (req, res) => {
  const { name, description, image, status } = req.body;
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, { name, description, image, status }, { new: true });
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.status(200).json({ message: 'Asset updated successfully', assetId: asset._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// List Asset on Marketplace
const publishAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
   
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    if(asset.currentHolder  != req.userId ) return res.status(404).json({message:"Not authorized"})

    asset.status = 'published';
    await asset.save();
    res.status(200).json({ message: 'Asset published successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Asset Details
const getAssetDetails = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate('creator', 'username')
      .populate('currentHolder', 'username');
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.status(200).json(asset);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get User's Assets
const getUserAssets = async (req, res) => {
  try {
    const userId = req.params.id
    const assets = await Asset.find({
      $or: [
        { creator: userId },
        { currentHolder: userId }
      ]
    });
    console.log(assets)
    res.status(200).json(assets);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createAsset, updateAsset, publishAsset, getAssetDetails, getUserAssets };
