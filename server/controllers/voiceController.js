const OpenAI = require('openai');
const multer = require('multer');
const fs = require('fs');
const Goal = require('../models/Goal');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Configure multer for audio file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `voice_${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/webm'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files allowed'));
    }
  }
});

exports.uploadMiddleware = upload.single('audio');

// TRANSCRIBE VOICE NOTE
exports.transcribeVoice = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No audio file uploaded' });

    const audioFile = fs.createReadStream(req.file.path);

    // Use Whisper API to transcribe
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en'
    });

    // Delete temp file after transcription
    fs.unlinkSync(req.file.path);

    res.json({
      text: transcription.text,
      msg: 'Voice transcribed successfully'
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Transcription failed', error: err.message });
  }
};

// TRANSCRIBE AND CREATE GOAL FROM VOICE
exports.createGoalFromVoice = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No audio file uploaded' });

    const audioFile = fs.createReadStream(req.file.path);

    // Transcribe voice
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en'
    });

    fs.unlinkSync(req.file.path);

    const text = transcription.text;

    // Return transcribed text for user to review before creating goal
    res.json({
      transcribedText: text,
      msg: 'Voice transcribed. Review and confirm to create goal.'
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Failed to process voice', error: err.message });
  }
};