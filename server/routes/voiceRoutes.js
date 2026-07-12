const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  transcribeVoice,
  createGoalFromVoice,
  uploadMiddleware
} = require('../controllers/voiceController');

// @route   POST /api/voice/transcribe
// @desc    Transcribe a voice note to text
// @access  Private
router.post('/transcribe', auth, uploadMiddleware, transcribeVoice);

// @route   POST /api/voice/goal
// @desc    Transcribe voice and prepare goal creation
// @access  Private
router.post('/goal', auth, uploadMiddleware, createGoalFromVoice);

module.exports = router;