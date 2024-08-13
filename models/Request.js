const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  currentHolder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  proposedPrice: Number,
  status: { type: String, enum: ['pending', 'accepted', 'denied'], default: 'pending' }
});

module.exports = mongoose.model('Request', requestSchema);
