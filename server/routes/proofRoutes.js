const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  submitProof,
  getProofs,
  flagProof,
  approveProof
} = require('../controllers/proofController');

// @route   POST /api/proof/:id/submit
// @desc    Submit proof for a goal
// @access  Private
router.post('/:id/submit', auth, submitProof);

// @route   GET /api/proof/:id
// @desc    Get all proofs for a goal
// @access  Public
router.get('/:id', getProofs);

// @route   POST /api/proof/:id/:proofId/flag
// @desc    Flag a proof as fake
// @access  Private
router.post('/:id/:proofId/flag', auth, flagProof);

// @route   POST /api/proof/:id/:proofId/approve
// @desc    Approve a proof
// @access  Private
router.post('/:id/:proofId/approve', auth, approveProof);

module.exports = router;