const InterviewSession = require('../models/InterviewSession');
const Project = require('../models/Project');

// @desc    Get all testimonials/sessions for a project
// @route   GET /api/projects/:projectId/testimonials
exports.getTestimonials = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Verify Project exists and user owns it
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Ensure user owns the project
        if (project.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        const testimonials = await InterviewSession.find({ projectId }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
exports.getTestimonial = async (req, res) => {
    try {
        const testimonial = await InterviewSession.findById(req.params.id)
            .populate('projectId');

        if (!testimonial) {
            return res.status(404).json({ success: false, error: 'Testimonial not found' });
        }

        // Check ownership via Project
        if (testimonial.projectId.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        res.status(200).json({ success: true, data: testimonial });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update testimonial status
// @route   PUT /api/testimonials/:id
exports.updateTestimonial = async (req, res) => {
    try {
        let testimonial = await InterviewSession.findById(req.params.id)
            .populate('projectId');

        if (!testimonial) {
            return res.status(404).json({ success: false, error: 'Testimonial not found' });
        }

        // Check ownership
        if (testimonial.projectId.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        testimonial = await InterviewSession.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: testimonial });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
