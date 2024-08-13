const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { requestToBuy, negotiateRequest, acceptRequest, denyRequest, getUserRequests } = require('../controllers/requestController');

// Request to Buy an Asset
router.post('/:id/request', authMiddleware, requestToBuy);

// Negotiate Purchase Request
router.put('/:id/negotiate', authMiddleware, negotiateRequest);

// Accept Purchase Request
router.put('/:id/accept', authMiddleware, acceptRequest);

// Deny Purchase Request
router.put('/:id/deny', authMiddleware, denyRequest);

// Get User's Purchase Requests
router.get('/user/:id', authMiddleware, getUserRequests);

module.exports = router;
