const Project = require("../models/Project");
const InterviewSession = require("../models/InterviewSession");
const ConversationTurn = require("../models/ConversationTurn");
const UserPrompt = require("../models/UserPrompt");
const CampaignQuestionSet = require("../models/CampaignQuestionSet");
const aiService = require("../services/aiService");
const transcriptionService = require("../services/transcriptionService");
const highlightService = require("../services/highlightService");
const { uploadToCloudinary } = require("../config/cloudinary");
const fs = require("fs");

// Process completed interview for testimonial and reel generation
const processCompletedInterview = async (sessionId) => {
  try {
    console.log(`🎬 Processing completed interview: ${sessionId}`);
    
    const session = await InterviewSession.findById(sessionId)
      .populate('questionSetId')
      .populate('projectId');
    
    if (!session) {
      throw new Error('Session not found');
    }

    // Get all conversation turns
    const conversation = await ConversationTurn.find({ sessionId }).sort({ createdAt: 1 });
    
    // Extract user responses only for testimonial content
    const userResponses = conversation.filter(turn => turn.role === 'user');
    const fullTranscript = userResponses.map(turn => turn.content).join(' ');
    
    if (fullTranscript.length < 50) {
      console.log('⚠️ Interview too short for testimonial generation');
      return;
    }

    // Generate testimonial summary and highlights
    const testimonialData = await generateTestimonialContent(fullTranscript, session);
    
    // Update session with testimonial data
    session.testimonialGenerated = true;
    session.testimonialSummary = testimonialData.summary;
    session.reelCaption = testimonialData.caption;
    session.highlights = testimonialData.highlights;
    session.sentiment = testimonialData.sentiment;
    await session.save();
    
    console.log('✅ Testimonial processing completed');
    
  } catch (error) {
    console.error('❌ Error processing completed interview:', error);
    throw error;
  }
};

// Generate testimonial content using AI
const generateTestimonialContent = async (transcript, session) => {
  try {
    const context = {
      companyName: session.questionSetId?.companyName || session.projectId?.companyName || 'Company',
      productName: session.questionSetId?.productName || session.projectId?.productName || 'Product',
      campaignName: session.questionSetId?.campaignName || session.projectId?.name || 'Campaign'
    };

    // Analyze sentiment
    const sentiment = await aiService.detectSentiment(transcript);
    
    // Generate summary
    const summary = await generateTestimonialSummary(transcript, context);
    
    // Generate Instagram reel caption
    const caption = await generateReelCaption(transcript, context, sentiment);
    
    // Extract highlights for reel clips
    const highlights = await extractTestimonialHighlights(transcript);
    
    return {
      sentiment,
      summary,
      caption,
      highlights
    };
    
  } catch (error) {
    console.error('Error generating testimonial content:', error);
    throw error;
  }
};

// Generate testimonial summary
const generateTestimonialSummary = async (transcript, context) => {
  try {
    const prompt = `You are an AI testimonial analyzer. Based on this user feedback, create a concise summary highlighting the key points.

Context:
- Company: ${context.companyName}
- Product: ${context.productName}  
- Campaign: ${context.campaignName}

User Feedback:
"${transcript}"

Create a 2-3 sentence summary focusing on:
- Main problem solved
- Key benefits experienced  
- Overall sentiment

Return only the summary text, no JSON.`;

    const response = await aiService.generateResponse(prompt);
    return response.trim();
    
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'User provided valuable feedback about their experience.';
  }
};

// Generate Instagram reel caption
const generateReelCaption = async (transcript, context, sentiment) => {
  try {
    const prompt = `Create an engaging Instagram reel caption based on this testimonial.

Context:
- Company: ${context.companyName}
- Product: ${context.productName}
- Sentiment: ${sentiment}

Testimonial:
"${transcript}"

Create an Instagram caption that:
- Starts with a hook
- Highlights the key benefit/transformation
- Includes relevant hashtags
- Encourages engagement
- Keeps it under 150 characters

Return only the caption text.`;

    const response = await aiService.generateResponse(prompt);
    return response.trim();
    
  } catch (error) {
    console.error('Error generating caption:', error);
    return `Amazing feedback about ${context.productName}! 🚀 #testimonial #${context.companyName.toLowerCase()}`;
  }
};

