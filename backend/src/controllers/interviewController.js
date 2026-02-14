const Project = require('../models/Project'); // Import Project model
const InterviewSession = require('../models/InterviewSession');
const ConversationTurn = require('../models/ConversationTurn');
const UserPrompt = require('../models/UserPrompt');
const CampaignQuestionSet = require('../models/CampaignQuestionSet');
const aiService = require('../services/aiService');
const transcriptionService = require('../services/transcriptionService');
const { uploadToCloudinary } = require('../config/cloudinary');
const fs = require('fs');

// @desc    Start Interview Session
// @route   POST /api/session/start
exports.startSession = async (req, res) => {
    try {
        const { promptId, projectId, questionSetId } = req.body;

        if (!projectId && !questionSetId) {
            return res.status(400).json({ error: 'Project ID or questionSetId is required' });
        }

        if (projectId) {
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }
        }

        let questionSet = null;
        if (questionSetId) {
            questionSet = await CampaignQuestionSet.findById(questionSetId);
            if (!questionSet) {
                return res.status(404).json({ error: 'Question set not found' });
            }
        }

        const session = await InterviewSession.create({
            promptId,
            projectId,
            questionSetId: questionSet ? questionSet._id : undefined,
            questionIndex: 0,
            status: 'active'
        });

        let firstQuestion = '';
        if (questionSet && questionSet.questions.length > 0) {
            firstQuestion = questionSet.questions[0];
        } else {
            const promptData = await UserPrompt.findById(promptId);
            if (!promptData) return res.status(404).json({ error: 'Prompt not found' });
            firstQuestion = `Hey! Thanks for taking a few minutes to share your thoughts. I'd love to hear about your experience with ${promptData.interviewGoal}. Ready when you are!`;
        }

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

        const session = await InterviewSession.findById(sessionId)
            .populate('promptId')
            .populate('questionSetId');
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

        let nextQText = '';

        if (session.questionSetId && Array.isArray(session.questionSetId.questions)) {
            const baseQuestions = session.questionSetId.questions;
            const nextIndex = session.questionIndex + 1;

            if (nextIndex >= baseQuestions.length) {
                session.status = 'completed';
                session.endTime = new Date();
                await session.save();

                const closingText = 'Thanks so much for sharing your review. We really appreciate your time!';
                const closingAudioPath = await aiService.generateSpeech(closingText);
                const closingAudioUpload = await uploadToCloudinary(closingAudioPath, 'htt_hackbits/audio_responses');

                await ConversationTurn.create({
                    sessionId,
                    role: 'ai',
                    content: closingText,
                    audioUrl: closingAudioUpload.secure_url
                });

                fs.unlinkSync(closingAudioPath);

                return res.json({
                    success: true,
                    transcript: userText,
                    reply: {
                        text: closingText,
                        audio: closingAudioUpload.secure_url
                    },
                    completed: true
                });
            }

            const sentiment = await aiService.detectSentiment(userText);
            const baseQuestion = baseQuestions[nextIndex];
            nextQText = await aiService.generateFollowupQuestion({
                baseQuestion,
                lastAnswer: userText,
                sentiment,
                context: {
                    companyName: session.questionSetId.companyName,
                    productName: session.questionSetId.productName,
                    feedbackType: session.questionSetId.feedbackType,
                    campaignName: session.questionSetId.campaignName,
                    productDescription: session.questionSetId.productDescription
                }
            });

            session.questionIndex = nextIndex;
            await session.save();
        } else {
            const history = await ConversationTurn.find({ sessionId }).sort({ createdAt: 1 });
            nextQText = await aiService.generateNextQuestion(
                history,
                session.promptId.intentMap,
                session.promptId.interviewGoal
            );
        }

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
            transcript: userText,
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
