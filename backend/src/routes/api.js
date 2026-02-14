const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload');
const promptController = require('../controllers/promptController');
const interviewController = require('../controllers/interviewController');
const jobController = require('../controllers/jobController');

const videoController = require('../controllers/videoController');

// Routes
router.post('/prompt', promptController.analyzeUserPrompt);
router.post('/session/start', interviewController.startSession);
router.post('/conversation/next', upload.single('audio'), interviewController.nextTurn);
router.post('/video/upload', upload.single('video'), videoController.uploadRawVideo);
router.post('/process/highlights', videoController.processHighlightsForSession);
router.post('/process/reel', videoController.generateReelForSession);

// Job Routes (Simplified Pipeline)
router.post('/jobs/create', upload.single('video'), jobController.createJob);
router.get('/jobs/:jobId', jobController.getJobStatus);

// Status Route
router.get('/health', (req, res) => res.json({ status: 'OK' }));

module.exports = router;
