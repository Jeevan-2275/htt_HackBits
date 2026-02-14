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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', ProjectSchema);
