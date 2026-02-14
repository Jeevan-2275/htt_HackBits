"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCampaignById } from "@/lib/mockApi";

export default function RecordPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.campaignId;

  // Core state
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestionText, setCurrentQuestionText] = useState("");
  const [currentQuestionAudio, setCurrentQuestionAudio] = useState("");
  const [isFetchingQuestion, setIsFetchingQuestion] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("en-US-AnaNeural");
  const [availableVoices, setAvailableVoices] = useState({
    "en-US": [
      "en-US-AnaNeural",
      "en-US-AriaNeural",
      "en-US-GuyNeural",
      "en-US-JennyNeural",
    ],
    "en-GB": ["en-GB-AmyNeural", "en-GB-RyanNeural", "en-GB-SoniaNeural"],
    "en-IN": ["en-IN-NeerjaNeural", "en-IN-PrabhatNeural"],
    "es-ES": ["es-ES-AlvaroNeural", "es-ES-ElviraNeural"],
    "fr-FR": ["fr-FR-DeniseNeural", "fr-FR-HenriNeural"],
    "de-DE": ["de-DE-AmalaNeural", "de-DE-ConradNeural"],
  });

  // Step-based flow
  const [step, setStep] = useState("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [customerName, setCustomerName] = useState("");

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
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const aiSpeakingRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    aiSpeakingRef.current = aiSpeaking;
  }, [aiSpeaking]);

  // Processing state
  const [processingStep, setProcessingStep] = useState(0);
  const [testimonialId, setTestimonialId] = useState(null);
  const hasStartedSpeakingRef = useRef(false);

  // Load campaign
  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const data = await getCampaignById(campaignId);
        if (!data) {
          setError("Campaign not found");
        } else {
          setCampaign(data);
        }
      } catch (err) {
        setError("Failed to load campaign");
      } finally {
        setLoading(false);
      }
    };
    loadCampaign();

    // Load available voices from backend
    const fetchVoices = async () => {
      try {
        console.log("[TTS] Fetching available voices from backend...");
        const response = await fetch("http://localhost:5000/api/voice/voices");
        if (response.ok) {
          const data = await response.json();
          if (data.voices && Object.keys(data.voices).length > 0) {
            console.log("[TTS] ✓ Voices loaded from backend:", data.voices);
            setAvailableVoices(data.voices);
          } else {
            console.log("[TTS] Backend returned empty voices, using defaults");
          }
        } else {
          console.warn("[TTS] Backend returned error status:", response.status);
        }
      } catch (err) {
        console.warn(
          "[TTS] Failed to fetch voices from backend (using defaults):",
          err.message,
        );
      }
    };
    fetchVoices();
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
          console.log("Track stopped:", track.kind);
        });
      }
    };
  }, [stream]);

  // Ensure video element visibility when stream is available
  useEffect(() => {
    if (stream && videoRef.current && step === "recording") {
      // Double-check stream is active
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();

      console.log(
        "Video tracks active:",
        videoTracks.map((t) => ({ kind: t.kind, state: t.readyState })),
      );
      console.log(
        "Audio tracks active:",
        audioTracks.map((t) => ({ kind: t.kind, state: t.readyState })),
      );

      // Ensure video element is visible
      setTimeout(() => {
        if (videoRef.current && !videoRef.current.srcObject) {
          videoRef.current.srcObject = stream;
          console.log("Re-assigned stream to video element");
        }
      }, 100);
    }
  }, [stream, step]);

  const isUsingBackendQuestions = Boolean(campaign?.questionSetId);

  const playAiAudio = (audioUrl) => {
    // If it's a URL (from backend), use regular audio playback
    if (
      audioUrl &&
      (audioUrl.startsWith("http") || audioUrl.startsWith("blob"))
    ) {
      console.log("Ai start speeking ,,,,,");
      setAiSpeaking(true);

      if (aiAudioRef.current) {
        aiAudioRef.current.pause();
        aiAudioRef.current = null;
      }

      const audio = new Audio(audioUrl);
      aiAudioRef.current = audio;

      audio.onplay = () => {
        console.log(
          "%c[AI] ▶️ AI AUDIO PLAYBACK STARTED",
          "background: #2196F3; color: white; padding: 2px 6px; border-radius: 3px;",
        );
        setAiSpeaking(true);
      };

      audio.onended = () => {
        console.log("Ai end speeking ,,,,");
        setAiSpeaking(false);
      };

      audio.onerror = (e) => {
        console.error(
          "%c[AI] ❌ AI AUDIO ERROR:",
          "background: #F44336; color: white; padding: 2px 6px; border-radius: 3px;",
          e,
        );
        setAiSpeaking(false);
      };

      audio
        .play()
        .then(() =>
          console.log(
            "%c[AI] ✓ Audio playback ready",
            "background: #2196F3; color: white; padding: 2px 6px; border-radius: 3px;",
          ),
        )
        .catch((err) => {
          console.error(
            "%c[AI] ❌ Audio play failed:",
            "background: #F44336; color: white; padding: 2px 6px; border-radius: 3px;",
            err,
          );
          setAiSpeaking(false);
        });

      return;
    }

    // Use Web Speech API (browser's native text-to-speech)
    if (!audioUrl || typeof audioUrl !== "string") {
      console.warn("[AUDIO] ⚠️ No text provided for synthesis");
      return;
    }

    console.log("Ai start speeking ,,,,,");
    setAiSpeaking(true);

    // Cancel any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(audioUrl);
    // Increase rate for faster playback (0.9-1.5 range, 1.3 is faster but still natural)
    utterance.rate = 1.3;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      console.log(
        "%c[AI] ▶️ AI SPEECH SYNTHESIS STARTED",
        "background: #2196F3; color: white; padding: 2px 6px; border-radius: 3px;",
      );
      setAiSpeaking(true);
    };

    utterance.onend = () => {
      console.log("Ai end speeking ,,,,");
      setAiSpeaking(false);
    };

    utterance.onerror = (e) => {
      console.error(
        "%c[AI] ❌ SPEECH SYNTHESIS ERROR",
        "background: #F44336; color: white; padding: 2px 6px; border-radius: 3px;",
        e,
      );
      setAiSpeaking(false);
    };

    if (window.speechSynthesis) {
      // Use immediate speak without delay
      window.speechSynthesis.speak(utterance);
      console.log(
        "%c[AI] ⏱️ Speech synthesis queued",
        "background: #2196F3; color: white; padding: 2px 6px; border-radius: 3px;",
      );
    } else {
      console.error("[AUDIO] ❌ Web Speech API not supported");
    }
  };

  const fetchTtsAudio = async (text) => {
    if (!text) return;

    console.log(
      "[TTS] 🗣️ Synthesizing text immediately:",
      text.substring(0, 50),
    );

    // Play directly without waiting (non-blocking)
    playAiAudio(text);
  };

  const transcribeLocalAudio = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "answer.webm");
      formData.append("withTimestamps", "false");

      const response = await fetch("http://localhost:5000/api/voice/stt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "STT failed");
      }

      const data = await response.json();
      setLastTranscript(data.transcript || "");
    } catch (err) {
      setError(err.message || "STT failed");
    }
  };

  const startSessionRecording = (mediaStream) => {
    // Enable for all modes to ensure full A-Z video is captured
    if (sessionRecorderRef.current) return;

    console.log(
      "%c[RECORDING] 🎥 STARTING FULL SESSION RECORDER (A-Z Video)",
      "background: #E91E63; color: white; padding: 2px 6px; border-radius: 3px;",
    );
    sessionChunksRef.current = [];
    const recorder = new MediaRecorder(mediaStream, { mimeType: "video/webm" });
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        sessionChunksRef.current.push(event.data);
      }
    };
    // Request data chunks every 1 second for higher reliability
    recorder.start(1000);
    sessionRecorderRef.current = recorder;
  };

  const stopSessionRecordingAndUpload = async () => {
    if (!sessionRecorderRef.current) return;

    const recorder = sessionRecorderRef.current;
    sessionRecorderRef.current = null;

    const videoBlob = await new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(sessionChunksRef.current, { type: "video/webm" });
        console.log(
          "%c[RECORDING] ✅ FULL SESSION BLOB CREATED",
          "background: #E91E63; color: white; padding: 2px 6px; border-radius: 3px;",
          `${(blob.size / 1024 / 1024).toFixed(2)} MB`,
        );
        resolve(blob);
      };
      recorder.stop();
    });

    setUploadingVideo(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("video", videoBlob, "session.webm");

      let url = "http://localhost:5000/api/jobs/create";
      if (sessionId) {
        formData.append("sessionId", sessionId);
        url = "http://localhost:5000/api/video/upload";
      }

      console.log(
        `%c[UPLOAD] 📤 Uploading video to ${url}...`,
        "color: #9C27B0; font-weight: bold;",
        {
          sessionId: sessionId || "New Session",
          blobSize: `${(videoBlob.size / 1024 / 1024).toFixed(2)} MB`,
        },
      );

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      console.log(
        `%c[UPLOAD] 📥 Response: ${response.status}`,
        "color: #9C27B0; font-weight: bold;",
      );

      if (!response.ok) {
        const data = await response.json();
        console.error("[UPLOAD] ❌ Upload failed:", data);
        throw new Error(data.error || "Failed to upload video");
      }

      console.log(
        "%c[UPLOAD] ✅ VIDEO SUCCESSFULLY STORED IN CLOUDINARY",
        "color: #4CAF50; font-weight: bold;",
      );
    } catch (err) {
      console.error("[UPLOAD] ❌ ERROR DURING UPLOAD:", err);
      setError(err.message || "Failed to upload video");
    } finally {
      setUploadingVideo(false);
    }
  };

  const startBackendSession = async () => {
    if (!campaign?.questionSetId || sessionId || isFetchingQuestion) return;
    setIsFetchingQuestion(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionSetId: campaign.questionSetId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to start session");
      }

      const data = await response.json();
      setSessionId(data.sessionId);
      setCurrentQuestionText(data.question?.text || "");
      setCurrentQuestionAudio(data.question?.audio || "");
      setCurrentQuestionIndex(0);

      // Auto-generate audio if not provided
      if (data.question?.audio) {
        console.log("[TTS] Playing provided question audio");
        playAiAudio(data.question.audio);
      } else if (data.question?.text) {
        console.log(
          "[TTS] Auto-generating audio for question:",
          data.question.text.substring(0, 40),
        );
        fetchTtsAudio(data.question.text);
      }
    } catch (err) {
      setError(err.message || "Failed to start session");
    } finally {
      setIsFetchingQuestion(false);
    }
  };

  const fetchNextQuestion = async (audioBlob) => {
    if (!sessionId) return;
    setIsFetchingQuestion(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("sessionId", sessionId);
      formData.append("audio", audioBlob, "answer.webm");

      const response = await fetch(
        "http://localhost:5000/api/conversation/next",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to get next question");
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
        setStep("completed");
        return;
      }

      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentQuestionText(data.reply?.text || "");
      setCurrentQuestionAudio(data.reply?.audio || "");

      // Auto-generate audio if not provided
      if (data.reply?.audio) {
        playAiAudio(data.reply.audio);
      } else if (data.reply?.text) {
        console.log(
          "[TTS] Auto-generating audio for question:",
          data.reply.text.substring(0, 40),
        );
        fetchTtsAudio(data.reply.text);
      }

      setStep("question");
    } catch (err) {
      setError(err.message || "Failed to get next question");
    } finally {
      setIsFetchingQuestion(false);
    }
  };

  useEffect(() => {
    if (step === "question" && isUsingBackendQuestions) {
      startBackendSession();
    } else if (
      step === "question" &&
      !isUsingBackendQuestions &&
      campaign?.questions[currentQuestionIndex]
    ) {
      // Auto-generate audio for local questions
      const questionText = campaign.questions[currentQuestionIndex];
      if (questionText && !currentQuestionAudio) {
        console.log(
          "[TTS] Auto-generating audio for local question:",
          questionText.substring(0, 40),
        );
        fetchTtsAudio(questionText);
      }
    }
  }, [step, isUsingBackendQuestions, currentQuestionIndex]);

  // Auto-start recording when question finishes playing
  useEffect(() => {
    if (
      (step === "recording" || step === "question") &&
      !isRecording &&
      !isFetchingQuestion
    ) {
      console.log(
        "%c[FLOW] 🎬 AUTO-STARTING RECORDING (Question finished playing)",
        "background: #9C27B0; color: white; padding: 2px 6px; border-radius: 3px;",
      );
      // Small delay to ensure question finished playing
      const timer = setTimeout(() => {
        if (!isRecording) {
          console.log(
            "%c[FLOW] ▶️ Starting recording...",
            "background: #9C27B0; color: white; padding: 2px 6px; border-radius: 3px;",
          );
          startRecording();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [step, aiSpeaking, isRecording, isFetchingQuestion]);

  // Reset silence timer and speaking state when AI finishes speaking
  useEffect(() => {
    if (!aiSpeaking && isRecording) {
      lastSoundTimeRef.current = Date.now();
      hasStartedSpeakingRef.current = false;
    }
  }, [aiSpeaking, isRecording]);

  // Auto-stop recording after 1 second of silence (reduced from 3 seconds)
  const silenceTimerRef = useRef(null);
  const lastSoundTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!isRecording || !mediaRecorderRef.current) return;

    // Monitor for silence using audio context
    const monitorSilence = setInterval(() => {
      if (!aiSpeakingRef.current && lastSoundTimeRef.current) {
        const silenceTime = Date.now() - lastSoundTimeRef.current;

        // Thresholds
        const silenceThreshold = hasStartedSpeakingRef.current ? 2500 : 8000; // 2.5s if speaking, 8s to start

        if (silenceTime > silenceThreshold) {
          console.log("client end speekin ,,,,,,");
          stopRecording();
          clearInterval(monitorSilence);
        }
      }
    }, 100);

    return () => clearInterval(monitorSilence);
  }, [isRecording]);

  // Track sound activity and log customer speaking
  useEffect(() => {
    if (!stream || !isRecording) return;

    try {
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      const filter = audioContext.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 150; // Cut off low frequency hum (fans, AC)

      source.connect(filter);
      filter.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let noiseFloor = 10;

      const detectSound = () => {
        if (aiSpeakingRef.current) {
          if (isRecording) {
            requestAnimationFrame(detectSound);
          }
          return;
        }

        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

        // Dynamic threshold: Only trigger if significantly above noise floor
        if (average > noiseFloor + 8) {
          // Log when customer starts speaking
          if (!hasStartedSpeakingRef.current) {
            console.log("Customer start speaking ,,,,,");
            hasStartedSpeakingRef.current = true;
          }
          lastSoundTimeRef.current = Date.now();
        } else {
          // Gradually update noise floor to follow constant background noise
          noiseFloor = noiseFloor * 0.98 + average * 0.02;

          // Going silent
          if (
            hasStartedSpeakingRef.current &&
            Date.now() - lastSoundTimeRef.current > 300
          ) {
            // Internal tracking
          }
        }

        if (isRecording) {
          requestAnimationFrame(detectSound);
        }
      };

      detectSound();

      return () => {
        source.disconnect();
        audioContext.close();
      };
    } catch (err) {
      console.warn("[AUDIO] Could not setup silence detection:", err);
    }
  }, [stream, isRecording]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Start camera and recording
  const startRecording = async () => {
    try {
      console.log(
        "%c[RECORDING] ▶️ STARTING RECORDING SESSION",
        "background: #4CAF50; color: white; padding: 2px 6px; border-radius: 3px;",
      );
      setError("");
      let mediaStream = stream;
      if (!mediaStream) {
        console.log(
          "%c[RECORDING] 📷 Requesting camera/microphone access",
          "background: #2196F3; color: white; padding: 2px 6px; border-radius: 3px;",
        );
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        console.log(
          "%c[RECORDING] ✓ Camera/Microphone access granted",
          "background: #4CAF50; color: white; padding: 2px 6px; border-radius: 3px;",
        );
      }

      setStream(mediaStream);

      // Use setTimeout to ensure ref is ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          console.log(
            "%c[RECORDING] 📹 Video stream assigned to element",
            "background: #2196F3; color: white; padding: 2px 6px; border-radius: 3px;",
          );
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

      mediaRecorder.onstop = async () => {
        console.log(
          "%c[RECORDING] 🛑 MEDIA RECORDER STOPPED - Processing audio",
          "background: #FF9800; color: white; padding: 2px 6px; border-radius: 3px;",
        );
        const blob = new Blob(chunks, { type: "audio/webm" });
        setRecordedChunks([blob]);
        console.log(
          "%c[RECORDING] 📦 Audio blob created",
          "background: #FF9800; color: white; padding: 2px 6px; border-radius: 3px;",
        );

        if (isUsingBackendQuestions && sessionId) {
          console.log(
            "%c[FLOW] 📨 FETCHING NEXT QUESTION FROM BACKEND",
            "background: #9C27B0; color: white; padding: 2px 6px; border-radius: 3px;",
          );
          fetchNextQuestion(blob);
        } else if (!isUsingBackendQuestions) {
          // Local questions flow
          if (currentQuestionIndex < campaign.questions.length - 1) {
            console.log(
              "%c[FLOW] ⏭️ AUTO-ADVANCING TO NEXT QUESTION",
              "background: #9C27B0; color: white; padding: 2px 6px; border-radius: 3px;",
              `(${currentQuestionIndex + 1}/${campaign.questions.length})`,
            );
            setTimeout(() => {
              setCurrentQuestionIndex((prev) => prev + 1);
              setCurrentQuestionAudio("");
              setRecordedChunks([]);
              setStep("question");
            }, 300);
          } else {
            console.log(
              "%c[FLOW] ✅ ALL QUESTIONS COMPLETED",
              "background: #4CAF50; color: white; padding: 2px 6px; border-radius: 3px;",
            );
            await stopSessionRecordingAndUpload();
            setStep("completed");
          }
        }
      };

      startSessionRecording(mediaStream);
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      console.log(
        "%c[RECORDING] 🔴 MediaRecorder started - Listening for customer",
        "background: #4CAF50; color: white; padding: 2px 6px; border-radius: 3px;",
      );
      lastSoundTimeRef.current = Date.now();
      setStep("recording");
    } catch (err) {
      setError(`Camera/Microphone Error: ${err.message}`);
      console.error(
        "%c[RECORDING] ❌ ERROR:",
        "background: #F44336; color: white; padding: 2px 6px; border-radius: 3px;",
        err,
      );
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log(
        "%c[RECORDING] 🛑 STOPPING RECORDING",
        "background: #FF5722; color: white; padding: 2px 6px; border-radius: 3px;",
      );
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);

      // Keep stream active for the A-Z full session recording
    }
  };

  // Cancel recording
  const cancelRecording = () => {
    console.log(
      "%c[USER] ❌ USER CANCELLED INTERVIEW",
      "background: #F44336; color: white; padding: 2px 6px; border-radius: 3px;",
    );
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsRecording(false);
    setRecordingTime(0);
    setStep("question");
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
            <svg
              className="w-10 h-10 text-blue-400 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
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
            <svg
              className="w-12 h-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Campaign Not Found
          </h1>
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
      {step === "welcome" && (
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full animate-fadeIn">
            <div className="glass rounded-3xl p-12 text-center shadow-2xl shadow-purple-500/20">
              {/* Avatar */}
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                <div className="relative w-32 h-32 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 border border-white/10">
                  <svg
                    className="w-16 h-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Hey bud! 👋
              </h1>
              <p className="text-white/70 text-xl mb-8 max-w-xl mx-auto">
                I'm your friend, and I'm here to help you share your thoughts on{" "}
                {campaign.name}. Let's have a quick chat!
              </p>

              {/* Campaign Details */}
              <div className="glass-sm border border-white/10 rounded-2xl p-6 mb-8 text-left bg-white/5">
                <p className="text-white/60 text-sm mb-2">Recording for</p>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {campaign.name}
                </h2>
                <div className="flex gap-4 text-white/70 text-sm">
                  <span>📝 {campaign.questions.length} questions</span>
                  <span>
                    ⏱️ ~{Math.ceil((campaign.questions.length * 60) / 2)}{" "}
                    seconds
                  </span>
                </div>
              </div>

              {/* Name Input */}
              <div className="mb-8">
                <label className="block text-white/70 text-sm font-medium mb-3">
                  What's your name?
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    customerName.trim() &&
                    setStep("question")
                  }
                  placeholder="John Smith"
                  autoFocus
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-white/20 transition duration-300 text-lg"
                />
              </div>

              {/* Voice Selector */}
              <div className="mb-8">
                <label className="block text-white/70 text-sm font-medium mb-3">
                  Select AI Voice
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => {
                    setSelectedVoice(e.target.value);
                    console.log("[TTS] Voice selected:", e.target.value);
                  }}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-white/20 transition duration-300 text-lg"
                  style={{
                    colorScheme: "light",
                  }}
                >
                  <option
                    style={{ color: "black", backgroundColor: "white" }}
                    value=""
                  >
                    -- Select a voice --
                  </option>
                  {Object.entries(availableVoices).map(([language, voices]) => (
                    <optgroup
                      key={language}
                      label={language}
                      style={{ color: "black" }}
                    >
                      {voices.map((voice) => (
                        <option
                          key={voice}
                          value={voice}
                          style={{ color: "black", backgroundColor: "white" }}
                        >
                          {voice.replace(/-/g, " ")}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <p className="text-white/50 text-xs mt-2">
                  💡 Unlimited AI voices powered by Microsoft Edge TTS (FREE)
                </p>
              </div>

              <button
                onClick={() => customerName.trim() && setStep("question")}
                disabled={!customerName.trim()}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
              >
                Let's Talk!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUESTION STEP */}
      {step === "question" && (
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full animate-fadeIn">
            <div className="glass rounded-3xl p-12 shadow-2xl shadow-purple-500/20">
              {/* Progress Bar */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white/70 text-sm">
                    Question {currentQuestionIndex + 1} of{" "}
                    {campaign.questions.length}
                  </span>
                  <span className="text-white/70 text-sm">
                    {Math.round(
                      ((currentQuestionIndex + 1) / campaign.questions.length) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / campaign.questions.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* AI Avatar */}
              <div className="flex justify-center mb-10">
                <div className="relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-40 ${aiSpeaking ? "animate-pulse" : ""}`}
                  ></div>
                  <div
                    className={`relative w-28 h-28 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 border border-white/10 ${aiSpeaking ? "animate-pulse" : ""}`}
                  >
                    <svg
                      className="w-14 h-14 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Question Text - Always Display */}
              <div className="text-center mb-10">
                <div className="mb-3">
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${aiSpeaking ? "bg-green-500/20 text-green-300 border border-green-500/50" : "bg-blue-500/20 text-blue-300 border border-blue-500/50"}`}
                  >
                    {aiSpeaking ? "🎙️ AI is speaking" : "👂 Ready to listen"}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-relaxed">
                  {isUsingBackendQuestions
                    ? currentQuestionText || "Preparing your question..."
                    : campaign.questions[currentQuestionIndex]}
                </h2>
              </div>

              {ttsLoading && (
                <div className="glass-sm bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-center">
                  <p className="text-white/70 text-sm">
                    🎙️ AI is generating voice...
                  </p>
                </div>
              )}

              {/* Tip */}
              <div className="glass-sm bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 mb-8 text-center">
                <p className="text-blue-300 text-sm">
                  💡 Speak naturally for 30-90 seconds. Recording will start
                  automatically!
                </p>
              </div>

              {error && (
                <div className="glass-sm bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <div className="w-full px-8 py-4 text-center">
                <p className="text-white/70 text-base font-medium">
                  ⏱️ Recording will start automatically after the question is
                  read
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RECORDING STEP - Interview Room */}
      {step === "recording" && (
        <div className="relative z-10 h-screen flex flex-col animate-fadeIn">
          {/* Top Bar - Question & Timer */}
          <div className="glass-sm border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div className="flex-1 flex items-center gap-4">
              {/* Play Audio Button */}
              <button
                onClick={() => {
                  if (currentQuestionAudio) {
                    playAiAudio(currentQuestionAudio);
                  } else {
                    const questionText = isUsingBackendQuestions
                      ? currentQuestionText
                      : campaign.questions[currentQuestionIndex];
                    if (questionText) {
                      fetchTtsAudio(questionText);
                    }
                  }
                }}
                disabled={ttsLoading}
                className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Play question audio"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>

              <div className="flex-1">
                <p className="text-white/70 text-sm font-medium">
                  Current Question
                </p>
                <h3 className="text-white text-lg font-bold">
                  {isUsingBackendQuestions
                    ? currentQuestionText || "..."
                    : campaign.questions[currentQuestionIndex]}
                </h3>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2 glass-sm px-5 py-3 rounded-2xl border border-white/10 ml-6 flex-shrink-0">
              <div
                className={`w-2 h-2 ${isRecording ? "bg-red-500 animate-pulse" : "bg-slate-600"} rounded-full`}
              ></div>
              <span className="text-white font-mono font-bold text-lg">
                {formatTime(recordingTime)}
              </span>
            </div>
          </div>

          {/* Main Content - Split Layout */}
          <div className="flex-1 flex gap-4 p-6 overflow-hidden">
            {/* Left - AI Interviewer */}
            <div className="w-1/2 flex flex-col items-center justify-center">
              <div className="text-center mb-8">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-3xl ${aiSpeaking ? "animate-pulse" : "opacity-40"}`}
                  ></div>
                  <div
                    className={`relative w-48 h-48 bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-xl border-2 border-white/20 shadow-2xl shadow-purple-500/30 ${aiSpeaking ? "animate-pulse" : ""}`}
                  >
                    {campaign.companyLogo ? (
                      <img
                        src={campaign.companyLogo}
                        alt={campaign.companyName || "Company Logo"}
                        className="w-40 h-40 object-contain rounded-full"
                      />
                    ) : (
                      <svg
                        className="w-24 h-24 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Company Info */}
                <div className="space-y-2">
                  {campaign.companyName && (
                    <p className="text-white text-lg font-bold">
                      {campaign.companyName}
                    </p>
                  )}
                  {campaign.productName && (
                    <p className="text-white/70 text-sm font-medium">
                      {campaign.productName}
                    </p>
                  )}
                  {campaign.feedbackType && (
                    <p className="text-blue-300/80 text-xs font-medium bg-blue-500/10 px-3 py-1 rounded-full inline-block mt-2">
                      {campaign.feedbackType}
                    </p>
                  )}
                </div>

                {aiSpeaking && (
                  <div className="mt-4 flex items-center justify-center gap-1">
                    <div
                      className="w-1 h-4 bg-blue-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-1 h-6 bg-purple-500 rounded-full animate-pulse"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-1 h-4 bg-pink-500 rounded-full animate-pulse"
                      style={{ animationDelay: "300ms" }}
                    ></div>
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
                    <span className="text-red-400 font-bold text-xs">
                      RECORDING
                    </span>
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
                      <svg
                        className="w-16 h-16 text-white/40 mx-auto mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-white/60 text-sm">
                        Click "Start Recording" to begin
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {lastTranscript && (
            <div className="px-6 pb-6">
              <div className="glass-sm bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/60 text-xs mb-2">
                  Last response (transcribed)
                </p>
                <p className="text-white/80 text-sm">{lastTranscript}</p>
              </div>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="glass-sm border-t border-white/10 px-6 py-4 flex items-center justify-center gap-4">
            {/* Status Display */}
            <div className="flex-1 text-center">
              {!isRecording ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <p className="text-white/70 text-sm">
                    Waiting for next question...
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <div className="relative w-3 h-3">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-1 border-2 border-red-500 rounded-full animate-ping"></div>
                  </div>
                  <p className="text-red-400 text-sm font-medium">
                    Recording... (Auto-stops after silence)
                  </p>
                </div>
              )}
            </div>

            {/* Mute Button (kept for user control) */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full transition-all duration-300 flex-shrink-0 ${
                isMuted
                  ? "bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
                  : "glass-sm border border-white/10 text-white/70 hover:bg-white/10"
              }`}
              title={isMuted ? "Unmute microphone" : "Mute microphone"}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                {isMuted ? (
                  <path d="M13.5 4.06c0-1.336-1.616-2.256-2.73-1.72l-5.24 2.97A4 4 0 005 9.073V15a4 4 0 004 4h.5m7.07-6.649l2.905 2.905M19 13a7 7 0 11-14 0 7 7 0 0114 0z" />
                ) : (
                  <path d="M19.114 5.636l1.06-1.06a1.5 1.5 0 00-2.12-2.12l-1.06 1.06a8 8 0 11-11.32 11.32l1.06 1.06a1.5 1.5 0 002.12-2.12l-1.06-1.06a6 6 0 009.12-9.12zM9 13a4 4 0 118 0 4 4 0 01-8 0z" />
                )}
              </svg>
            </button>

            {/* Exit Button (emergency) */}
            <button
              onClick={cancelRecording}
              className="p-4 rounded-full glass-sm border border-white/10 text-white/70 hover:bg-white/10 transition-all duration-300 cursor-pointer flex-shrink-0"
              title="Exit interview"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* COMPLETED STEP */}
      {step === "completed" && (
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full animate-fadeIn">
            <div className="glass rounded-3xl p-12 shadow-2xl shadow-emerald-500/20 text-center">
              {/* Success Icon */}
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full opacity-30 blur-3xl animate-pulse"></div>
                <div className="relative w-32 h-32 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 border border-white/10">
                  <svg
                    className="w-16 h-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Perfect! 🎉
              </h2>
              <p className="text-white/70 text-xl mb-8 max-w-md mx-auto">
                Thank you {customerName}! Your interview has been recorded and
                is being processed.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  Go to Dashboard
                </button>

                <button
                  onClick={() => {
                    setStep("welcome");
                    setCurrentQuestionIndex(0);
                    setRecordedChunks([]);
                    sessionChunksRef.current = [];
                    sessionRecorderRef.current = null;
                    setCustomerName("");
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
