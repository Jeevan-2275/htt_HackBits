const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload');
const { protect } = require('../middleware/auth');
const promptController = require('../controllers/promptController');
const interviewController = require('../controllers/interviewController');
const campaignController = require('../controllers/campaignController');
const jobController = require('../controllers/jobController');
const videoController = require('../controllers/videoController');
const authController = require('../controllers/authController');
const projectController = require('../controllers/projectController');
const testimonialController = require('../controllers/testimonialController');

// --- Auth Routes ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', protect, authController.getMe);

// --- Project Routes ---
router.route('/projects')
    .get(protect, projectController.getProjects)
    .post(protect, projectController.createProject);

// Public route for getting campaign by ID (for recording page)
router.get('/projects/public/:id', projectController.getProjectPublic);

router.route('/projects/:id')
    .get(protect, projectController.getProject)
    .put(protect, projectController.updateProject)
    .delete(protect, projectController.deleteProject);

// --- Campaign Routes ---
router.post('/campaigns/questions', campaignController.generateCampaignQuestions);

// --- Testimonial / Session Management Routes ---
router.get('/projects/:projectId/testimonials', protect, testimonialController.getTestimonials);
router.route('/testimonials/:id')
    .get(protect, testimonialController.getTestimonial)
    .put(protect, testimonialController.updateTestimonial);

// --- Interview Routes ---
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
