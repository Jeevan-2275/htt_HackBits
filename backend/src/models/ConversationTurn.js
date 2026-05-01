const mongoose = require('mongoose');

const ConversationTurnSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InterviewSession',
        required: true
    },
    role: {
        type: String,
        enum: ['ai', 'user'],
        required: true
    },
    content: {
        type: String, // Text content (AI question or User transcript)
        required: true
    },
    audioUrl: {
        type: String // URL to audio file (AI TTS output or User input)
    },
    videoTimestamp: {
        type: Number, // Offset in the final video recording
        default: 0
    },
    sentiment: {
        type: String,
        enum: ['positive', 'neutral', 'negative'],
        default: 'neutral'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ConversationTurn', ConversationTurnSchema);
