'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCampaignById } from '@/lib/mockApi';

export default function RecordPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.campaignId;

  // Core state
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const [currentQuestionAudio, setCurrentQuestionAudio] = useState('');
  const [isFetchingQuestion, setIsFetchingQuestion] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');

  // Step-based flow
  const [step, setStep] = useState('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [customerName, setCustomerName] = useState('');

  // Recording state
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const sessionRecorderRef = useRef(null);
  const sessionChunksRef = useRef([]);
  const aiAudioRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(true);

  // Processing state
  const [processingStep, setProcessingStep] = useState(0);
  const [testimonialId, setTestimonialId] = useState(null);

  // Load campaign
  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const data = await getCampaignById(campaignId);
        if (!data) {
          setError('Campaign not found');
        } else {
          setCampaign(data);
        }
      } catch (err) {
        setError('Failed to load campaign');
      } finally {
        setLoading(false);
      }
    };
    loadCampaign();
  }, [campaignId]);

  // Recording timer
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Cleanup stream on component unmount or when step changes
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log('Track stopped:', track.kind);
        });
      }
    };
  }, [stream]);

  // Ensure video element visibility when stream is available
  useEffect(() => {
    if (stream && videoRef.current && step === 'recording') {
      // Double-check stream is active
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();
      
      console.log('Video tracks active:', videoTracks.map(t => ({ kind: t.kind, state: t.readyState })));
      console.log('Audio tracks active:', audioTracks.map(t => ({ kind: t.kind, state: t.readyState })));
      
      // Ensure video element is visible
      setTimeout(() => {
        if (videoRef.current && !videoRef.current.srcObject) {
          videoRef.current.srcObject = stream;
          console.log('Re-assigned stream to video element');
        }
      }, 100);
    }
  }, [stream, step]);

  const isUsingBackendQuestions = Boolean(campaign?.questionSetId);

  // Simulate AI speaking only for local questions
  useEffect(() => {
    if (!isRecording || isUsingBackendQuestions) return;
    const speakInterval = setInterval(() => {
      setAiSpeaking(false);
      setTimeout(() => setAiSpeaking(true), 2000);
    }, 4000);
    return () => clearInterval(speakInterval);
  }, [isRecording, isUsingBackendQuestions]);

  const playAiAudio = (audioUrl) => {
    if (!audioUrl) return;
    if (aiAudioRef.current) {
      aiAudioRef.current.pause();
      aiAudioRef.current = null;
    }
    const audio = new Audio(audioUrl);
    aiAudioRef.current = audio;
    audio.onplay = () => setAiSpeaking(true);
    audio.onended = () => setAiSpeaking(false);
    audio.onerror = () => setAiSpeaking(false);
    audio.play().catch(() => setAiSpeaking(false));
  };

  const fetchTtsAudio = async (text) => {
    if (!text) return;
    setTtsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'TTS failed');
      }

      const data = await response.json();
      setCurrentQuestionAudio(data.audioUrl || '');
      playAiAudio(data.audioUrl || '');
    } catch (err) {
      setError(err.message || 'TTS failed');
    } finally {
      setTtsLoading(false);
    }
  };

  const transcribeLocalAudio = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'answer.webm');
      formData.append('withTimestamps', 'false');

      const response = await fetch('http://localhost:5000/api/voice/stt', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'STT failed');
      }

      const data = await response.json();
      setLastTranscript(data.transcript || '');
    } catch (err) {
      setError(err.message || 'STT failed');
    }
  };

  const startSessionRecording = (mediaStream) => {
    if (!isUsingBackendQuestions) return;
    if (sessionRecorderRef.current) return;

    sessionChunksRef.current = [];
    const recorder = new MediaRecorder(mediaStream);
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        sessionChunksRef.current.push(event.data);
      }
    };
    recorder.start();
    sessionRecorderRef.current = recorder;
  };

  const stopSessionRecordingAndUpload = async () => {
    if (!sessionRecorderRef.current) return;

    const recorder = sessionRecorderRef.current;
    sessionRecorderRef.current = null;

    const videoBlob = await new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(sessionChunksRef.current, { type: 'video/webm' });
        resolve(blob);
      };
      recorder.stop();
    });

    setUploadingVideo(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('video', videoBlob, 'session.webm');

      const response = await fetch('http://localhost:5000/api/jobs/create', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload video');
      }
    } catch (err) {
      setError(err.message || 'Failed to upload video');
    } finally {
      setUploadingVideo(false);
    }
  };

  const startBackendSession = async () => {
    if (!campaign?.questionSetId || sessionId || isFetchingQuestion) return;
    setIsFetchingQuestion(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionSetId: campaign.questionSetId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to start session');
      }

      const data = await response.json();
      setSessionId(data.sessionId);
      setCurrentQuestionText(data.question?.text || '');
      setCurrentQuestionAudio(data.question?.audio || '');
      setCurrentQuestionIndex(0);
      playAiAudio(data.question?.audio || '');
    } catch (err) {
      setError(err.message || 'Failed to start session');
    } finally {
      setIsFetchingQuestion(false);
    }
  };

  const fetchNextQuestion = async (audioBlob) => {
    if (!sessionId) return;
    setIsFetchingQuestion(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('sessionId', sessionId);
      formData.append('audio', audioBlob, 'answer.webm');

      const response = await fetch('http://localhost:5000/api/conversation/next', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get next question');
      }

      const data = await response.json();
      if (data.completed) {
        await stopSessionRecordingAndUpload();
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        setStep('completed');
        return;
      }

      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentQuestionText(data.reply?.text || '');
      setCurrentQuestionAudio(data.reply?.audio || '');
      playAiAudio(data.reply?.audio || '');
      setStep('question');
    } catch (err) {
      setError(err.message || 'Failed to get next question');
    } finally {
      setIsFetchingQuestion(false);
    }
  };

  useEffect(() => {
    if (step === 'question' && isUsingBackendQuestions) {
      startBackendSession();
    }
  }, [step, isUsingBackendQuestions]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start camera and recording
  const startRecording = async () => {
    try {
      setError('');
      let mediaStream = stream;
      if (!mediaStream) {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
      }

      setStream(mediaStream);
      
      // Use setTimeout to ensure ref is ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          console.log('Stream assigned to video element');
        }
      }, 0);

      const audioStream = new MediaStream(mediaStream.getAudioTracks());
      const mediaRecorder = new MediaRecorder(audioStream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedChunks([blob]);
        if (isUsingBackendQuestions && sessionId) {
          fetchNextQuestion(blob);
        }
      };

      startSessionRecording(mediaStream);
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setStep('recording');
    } catch (err) {
      setError(`Camera/Microphone Error: ${err.message}`);
      console.error('Camera error:', err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (!isUsingBackendQuestions) {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }

        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }

      if (!isUsingBackendQuestions) {
        // Check if more questions
        if (currentQuestionIndex < campaign.questions.length - 1) {
          // Smooth transition to next question
          setTimeout(() => {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setRecordedChunks([]);
            setStep('question');
          }, 800);
        } else {
          // All questions done - move to completed
          setTimeout(() => {
            setStep('completed');
          }, 800);
        }
      } else {
        setStep('question');
      }
    }
  };

  // Cancel recording
  const cancelRecording = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsRecording(false);
    setRecordingTime(0);
    setStep('question');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center relative overflow-hidden">
        {/* Aurora Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center animate-pulse">
            <svg className="w-10 h-10 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-white/70 text-lg">Loading interview...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !campaign) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative z-10 max-w-md text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Campaign Not Found</h1>
          <p className="text-white/60">{error}</p>
        </div>
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <div className="min-h-screen bg-[#050816] relative overflow-hidden">
      {/* Aurora Gradient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-4000"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>

      {/* WELCOME STEP */}
      {step === 'welcome' && (
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full animate-fadeIn">
            <div className="glass rounded-3xl p-12 text-center shadow-2xl shadow-purple-500/20">
              {/* Avatar */}
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                <div className="relative w-32 h-32 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 border border-white/10">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Hi there! 👋
              </h1>
              <p className="text-white/70 text-xl mb-8 max-w-xl mx-auto">
                I'm your AI interviewer. In just 2 minutes, let's capture your authentic thoughts on {campaign.name}.
              </p>

              {/* Campaign Details */}
              <div className="glass-sm border border-white/10 rounded-2xl p-6 mb-8 text-left bg-white/5">
                <p className="text-white/60 text-sm mb-2">Recording for</p>
                <h2 className="text-2xl font-bold text-white mb-4">{campaign.name}</h2>
                <div className="flex gap-4 text-white/70 text-sm">
                    <span>📝 {campaign.questions.length} questions</span>
                  <span>⏱️ ~{Math.ceil(campaign.questions.length * 60 / 2)} seconds</span>
                </div>
              </div>

              {/* Name Input */}
              <div className="mb-8">
                <label className="block text-white/70 text-sm font-medium mb-3">What's your name?</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && customerName.trim() && setStep('question')}
                  placeholder="John Smith"
                  autoFocus
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-white/20 transition duration-300 text-lg"
                />
              </div>

              <button
                onClick={() => customerName.trim() && setStep('question')}
                disabled={!customerName.trim()}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
              >
                Join Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUESTION STEP */}
      {step === 'question' && (
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full animate-fadeIn">
            <div className="glass rounded-3xl p-12 shadow-2xl shadow-purple-500/20">
              {/* Progress Bar */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white/70 text-sm">Question {currentQuestionIndex + 1} of {campaign.questions.length}</span>
                  <span className="text-white/70 text-sm">{Math.round((currentQuestionIndex + 1) / campaign.questions.length * 100)}%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${(currentQuestionIndex + 1) / campaign.questions.length * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* AI Avatar */}
              <div className="flex justify-center mb-10">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-40 ${aiSpeaking ? 'animate-pulse' : ''}`}></div>
                  <div className={`relative w-28 h-28 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 border border-white/10 ${aiSpeaking ? 'animate-pulse' : ''}`}>
                    <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-relaxed">
                  {isUsingBackendQuestions ? (currentQuestionText || 'Preparing your question...') : campaign.questions[currentQuestionIndex]}
                </h2>
              </div>

              {ttsLoading && (
                <div className="glass-sm bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-center">
                  <p className="text-white/70 text-sm">Generating voice...</p>
                </div>
              )}

              {/* Tip */}
              <div className="glass-sm bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 mb-8 text-center">
                <p className="text-blue-300 text-sm">
                  💡 Speak naturally for 30-90 seconds. You can re-record if needed.
                </p>
              </div>

              {error && (
                <div className="glass-sm bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={startRecording}
                disabled={isUsingBackendQuestions && (isFetchingQuestion || !currentQuestionText)}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer flex items-center justify-center gap-3"
              >
                <div className="relative w-4 h-4">
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-1 border-2 border-red-500 rounded-full"></div>
                </div>
                Start Recording
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORDING STEP - Interview Room */}
      {step === 'recording' && (
        <div className="relative z-10 h-screen flex flex-col animate-fadeIn">
          {/* Top Bar - Question & Timer */}
          <div className="glass-sm border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-white/70 text-sm font-medium">Current Question</p>
              <h3 className="text-white text-lg font-bold truncate max-w-2xl">
                {isUsingBackendQuestions ? (currentQuestionText || '...') : campaign.questions[currentQuestionIndex]}
              </h3>
            </div>
            
            {/* Timer */}
            <div className="flex items-center gap-2 glass-sm px-5 py-3 rounded-2xl border border-white/10 ml-6 flex-shrink-0">
              <div className={`w-2 h-2 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-600'} rounded-full`}></div>
              <span className="text-white font-mono font-bold text-lg">{formatTime(recordingTime)}</span>
            </div>
          </div>

          {/* Main Content - Split Layout */}
          <div className="flex-1 flex gap-4 p-6 overflow-hidden">
            {/* Left - AI Interviewer */}
            <div className="w-1/2 flex flex-col items-center justify-center">
              <div className="text-center mb-8">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-3xl ${aiSpeaking ? 'animate-pulse' : 'opacity-40'}`}></div>
                  <div className={`relative w-48 h-48 bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-xl border-2 border-white/20 shadow-2xl shadow-purple-500/30 ${aiSpeaking ? 'animate-pulse' : ''}`}>
                    {campaign.companyLogo ? (
                      <img
                        src={campaign.companyLogo}
                        alt={campaign.companyName || "Company Logo"}
                        className="w-40 h-40 object-contain rounded-full"
                      />
                    ) : (
                      <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                </div>
                
                {/* Company Info */}
                <div className="space-y-2">
                  {campaign.companyName && (
                    <p className="text-white text-lg font-bold">{campaign.companyName}</p>
                  )}
                  {campaign.productName && (
                    <p className="text-white/70 text-sm font-medium">{campaign.productName}</p>
                  )}
                  {campaign.feedbackType && (
                    <p className="text-blue-300/80 text-xs font-medium bg-blue-500/10 px-3 py-1 rounded-full inline-block mt-2">
                      {campaign.feedbackType}
                    </p>
                  )}
                </div>
                
                {aiSpeaking && (
                  <div className="mt-4 flex items-center justify-center gap-1">
                    <div className="w-1 h-4 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1 h-6 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1 h-4 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
                  </div>
                )}
              </div>
            </div>

            {/* Right - User Camera */}
            <div className="w-1/2 flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black border-2 border-white/20 shadow-2xl shadow-purple-500/20">
                {/* Video Element - Must be absolute and higher z-index than overlays */}
                <video
                  ref={videoRef}
                  autoPlay={true}
                  muted={true}
                  playsInline={true}
                  className="absolute inset-0 w-full h-full object-cover z-20 rounded-2xl"
                />

                {/* Recording Indicator - Below video */}
                {stream && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full border border-red-500/50 z-30 backdrop-blur-sm">
                    <div className="relative w-2 h-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    </div>
                    <span className="text-red-400 font-bold text-xs">RECORDING</span>
                  </div>
                )}

                {/* User Label - Below video */}
                {stream && (
                  <div className="absolute top-4 right-4 text-white/70 text-sm font-medium z-30 bg-black/50 px-3 py-1 rounded-full">
                    {customerName}
                  </div>
                )}

                {/* Fallback message when no stream */}
                {!stream && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 rounded-2xl">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-white/40 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-white/60 text-sm">Click "Start Recording" to begin</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {lastTranscript && (
            <div className="px-6 pb-6">
              <div className="glass-sm bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/60 text-xs mb-2">Last response (transcribed)</p>
                <p className="text-white/80 text-sm">{lastTranscript}</p>
              </div>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="glass-sm border-t border-white/10 px-6 py-4 flex items-center justify-center gap-4">
            {/* Mute Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full transition-all duration-300 ${
                isMuted
                  ? 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30'
                  : 'glass-sm border border-white/10 text-white/70 hover:bg-white/10'
              }`}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                {isMuted ? (
                  <path d="M13.5 4.06c0-1.336-1.616-2.256-2.73-1.72l-5.24 2.97A4 4 0 005 9.073V15a4 4 0 004 4h.5m7.07-6.649l2.905 2.905M19 13a7 7 0 11-14 0 7 7 0 0114 0z" />
                ) : (
                  <path d="M19.114 5.636l1.06-1.06a1.5 1.5 0 00-2.12-2.12l-1.06 1.06a8 8 0 11-11.32 11.32l1.06 1.06a1.5 1.5 0 002.12-2.12l-1.06-1.06a6 6 0 009.12-9.12zM9 13a4 4 0 118 0 4 4 0 01-8 0z" />
                )}
              </svg>
            </button>

            {/* Stop Recording Button */}
            <button
              onClick={stopRecording}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              Stop Recording
            </button>

            {/* Cancel Button */}
            <button
              onClick={cancelRecording}
              className="p-4 rounded-full glass-sm border border-white/10 text-white/70 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              title="Go back to question"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* COMPLETED STEP */}
      {step === 'completed' && (
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full animate-fadeIn">
            <div className="glass rounded-3xl p-12 shadow-2xl shadow-emerald-500/20 text-center">
              {/* Success Icon */}
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full opacity-30 blur-3xl animate-pulse"></div>
                <div className="relative w-32 h-32 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 border border-white/10">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Perfect! 🎉
              </h2>
              <p className="text-white/70 text-xl mb-8 max-w-md mx-auto">
                Thank you {customerName}! Your interview has been recorded and is being processed.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  Go to Dashboard
                </button>

                <button
                  onClick={() => {
                    setStep('welcome');
                    setCurrentQuestionIndex(0);
                    setRecordedChunks([]);
                    sessionChunksRef.current = [];
                    sessionRecorderRef.current = null;
                    setCustomerName('');
                  }}
                  className="w-full px-8 py-3 glass-sm border border-white/10 text-white font-medium rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer"
                >
                  Record Another Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
