const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload');
const { protect } = require('../middleware/auth');
const promptController = require('../controllers/promptController');
const interviewController = require('../controllers/interviewController');
const videoController = require('../controllers/videoController');
const jobController = require('../controllers/jobController');
const authController = require('../controllers/authController');
const projectController = require('../controllers/projectController');
const testimonialController = require('../controllers/testimonialController');
const campaignController = require('../controllers/campaignController');
const voiceController = require('../controllers/voiceController');

// --- Auth Routes ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', protect, authController.getMe);

// --- Project Routes ---
router.route('/projects')
    .get(protect, projectController.getProjects)
    .post(protect, projectController.createProject);

router.route('/projects/:id')
    .get(protect, projectController.getProject)
    .put(protect, projectController.updateProject)
    .delete(protect, projectController.deleteProject);

// --- Testimonial / Session Management Routes ---
router.get('/projects/:projectId/testimonials', protect, testimonialController.getTestimonials);
router.route('/testimonials/:id')
    .get(protect, testimonialController.getTestimonial)
    .put(protect, testimonialController.updateTestimonial);

// --- Interview Routes ---
router.post('/prompt', promptController.analyzeUserPrompt);
router.post('/campaigns/questions', campaignController.generateCampaignQuestions);
router.post('/session/start', interviewController.startSession);
router.post('/conversation/next', upload.single('audio'), interviewController.nextTurn);
router.post('/video/upload', upload.single('video'), videoController.uploadRawVideo);
router.post('/process/highlights', videoController.processHighlightsForSession);
router.post('/process/reel', videoController.generateReelForSession);

// --- Voice Routes ---
router.post('/voice/tts', voiceController.textToSpeech);
router.post('/voice/tts-batch', voiceController.batchTextToSpeech);
router.post('/voice/stt', upload.single('audio'), voiceController.speechToText);
router.get('/voice/voices', voiceController.getAvailableVoices);
router.get('/voice/cache-stats', voiceController.getCacheStats);
router.delete('/voice/cache', voiceController.clearCache);

// Job Routes (Simplified Pipeline)
router.post('/jobs/create', upload.single('video'), jobController.createJob);
router.get('/jobs/:jobId', jobController.getJobStatus);

// Status Route
router.get('/health', (req, res) => res.json({ status: 'OK' }));

module.exports = router;
