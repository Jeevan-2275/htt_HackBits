const InterviewSession = require('../models/InterviewSession');
const ConversationTurn = require('../models/ConversationTurn');
const UserPrompt = require('../models/UserPrompt');
const aiService = require('../services/aiService');
const transcriptionService = require('../services/transcriptionService');
const { uploadToCloudinary } = require('../config/cloudinary');
const fs = require('fs');

// @desc    Start Interview Session
// @route   POST /api/session/start
exports.startSession = async (req, res) => {
    try {
        const { promptId } = req.body;

        const session = await InterviewSession.create({
            promptId,
            status: 'active'
        });

        // Generate First Question
        const promptData = await UserPrompt.findById(promptId);
        if (!promptData) return res.status(404).json({ error: 'Prompt not found' });

        // Initial Greeting/Question
        const firstQuestion = `Hi there! I'm your AI interviewer. I'd love to hear about ${promptData.interviewGoal}. Shall we start?`;

        // Generate Audio for first question
        const audioPath = await aiService.generateSpeech(firstQuestion);

        // Upload audio to Cloudinary (or serve static, but Cloudinary is better for persistence)
        const audioUpload = await uploadToCloudinary(audioPath, 'htt_hackbits/audio_responses');

        // Save Turn
        await ConversationTurn.create({
            sessionId: session._id,
            role: 'ai',
            content: firstQuestion,
            audioUrl: audioUpload.secure_url
        });

        // Cleanup local file
        fs.unlinkSync(audioPath);

        res.status(201).json({
            success: true,
            sessionId: session._id,
            question: {
                text: firstQuestion,
                audio: audioUpload.secure_url
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Process User Response & Get Next Question
// @route   POST /api/conversation/next
exports.nextTurn = async (req, res) => {
    try {
        const { sessionId } = req.body;
        // req.file contains the user audio (if sent as form-data 'audio')

        if (!req.file) {
            return res.status(400).json({ error: 'No audio file uploaded' });
        }

        const session = await InterviewSession.findById(sessionId).populate('promptId');
        if (!session || session.status !== 'active') {
            return res.status(400).json({ error: 'Invalid or inactive session' });
        }

        // 1. Transcribe User Audio
        const userText = await transcriptionService.transcribeAudio(req.file.path);

        // 2. Upload User Audio to Cloudinary
        const userAudioUpload = await uploadToCloudinary(req.file.path, 'htt_hackbits/user_audio');

        // 3. Save User Turn
        await ConversationTurn.create({
            sessionId,
            role: 'user',
            content: userText,
            audioUrl: userAudioUpload.secure_url
        });

        // Cleanup User File
        fs.unlinkSync(req.file.path);

        // 4. Check if we should end (time limit or intent coverage - logic simplified here)
        // For now, let's just generate next question based on history
        const history = await ConversationTurn.find({ sessionId }).sort({ createdAt: 1 });

        // 5. Generate AI Response
        const nextQText = await aiService.generateNextQuestion(
            history,
            session.promptId.intentMap,
            session.promptId.interviewGoal
        );

        // 6. Generate AI Audio
        const aiAudioPath = await aiService.generateSpeech(nextQText);
        const aiAudioUpload = await uploadToCloudinary(aiAudioPath, 'htt_hackbits/audio_responses');

        // 7. Save AI Turn
        await ConversationTurn.create({
            sessionId,
            role: 'ai',
            content: nextQText,
            audioUrl: aiAudioUpload.secure_url
        });

        // Cleanup AI Audio File
        fs.unlinkSync(aiAudioPath);

        res.json({
            success: true,
            transcript: userText, // Return what we heard
            reply: {
                text: nextQText,
                audio: aiAudioUpload.secure_url
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
