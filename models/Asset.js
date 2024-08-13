const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  currentHolder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tradingJourney: [{
    holder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    price: Number
  }],
  averageTradingPrice: Number,
  lastTradingPrice: Number,
  numberOfTransfers: { type: Number, default: 0 },
  isListed:Boolean,
  proposals: { type: Number, default: 0 }
});

module.exports = mongoose.model('Asset', assetSchema);
