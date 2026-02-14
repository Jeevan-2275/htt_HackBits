'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCampaignById, createTestimonial } from '@/lib/mockApi';

export default function RecordPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.campaignId;

  // Core state
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Step-based flow
  const [step, setStep] = useState('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [customerName, setCustomerName] = useState('');

  // Recording state
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedChunks, setRecordedChunks] = useState([]);

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
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedChunks([blob]);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setStep('recording');
    } catch (err) {
      setError(`Camera/Microphone Error: ${err.message}`);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      // Move to processing
      setStep('processing');
      simulateProcessing();
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

  // Simulate AI processing pipeline
  const simulateProcessing = async () => {
    const steps = [
      'Uploading video...',
      'Transcribing audio...',
      'Extracting highlights...',
      'Generating clips...',
    ];

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Create testimonial
    try {
      const result = await createTestimonial(campaignId, customerName, recordedChunks[0]);
      setTestimonialId(result?.id || '1');
    } catch (err) {
      console.error('Failed to create testimonial:', err);
    }

    // Complete
    setTimeout(() => {
      setStep('completed');
    }, 500);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center animate-pulse">
            <svg className="w-10 h-10 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-slate-400 text-lg">Loading campaign...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Campaign Not Found</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <p className="text-slate-500 text-sm">
            Make sure you have the correct campaign link.
          </p>
        </div>
      </div>
    );
  }

  if (!campaign) return null;

  const processingSteps = [
    { label: 'Uploading video...', icon: '📤' },
    { label: 'Transcribing audio...', icon: '🎤' },
    { label: 'Extracting highlights...', icon: '✨' },
    { label: 'Generating clips...', icon: '🎬' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-full filter blur-[100px]"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 pointer-events-none"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">

          {/* STEP: Welcome */}
          {step === 'welcome' && (
            <div className="animate-fadeIn">
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-10 shadow-xl shadow-indigo-500/10 text-center">
                {/* AI Avatar */}
                <div className="relative w-28 h-28 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full animate-pulse opacity-50 blur-xl"></div>
                  <div className="relative w-28 h-28 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                    <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-slate-100 mb-3">
                  Hi 👋 I'm your AI interviewer.
                </h1>
                <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                  I'll guide you through a few questions to capture your authentic testimonial. It only takes 2-3 minutes!
                </p>

                {/* Campaign Info */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-8 text-left">
                  <p className="text-slate-500 text-sm mb-1">Recording for</p>
                  <h2 className="text-xl font-bold text-slate-100 mb-4">{campaign.name}</h2>
                  <p className="text-slate-400 text-sm">
                    {campaign.questions.length} questions • ~{campaign.questions.length * 45} seconds total
                  </p>
                </div>

                {/* Name Input */}
                <div className="mb-8">
                  <label className="block text-slate-400 text-sm mb-2 text-left">Your name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Smith"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition duration-300"
                  />
                </div>

                <button
                  onClick={() => customerName.trim() && setStep('question')}
                  disabled={!customerName.trim()}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                >
                  Start Interview →
                </button>
              </div>
            </div>
          )}

          {/* STEP: Question */}
          {step === 'question' && (
            <div className="animate-fadeIn">
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-10 shadow-xl shadow-indigo-500/10">
                {/* Progress */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-slate-400 text-sm">
                    Question {currentQuestionIndex + 1} of {campaign.questions.length}
                  </span>
                  <div className="flex gap-2">
                    {campaign.questions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          idx === currentQuestionIndex
                            ? 'w-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500'
                            : idx < currentQuestionIndex
                            ? 'bg-emerald-500'
                            : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Question */}
                <div className="text-center mb-10">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center border border-slate-700/50">
                    <span className="text-3xl">🎤</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-100 leading-relaxed">
                    {campaign.questions[currentQuestionIndex]}
                  </h2>
                </div>

                {/* Tips */}
                <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 mb-8">
                  <p className="text-slate-400 text-sm text-center">
                    💡 Speak naturally for 30-60 seconds. You can re-record if needed.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={startRecording}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 cursor-pointer flex items-center justify-center gap-3"
                >
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                  Start Recording
                </button>
              </div>
            </div>
          )}

          {/* STEP: Recording */}
          {step === 'recording' && (
            <div className="animate-fadeIn">
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-red-500/10">
                {/* Camera Preview */}
                <div className="relative aspect-video bg-slate-900">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {/* Recording Indicator */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-full">
                    <div className="relative">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    </div>
                    <span className="text-red-400 font-bold text-sm">REC</span>
                  </div>

                  {/* Timer */}
                  <div className="absolute top-4 right-4 px-4 py-2 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-full">
                    <span className="text-slate-100 font-mono font-bold">{formatTime(recordingTime)}</span>
                  </div>

                  {/* Current Question Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
                    <p className="text-slate-300 text-center text-lg">
                      {campaign.questions[currentQuestionIndex]}
                    </p>
                  </div>
                </div>

                {/* Controls */}
                <div className="p-6 flex items-center justify-center gap-4">
                  <button
                    onClick={cancelRecording}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-all duration-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={stopRecording}
                    className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-105 cursor-pointer flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                    Stop Recording
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP: Processing */}
          {step === 'processing' && (
            <div className="animate-fadeIn">
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-10 shadow-xl shadow-purple-500/10 text-center">
                {/* Animated Icon */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full animate-pulse opacity-30 blur-xl"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-slate-700/50 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-slate-100 mb-2">Processing Your Testimonial</h2>
                <p className="text-slate-400 mb-10">Our AI is analyzing your video...</p>

                {/* Processing Steps */}
                <div className="space-y-4 text-left max-w-sm mx-auto">
                  {processingSteps.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                        idx === processingStep
                          ? 'bg-cyan-500/10 border border-blue-500/30 shadow-lg shadow-purple-500/10'
                          : idx < processingStep
                          ? 'bg-emerald-500/10 border border-emerald-500/30'
                          : 'bg-slate-800/30 border border-slate-700/30 opacity-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                        idx === processingStep
                          ? 'bg-cyan-500/20 animate-pulse'
                          : idx < processingStep
                          ? 'bg-emerald-500/20'
                          : 'bg-slate-700/50'
                      }`}>
                        {idx < processingStep ? '✓' : item.icon}
                      </div>
                      <span className={`font-medium ${
                        idx === processingStep
                          ? 'text-blue-400'
                          : idx < processingStep
                          ? 'text-emerald-400'
                          : 'text-slate-500'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP: Completed */}
          {step === 'completed' && (
            <div className="animate-fadeIn">
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-10 shadow-xl shadow-emerald-500/10 text-center">
                {/* Success Icon */}
                <div className="relative w-28 h-28 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full opacity-30 blur-xl animate-pulse"></div>
                  <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                    <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <h2 className="text-4xl font-bold text-slate-100 mb-4">
                  Your testimonial is ready! 🎉
                </h2>
                <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                  Thank you {customerName}! Your video has been processed and is ready to view.
                </p>

                <div className="space-y-4">
                  <button
                    onClick={() => router.push(`/dashboard/testimonials/${testimonialId || '1'}`)}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  >
                    View Final Reel →
                  </button>

                  <button
                    onClick={() => {
                      setStep('welcome');
                      setCurrentQuestionIndex(0);
                      setRecordedChunks([]);
                      setCustomerName('');
                    }}
                    className="w-full px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    Record Another
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/60 backdrop-blur-md border border-slate-800/50 rounded-full">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-400 text-sm">Your privacy is protected. Video data is processed securely.</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for fade animation */}
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
