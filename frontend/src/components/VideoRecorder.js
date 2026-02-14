'use client';

import { useState, useRef, useEffect } from 'react';
import { createTestimonial, processTestimonial } from '@/lib/mockApi';

export default function VideoRecorder({ onSubmit, campaignId, questions }) {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);
      setHasPermission(true);

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
    } catch (err) {
      setError(`Camera/Microphone Error: ${err.message}`);
      setHasPermission(false);
    }
  };

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
    }
  };

  const handleSubmit = async () => {
    if (!customerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (recordedChunks.length === 0) {
      setError('Please record a testimonial first');
      return;
    }

    setSubmitting(true);
    setIsProcessing(true);
    setProcessingStatus('Initializing...');
    setProcessingProgress(0);
    
    try {
      // Create testimonial first
      const testimonial = await createTestimonial(
        campaignId,
        customerName,
        recordedChunks[0]
      );

      // Start processing pipeline
      await processTestimonial(testimonial.id, (status, stepNumber) => {
        setProcessingStatus(status);
        setProcessingProgress(Math.min((stepNumber / 5) * 100, 100));
      });

      // Call parent callback
      await onSubmit({
        campaignId,
        customerName,
        videoBlob: recordedChunks[0],
      });

      // Reset form
      setCustomerName('');
      setRecordedChunks([]);
      setCurrentQuestionIndex(0);
      setProcessingStatus('');
      setIsProcessing(false);
    } catch (err) {
      setError('Failed to submit testimonial. Please try again.');
      setIsProcessing(false);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Question Display */}
      <div className="bg-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
        <p className="text-blue-400 text-sm font-semibold mb-3">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <p className="text-slate-100 text-lg font-semibold">{questions[currentQuestionIndex]}</p>
      </div>

      {/* Camera/Video Section */}
      <div className="bg-slate-900 border border-white/10 rounded-xl p-8 overflow-hidden">
        {!hasPermission && !isRecording && !stream && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-2xl font-bold text-slate-100 mb-3">Ready to Record?</h3>
            <p className="text-slate-400 mb-6">
              We'll need access to your camera and microphone to record your testimonial
            </p>
            <button
              onClick={startRecording}
              className="px-8 py-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 text-white rounded-lg font-bold transition cursor-pointer"
            >
              Allow & Start Recording
            </button>
          </div>
        )}

        {(isRecording || stream) && (
          <>
            <div className="relative w-full bg-black rounded-lg overflow-hidden mb-6">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full aspect-video object-cover"
              />
              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 px-4 py-2 rounded-lg">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white font-bold">{formatTime(recordingTime)}</span>
                </div>
              )}
            </div>

            {/* Recording Controls */}
            <div className="flex gap-4">
              {!isRecording && recordedChunks.length === 0 && (
                <>
                  <button
                    onClick={startRecording}
                    className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition cursor-pointer"
                  >
                    Start Recording
                  </button>
                  <button
                    onClick={() => {
                      if (stream) {
                        stream.getTracks().forEach((track) => track.stop());
                        setStream(null);
                        setHasPermission(null);
                      }
                      if (videoRef.current) {
                        videoRef.current.srcObject = null;
                      }
                    }}
                    className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              )}

              {isRecording && (
                <>
                  <button
                    onClick={stopRecording}
                    className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition cursor-pointer"
                  >
                    Stop Recording
                  </button>
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => (prev + 1) % questions.length)}
                    className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition cursor-pointer"
                  >
                    Next Question
                  </button>
                </>
              )}

              {!isRecording && recordedChunks.length > 0 && (
                <>
                  <button
                    onClick={() => {
                      setRecordedChunks([]);
                      setRecordingTime(0);
                      if (videoRef.current) {
                        videoRef.current.srcObject = null;
                      }
                    }}
                    className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg font-bold transition cursor-pointer"
                  >
                    Re-record
                  </button>
                  <button
                    onClick={startRecording}
                    className="flex-1 px-6 py-3 bg-cyan-500 hover:bg-blue-600 text-white rounded-lg font-bold transition cursor-pointer"
                  >
                    Record Again
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Customer Name Input */}
      {recordedChunks.length > 0 && (
        <div>
          <label htmlFor="customerName" className="block text-sm font-semibold text-slate-300 mb-3">
            Your Name
          </label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <div className="p-6 bg-cyan-500/10 border border-blue-500/20 rounded-lg">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-400 font-semibold">{processingStatus || 'Processing...'}</p>
              <span className="text-blue-400 text-sm">{Math.round(processingProgress)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${processingProgress}%` }}
              ></div>
            </div>
          </div>
          <p className="text-slate-300 text-sm">AI is processing your testimonial...</p>
        </div>
      )}

      {/* Submit Button */}
      {recordedChunks.length > 0 && !isProcessing && (
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold transition cursor-pointer text-lg"
        >
          {submitting ? 'Submitting Testimonial...' : '✅ Submit Testimonial'}
        </button>
      )}
    </div>
  );
}
