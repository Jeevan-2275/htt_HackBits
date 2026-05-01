const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.user.id });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Make sure user owns project
        if (project.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to access this project' });
        }

        res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

<<<<<<< HEAD
// @desc    Get single project (Public - for recording page)
// @route   GET /api/projects/public/:id
// @access  Public
exports.getProjectPublic = async (req, res) => {
    try {
        const id = req.params.id;
        
        if (!id || id === 'undefined') {
            console.error('❌ Invalid campaign ID:', id);
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid campaign ID',
                details: 'Campaign ID is required'
            });
        }
        
        console.log('📍 Getting public project with ID:', id);
        
        const project = await Project.findById(id);
        
        console.log('📍 Project result:', project ? `Found - ${project._id}` : 'Not found');

        if (!project) {
            console.error('❌ Campaign not found for ID:', id);
            return res.status(404).json({ success: false, error: 'Campaign not found' });
        }

        // Return only necessary fields for recording (no userId for security)
        const responseData = {
            _id: project._id,
            name: project.name,
            description: project.description,
            questions: project.questions,
            productName: project.productName,
            companyName: project.companyName,
            companyLogo: project.companyLogo,
            feedbackType: project.feedbackType,
            createdAt: project.createdAt
        };
        
        console.log('✅ Returning public project:', project._id);
        res.status(200).json({ 
            success: true, 
            data: responseData
        });
    } catch (error) {
        console.error('❌ Error in getProjectPublic:', error.message);
        res.status(500).json({ success: false, error: 'Server Error', details: error.message });
    }
};
=======
const CampaignQuestionSet = require('../models/CampaignQuestionSet');
>>>>>>> 8370a91 (Update backend controllers (interview, project, testimonial))

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
    try {
        // Validate required fields
        const { name, description, questions } = req.body;
        
        if (!name) {
            return res.status(400).json({ success: false, error: 'Campaign name is required' });
        }

        if (!description) {
            return res.status(400).json({ success: false, error: 'Product description is required' });
        }

        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ success: false, error: 'At least one question is required' });
        }

        // Add user to req.body
        req.body.userId = req.user.id;

        // Handle Questions: If provided, create a QuestionSet
        if (req.body.questions && Array.isArray(req.body.questions)) {
            const questionSet = await CampaignQuestionSet.create({
                companyName: req.body.companyName || req.body.name, // Fallback
                productName: req.body.productName || 'Default Product',
                feedbackType: req.body.feedbackType || 'General',
                campaignName: req.body.name,
                productDescription: req.body.description || 'No description', 
                questions: req.body.questions
            });
            req.body.questionSetId = questionSet._id;
        }

        const project = await Project.create(req.body);

        res.status(201).json({ success: true, data: project });
    } catch (error) {
        console.error(error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, error: messages[0] });
        }
        
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Make sure user owns project
        if (project.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this project' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Make sure user owns project
        if (project.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this project' });
        }

        await project.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
