const mongoose = require('mongoose');

const CampaignQuestionSetSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    productName: {
        type: String,
        required: true,
        trim: true
    },
    feedbackType: {
        type: String,
        required: true,
        trim: true
    },
    campaignName: {
        type: String,
        required: true,
        trim: true
    },
    productDescription: {
        type: String,
        required: true,
        trim: true
    },
    questions: {
        type: [String],
        required: true,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CampaignQuestionSet', CampaignQuestionSetSchema);
