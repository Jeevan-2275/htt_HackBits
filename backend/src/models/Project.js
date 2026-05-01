const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a project name'],
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    description: {
        type: String,
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    questions: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['active', 'archived', 'draft'],
        default: 'active'
    },
    theme: {
        primaryColor: {
            type: String,
            default: '#007bff'
        },
        logoUrl: {
            type: String,
            default: ''
        },
        welcomeMessage: {
            type: String,
            default: 'Welcome! We would love to hear your feedback.'
        }
    },
    productName: {
        type: String,
        trim: true,
        default: ''
    },
    companyName: {
        type: String,
        trim: true,
        default: ''
    },
    companyLogo: {
        type: String, // URL or base64
        default: ''
    },
    feedbackType: {
        type: String,
        default: 'General Feedback'
    },
    successMessage: {
        type: String,
        default: 'Thank you for your feedback!'
    },
    testimonialCount: {
        type: Number,
        default: 0
    },
    questionSetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CampaignQuestionSet'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', ProjectSchema);
