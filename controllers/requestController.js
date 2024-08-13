const Request = require('../models/Request');
const Asset = require('../models/Asset');

// Request to Buy an Asset
const requestToBuy = async (req, res) => {
  const { proposedPrice } = req.body;
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    const request = new Request({ asset: asset._id, buyer: req.userId,currentHolder: asset.currentHolder, proposedPrice });
    await request.save();
    res.status(201).json({ message: 'Purchase request sent' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Negotiate Purchase Request
const negotiateRequest = async (req, res) => {
  const { newProposedPrice } = req.body;
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (!request.currentHolder.equals(req.userId)) return res.status(403).json({ message: 'Not authorized' });

    request.proposedPrice = newProposedPrice;
    await request.save();
    res.status(200).json({ message: 'Negotiation updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Accept Purchase Request
const acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (!request.currentHolder.equals(req.userId)) return res.status(403).json({ message: 'Not authorized' });

    const asset = await Asset.findById(request.asset);
    asset.currentHolder = request.buyer;
    asset.tradingJourney.push({ holder: request.buyer, price: request.proposedPrice });
    asset.lastTradingPrice = request.proposedPrice;
    asset.numberOfTransfers += 1;

    await asset.save();
    await request.updateOne({ status: 'accepted' });
    res.status(200).json({ message: 'Request accepted, holder updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deny Purchase Request
const denyRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (!request.currentHolder.equals(req.userId)) return res.status(403).json({ message: 'Not authorized' });

    await request.updateOne({ status: 'denied' });
    res.status(200).json({ message: 'Request denied' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get User's Purchase Requests
const getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ buyer: req.params.id });
    res.status(200).json(requests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { requestToBuy, negotiateRequest, acceptRequest, denyRequest, getUserRequests };
