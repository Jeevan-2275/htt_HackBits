'use client';

import React, { useState, useEffect, useRef } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ReelStudioModal({ testimonial, isOpen, onClose, onClipCreated }) {
  const [aspectRatio, setAspectRatio] = useState('9:16'); // '9:16' | '1:1' | '16:9'
  const [captionStyle, setCaptionStyle] = useState('beast'); // 'beast' | 'neon' | 'clean'
  const [hookHeadline, setHookHeadline] = useState('🔥 HOW WE 10X’D OUR WORKFLOW');
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [progressColor, setProgressColor] = useState('#ec4899'); // pink/cyan/yellow
  const [activeTab, setActiveTab] = useState('instagram'); // 'instagram' | 'linkedin' | 'tiktok' | 'embed'

  // Director analysis state
  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [renderSuccessUrl, setRenderSuccessUrl] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  // Video playback & karaoke state
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const timeDisplayRef = useRef(null);
  const lastActiveWordIndexRef = useRef(-1);

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(20);
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  // Sample karaoke words if backend provides them or fallback
  const karaokeWords = analysis?.karaokeSubtitles?.length > 0 
    ? analysis.karaokeSubtitles 
    : [
      { word: 'This', start: 0, end: 0.8 },
      { word: 'platform', start: 0.8, end: 1.6, isHighlight: true },
      { word: 'completely', start: 1.6, end: 2.3 },
      { word: 'transformed', start: 2.3, end: 3.2, isHighlight: true },
      { word: 'how', start: 3.2, end: 3.8 },
      { word: 'we', start: 3.8, end: 4.2 },
      { word: 'collect', start: 4.2, end: 5.0 },
      { word: 'customer', start: 5.0, end: 5.8 },
      { word: 'stories', start: 5.8, end: 6.6, isHighlight: true },
      { word: 'with', start: 6.6, end: 7.2 },
      { word: 'instant', start: 7.2, end: 8.0, isHighlight: true },
      { word: 'results!', start: 8.0, end: 9.0, isHighlight: true }
    ];

  // Fetch Director Analysis on open
  useEffect(() => {
    if (!isOpen || !testimonial) return;

    setLoadingAnalysis(true);
    setRenderSuccessUrl(null);

    fetch(`${API_URL}/reels/director-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        testimonialId: testimonial._id,
        campaignId: testimonial.campaignId?._id || testimonial.campaignId
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setAnalysis(json.data);
          if (json.data.hookHeadline) {
            setHookHeadline(json.data.hookHeadline);
          }
        }
      })
      .catch(err => console.error('Failed to load director analysis:', err))
      .finally(() => setLoadingAnalysis(false));
  }, [isOpen, testimonial]);

  // Smooth video time sync without laggy re-renders
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoDuration || 20;

    // Direct DOM update (zero lag)
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${Math.min(100, (curr / dur) * 100)}%`;
    }
    if (timeDisplayRef.current) {
      timeDisplayRef.current.textContent = `${curr.toFixed(1)}s / ${dur.toFixed(1)}s`;
    }

    // Only update state when the active word changes
    const idx = karaokeWords.findIndex(w => curr >= w.start && curr <= w.end);
    if (idx !== -1 && idx !== lastActiveWordIndexRef.current) {
      lastActiveWordIndexRef.current = idx;
      setActiveWordIndex(idx);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Copy helper
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Trigger Custom Reel Render via backend FFmpeg engine
  const handleRenderCustom = async () => {
    setRendering(true);
    setRenderSuccessUrl(null);
    try {
      const res = await fetch(`${API_URL}/reels/render-custom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testimonialId: testimonial._id,
          aspectRatio,
          startTime: analysis?.bestClipRange?.start || 5,
          endTime: analysis?.bestClipRange?.end || 50,
          hookTitle: hookHeadline,
          watermarkText: 'Feedspace AI'
        })
      });

      const json = await res.json();
      if (json.success && json.data?.reelUrl) {
        setRenderSuccessUrl(json.data.reelUrl);
        // Switch player to newly rendered clip and autoplay immediately
        if (videoRef.current) {
          videoRef.current.src = json.data.reelUrl;
          videoRef.current.load();
          videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
        if (onClipCreated) {
          onClipCreated();
        }
      } else {
        alert(json.error || 'Rendering failed');
      }
    } catch (err) {
      console.error('Render error:', err);
      alert('Failed to trigger video render: ' + err.message);
    } finally {
      setRendering(false);
    }
  };

  if (!isOpen || !testimonial) return null;

  // Aspect ratio styling dimensions
  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case '9:16':
        return 'w-[280px] h-[497px] md:w-[320px] md:h-[568px]';
      case '1:1':
        return 'w-[320px] h-[320px] md:w-[420px] md:h-[420px]';
      case '16:9':
        return 'w-[100%] max-w-[540px] aspect-video';
      default:
        return 'w-[320px] h-[568px]';
    }
  };

  const embedSnippet = `<iframe\n  src="${testimonial.videoUrl}"\n  width="${aspectRatio === '9:16' ? '360' : '640'}"\n  height="${aspectRatio === '9:16' ? '640' : '360'}"\n  frameborder="0"\n  allow="autoplay; fullscreen"\n  allowfullscreen\n  style="border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);"\n></iframe>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl shadow-purple-500/10 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-xl">🎬</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">AI Video Studio & Reel Director</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Enterprise 2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {testimonial.userName} • Auto-framing, dynamic captions & viral hook director
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Main Studio Body: Split Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* LEFT: Video Studio Canvas & Controls (7 Cols) */}
          <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col items-center justify-between bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
            
            {/* Format & Style Switchers */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-5">
              {/* Aspect Ratio Buttons */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
                {[
                  { id: '9:16', label: '📱 9:16 Reel' },
                  { id: '1:1', label: '🔲 1:1 Square' },
                  { id: '16:9', label: '🖥️ 16:9 Cinema' },
                ].map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setAspectRatio(ratio.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      aspectRatio === ratio.id
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md shadow-purple-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>

              {/* Caption Theme Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Captions:</span>
                <select
                  value={captionStyle}
                  onChange={(e) => setCaptionStyle(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                >
                  <option value="beast">⚡ Viral Beast (Yellow Glow)</option>
                  <option value="neon">💎 Neon Cyber (Cyan/Pink)</option>
                  <option value="clean">✨ Clean Minimal (Subtle)</option>
                </select>
              </div>
            </div>

            {/* VIDEO CANVAS WITH VIRAL OVERLAYS */}
            <div className="relative flex items-center justify-center my-auto p-2">
              <div
                className={`relative rounded-2xl overflow-hidden bg-black border-2 border-slate-800 shadow-2xl shadow-cyan-500/10 transition-all duration-300 flex items-center justify-center ${getAspectRatioClasses()}`}
              >
                {/* 1. TOP PROGRESS BAR */}
                {showProgressBar && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/20 z-30 pointer-events-none">
                    <div
                      ref={progressBarRef}
                      className="h-full transition-all duration-75 ease-linear"
                      style={{
                        width: '0%',
                        backgroundColor: progressColor,
                        boxShadow: `0 0 10px ${progressColor}`
                      }}
                    />
                  </div>
                )}

                {/* 2. TOP VIRAL HOOK BANNER */}
                <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none">
                  <div className="bg-black/75 backdrop-blur-md border border-white/20 rounded-xl px-3.5 py-2 shadow-xl">
                    <p className="text-xs md:text-sm font-black text-yellow-400 text-center tracking-wide uppercase drop-shadow-md">
                      {hookHeadline}
                    </p>
                  </div>
                </div>

                {/* 3. HTML5 VIDEO PLAYER */}
                <video
                  ref={videoRef}
                  src={renderSuccessUrl || testimonial.videoUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={() => {
                    if (videoRef.current) setVideoDuration(videoRef.current.duration || 20);
                  }}
                  playsInline
                  loop
                  className="w-full h-full object-cover"
                />

                {/* 4. DYNAMIC KARAOKE SUBTITLES OVERLAY */}
                <div className="absolute bottom-12 left-3 right-3 z-20 text-center pointer-events-none px-2">
                  <div className="inline-block max-w-[95%] py-1.5 px-3 rounded-xl bg-black/60 backdrop-blur-sm border border-white/10">
                    <div className="flex flex-wrap justify-center gap-1.5 text-sm md:text-base font-black uppercase tracking-wider">
                      {karaokeWords.slice(
                        Math.max(0, activeWordIndex - 3),
                        Math.min(karaokeWords.length, activeWordIndex + 4)
                      ).map((item, i) => {
                        const isCurrent = karaokeWords.indexOf(item) === activeWordIndex;
                        return (
                          <span
                            key={i}
                            className={`transition-all duration-150 transform ${
                              isCurrent
                                ? captionStyle === 'beast'
                                  ? 'scale-110 text-yellow-300 drop-shadow-[0_2px_8px_rgba(234,179,8,0.8)]'
                                  : captionStyle === 'neon'
                                  ? 'scale-110 text-cyan-300 drop-shadow-[0_2px_10px_rgba(6,182,212,0.9)]'
                                  : 'scale-105 text-white font-bold'
                                : 'text-slate-300 opacity-85'
                            }`}
                          >
                            {item.word}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 5. BRAND WATERMARK */}
                <div className="absolute bottom-3 right-3 z-20 pointer-events-none flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10 text-[10px] text-white/70 font-semibold">
                  <span>⚡</span> Feedspace AI
                </div>

                {/* Center Play Button Overlay */}
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 hover:bg-black/10 transition group"
                >
                  <div className="w-14 h-14 rounded-full bg-cyan-500/80 group-hover:bg-cyan-400 group-hover:scale-110 text-white flex items-center justify-center shadow-lg shadow-cyan-500/40 transition transform">
                    {isPlaying ? '⏸' : '▶'}
                  </div>
                </button>
              </div>
            </div>

            {/* Sub-Editor Toolbar */}
            <div className="w-full mt-4 space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              {/* Hook Editor Input */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Hook Banner:</span>
                <input
                  type="text"
                  value={hookHeadline}
                  onChange={(e) => setHookHeadline(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-400 font-bold"
                  placeholder="e.g. 🔥 HOW WE 10X'D CUSTOMER REVIEWS"
                />
              </div>

              {/* Toggles & Color Selection */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showProgressBar}
                    onChange={(e) => setShowProgressBar(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-cyan-500"
                  />
                  <span>Show Progress Bar</span>
                </label>

                <div className="flex items-center gap-1.5">
                  <span>Color:</span>
                  {['#ec4899', '#06b6d4', '#eab308', '#8b5cf6'].map((col) => (
                    <button
                      key={col}
                      onClick={() => setProgressColor(col)}
                      style={{ backgroundColor: col }}
                      className={`w-4 h-4 rounded-full transition transform ${
                        progressColor === col ? 'scale-125 ring-2 ring-white' : 'opacity-70'
                      }`}
                    />
                  ))}
                </div>

                <div ref={timeDisplayRef} className="text-slate-400 font-mono text-xs">
                  0.0s / {videoDuration.toFixed(1)}s
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: AI Director Suite & Marketing Toolkit (5 Cols) */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-6 bg-slate-950 overflow-y-auto">
            
            {/* 1. VIRAL RETENTION METER */}
            <div className="bg-gradient-to-br from-purple-950/40 via-slate-900 to-cyan-950/30 p-5 rounded-2xl border border-purple-500/20 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <h3 className="text-sm font-bold text-white">AI Viral Director Score</h3>
                    <p className="text-[11px] text-slate-400">RAG-evaluated audience retention potential</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                    {loadingAnalysis ? '...' : `${analysis?.viralScore || 94}/100`}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {analysis?.grade || 'A+ Viral Ready'}
                  </span>
                </div>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700"
                  style={{ width: `${analysis?.viralScore || 94}%` }}
                />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                💡 <span className="font-semibold text-white">Director Insight:</span>{' '}
                {analysis?.hookAnalysis || 'Strong opening velocity with clear problem-solution impact in the first 3 seconds.'}
              </p>
            </div>

            {/* 2. MULTI-PLATFORM SOCIAL COPY SUITE */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  AI Marketing Distribution Copy
                </h4>
                <div className="flex gap-1">
                  {['instagram', 'linkedin', 'tiktok', 'embed'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition capitalize ${
                        activeTab === tab
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Tab Content Card */}
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-4">
                {activeTab === 'instagram' && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto pr-1">
                      {analysis?.socialPosts?.instagram || 'Loading Instagram copy...'}
                    </p>
                    <button
                      onClick={() => handleCopy(analysis?.socialPosts?.instagram, 'ig')}
                      className="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      {copiedKey === 'ig' ? '✓ Copied to Clipboard!' : '📋 Copy Instagram Post'}
                    </button>
                  </div>
                )}

                {activeTab === 'linkedin' && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto pr-1">
                      {analysis?.socialPosts?.linkedin || 'Loading LinkedIn copy...'}
                    </p>
                    <button
                      onClick={() => handleCopy(analysis?.socialPosts?.linkedin, 'li')}
                      className="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      {copiedKey === 'li' ? '✓ Copied to Clipboard!' : '📋 Copy LinkedIn Post'}
                    </button>
                  </div>
                )}

                {activeTab === 'tiktok' && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto pr-1">
                      {analysis?.socialPosts?.tiktok || 'Loading TikTok copy...'}
                    </p>
                    <button
                      onClick={() => handleCopy(analysis?.socialPosts?.tiktok, 'tt')}
                      className="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      {copiedKey === 'tt' ? '✓ Copied to Clipboard!' : '📋 Copy TikTok Hook'}
                    </button>
                  </div>
                )}

                {activeTab === 'embed' && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-400 mb-1">
                      Embed this responsive testimonial video directly on your landing page or website:
                    </p>
                    <pre className="text-[11px] text-emerald-400 bg-slate-950 p-2.5 rounded-xl overflow-x-auto font-mono">
                      {embedSnippet}
                    </pre>
                    <button
                      onClick={() => handleCopy(embedSnippet, 'embed')}
                      className="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      {copiedKey === 'embed' ? '✓ Copied Iframe Code!' : '📋 Copy Embed Code'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 3. EXPORT & PRODUCTION ACTIONS */}
            <div className="space-y-3 pt-2">
              {renderSuccessUrl && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300 animate-fadeIn">
                  <span>✅ Custom {aspectRatio} Reel Ready!</span>
                  <a
                    href={renderSuccessUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline hover:text-white"
                  >
                    Download MP4 ↗
                  </a>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleRenderCustom}
                  disabled={rendering}
                  className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:shadow-lg hover:shadow-purple-500/30 text-white font-bold text-xs md:text-sm rounded-xl transition transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {rendering ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Rendering {aspectRatio} Reel...</span>
                    </>
                  ) : (
                    <>
                      <span>⚡</span>
                      <span>Render Custom {aspectRatio} Reel</span>
                    </>
                  )}
                </button>

                <a
                  href={renderSuccessUrl || testimonial.videoUrl}
                  download="testimonial-reel.mp4"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                  title="Download raw file"
                >
                  📥 Export
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