// Extract highlights for reel creation
const extractTestimonialHighlights = async (transcript) => {
  try {
    // Create mock segments for highlight extraction
    const segments = [{
      start: 0,
      end: transcript.length / 10, // Rough time estimate
      text: transcript
    }];
    
    const highlights = await highlightService.extractHighlights(transcript, segments);
    return highlights || [];
    
  } catch (error) {
    console.error('Error extracting highlights:', error);
    return [];
  }
};

// @desc    Start Interview Session
// @route   POST /api/session/start
exports.startSession = async (req, res) => {
  try {
    const { promptId, projectId, questionSetId } = req.body;

    if (!projectId && !questionSetId) {
      return res
        .status(400)
        .json({ error: "Project ID or questionSetId is required" });
    }

    if (projectId) {
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
    }

    let questionSet = null;
    if (questionSetId) {
      questionSet = await CampaignQuestionSet.findById(questionSetId);
      if (!questionSet) {
        return res.status(404).json({ error: "Question set not found" });
      }
    }

    const session = await InterviewSession.create({
      promptId,
      projectId,
      questionSetId: questionSet ? questionSet._id : undefined,
      questionIndex: 0,
      status: "active",
    });

    let firstQuestion = "";
    if (questionSet && questionSet.questions.length > 0) {
      firstQuestion = questionSet.questions[0];
    } else {
      const promptData = await UserPrompt.findById(promptId);
      if (!promptData)
        return res.status(404).json({ error: "Prompt not found" });
      firstQuestion = `Hey! Thanks for taking a few minutes to share your thoughts. I'd love to hear about your experience with ${promptData.interviewGoal}. Ready when you are!`;
    }

    // Generate Audio for first question (with safe fallback)
    let audioUrl = "";
    try {
      const audioPath = await aiService.generateSpeech(firstQuestion);
      if (audioPath && fs.existsSync(audioPath)) {
        const audioUpload = await uploadToCloudinary(
          audioPath,
          "htt_hackbits/audio_responses",
        );
        audioUrl = audioUpload.secure_url;
        if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
      }
    } catch (ttsErr) {
      console.warn("⚠️ TTS generation failed in startSession (browser speech synthesis will be used):", ttsErr.message);
    }

    // Save Turn
    await ConversationTurn.create({
      sessionId: session._id,
      role: "ai",
      content: firstQuestion,
      audioUrl: audioUrl || "",
    });

    res.status(201).json({
      success: true,
      sessionId: session._id,
      question: {
        text: firstQuestion,
        audio: audioUrl || "",
      },
    });
  } catch (error) {
    console.error("Start Session Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Process User Response & Get Next Question
// @route   POST /api/conversation/next
exports.nextTurn = async (req, res) => {
  try {
    const { sessionId } = req.body;
    // req.file contains the user audio (if sent as form-data 'audio')

    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const session = await InterviewSession.findById(sessionId)
      .populate("promptId")
      .populate("questionSetId");
    if (!session || session.status !== "active") {
      return res.status(400).json({ error: "Invalid or inactive session" });
    }

    // 1. Transcribe User Audio (needed immediately for AI)
    const userText = await transcriptionService.transcribeAudio(req.file.path);

    // 2. Detect Sentiment
    const sentiment = await aiService.detectSentiment(userText);

    // 3. Save User Turn immediately with text & sentiment (upload audio in background)
    const userTurn = await ConversationTurn.create({
      sessionId,
      role: "user",
      content: userText,
      audioUrl: null, // Will be updated in background
      sentiment: sentiment,
    });

    // 3. Upload User Audio to Cloudinary in background
    const userAudioPath = req.file.path;
    setImmediate(async () => {
      try {
        const userAudioUpload = await uploadToCloudinary(
          userAudioPath,
          "htt_hackbits/user_audio",
        );
        
        // Update conversation turn with audio URL
        await ConversationTurn.findByIdAndUpdate(
          userTurn._id,
          { audioUrl: userAudioUpload.secure_url }
        );
        
        // Cleanup User File
        fs.unlinkSync(userAudioPath);
        
        console.log('✅ User audio uploaded for session:', sessionId);
      } catch (uploadError) {
        console.error('❌ User audio upload error:', uploadError);
        // Try to cleanup file even if upload fails
        try {
          if (fs.existsSync(userAudioPath)) {
            fs.unlinkSync(userAudioPath);
          }
        } catch (cleanupError) {
          console.error('File cleanup error:', cleanupError);
        }
      }
    });

    let nextQText = "";

    if (
      session.questionSetId &&
      Array.isArray(session.questionSetId.questions)
    ) {
      const baseQuestions = session.questionSetId.questions;
      const nextIndex = session.questionIndex + 1;

      if (nextIndex >= baseQuestions.length) {
        session.status = "completed";
        session.endTime = new Date();
        await session.save();

        const context = {
          companyName: session.questionSetId.companyName,
          productName: session.questionSetId.productName,
          campaignName: session.questionSetId.campaignName,
          interviewGoal: session.promptId?.interviewGoal,
        };
        
        // Generate closing text immediately
        const closingText = await aiService.generateClosingStatement(context);

        // Save conversation turn immediately without audio URL
        await ConversationTurn.create({
          sessionId,
          role: "ai",
          content: closingText,
          audioUrl: null, // Will be updated in background if needed
        });

        // Process audio upload and testimonial generation in background (don't await)
        setImmediate(async () => {
          try {
            console.log('🎬 Starting background processing for session:', sessionId);
            
            // Generate and upload audio in background
            const closingAudioPath = await aiService.generateSpeech(closingText);
            const closingAudioUpload = await uploadToCloudinary(
              closingAudioPath,
              "htt_hackbits/audio_responses",
            );
            fs.unlinkSync(closingAudioPath);
            
            // Update conversation turn with audio URL
            await ConversationTurn.findOneAndUpdate(
              { sessionId, role: "ai", content: closingText },
              { audioUrl: closingAudioUpload.secure_url }
            );
            
            console.log('✅ Audio uploaded to Cloudinary');
            
            // Process completed interview for testimonial generation
            await processCompletedInterview(sessionId);
            console.log('✅ Testimonial processing completed');
            
          } catch (procError) {
            console.error('❌ Background processing error:', procError);
          }
        });

        // Return immediately without waiting for uploads
        return res.json({
          success: true,
          transcript: userText,
          reply: {
            text: closingText,
            audio: null, // Audio will be available later
          },
          completed: true,
          message: "Interview completed! Processing your testimonial in background..."
        });
      }

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
          productDescription: session.questionSetId.productDescription,
        },
      });

      session.questionIndex = nextIndex;
      await session.save();
    } else {
      const history = await ConversationTurn.find({ sessionId }).sort({
        createdAt: 1,
      });
      nextQText = await aiService.generateNextQuestion(
        history,
        session.promptId.intentMap,
        session.promptId.interviewGoal,
      );
    }

    // 6. Save AI Turn immediately with text (without audio URL for now)
    const conversationTurn = await ConversationTurn.create({
      sessionId,
      role: "ai",
      content: nextQText,
      audioUrl: null, // Will be updated in background
    });

    // 7. Generate and upload audio in background (don't block response)
    setImmediate(async () => {
      try {
        const aiAudioPath = await aiService.generateSpeech(nextQText);
        const aiAudioUpload = await uploadToCloudinary(
          aiAudioPath,
          "htt_hackbits/audio_responses",
        );
        fs.unlinkSync(aiAudioPath);
        
        // Update conversation turn with audio URL
        await ConversationTurn.findByIdAndUpdate(
          conversationTurn._id,
          { audioUrl: aiAudioUpload.secure_url }
        );
        
        console.log('✅ AI audio uploaded for session:', sessionId);
      } catch (audioError) {
        console.error('❌ Background audio upload error:', audioError);
      }
    });

    // 8. Return immediately to user
    res.json({
      success: true,
      transcript: userText,
      reply: {
        text: nextQText,
        audio: null, // Audio will be available later
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
