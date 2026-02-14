'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTestimonialById } from '@/lib/mockApi';

export default function TestimonialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const testimonialId = params.id;

  const [testimonial, setTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const loadTestimonial = async () => {
      try {
        const data = await getTestimonialById(testimonialId);
        if (!data) {
          setError('Testimonial not found');
        } else {
          setTestimonial(data);
        }
      } catch (err) {
        setError('Failed to load testimonial');
      } finally {
        setLoading(false);
      }
    };

    loadTestimonial();
  }, [testimonialId]);

  const copyEmbedCode = () => {
    const embedCode = `<iframe src="https://feedspace.ai/embed/${testimonialId}" width="100%" height="400" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const copyShareLink = () => {
    const shareLink = `https://feedspace.ai/share/${testimonialId}`;
    navigator.clipboard.writeText(shareLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-6 md:p-10 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>
        <div className="relative z-10">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-10 w-48 bg-slate-800/60 rounded-lg animate-pulse mb-4"></div>
            <div className="h-12 w-96 bg-slate-800/60 rounded-lg animate-pulse mb-2"></div>
            <div className="h-5 w-64 bg-slate-800/40 rounded-lg animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Video skeleton */}
              <div className="aspect-video bg-slate-800/50 rounded-2xl animate-pulse"></div>
              {/* Info skeleton */}
              <div className="bg-slate-900/60 rounded-xl p-6 h-32 animate-pulse"></div>
            </div>
            <div className="space-y-6">
              <div className="bg-slate-900/60 rounded-xl p-6 h-64 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-12 bg-slate-800/50 rounded-lg animate-pulse"></div>
                <div className="h-12 bg-slate-800/50 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !testimonial) {
    return (
      <div className="p-6 md:p-10 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 min-h-screen">
        <div className="max-w-2xl mx-auto pt-20">
          <button
            onClick={() => router.back()}
            className="mb-6 px-4 py-2 text-slate-400 hover:text-slate-100 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 mb-2">Testimonial Not Found</h1>
            <p className="text-slate-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    if (status === 'Completed') {
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    }
    return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
  };

  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 min-h-screen">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 px-4 py-2 text-slate-400 hover:text-slate-100 transition flex items-center gap-2 group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Testimonials
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">
                Final Reel Preview
              </h1>
              <p className="text-slate-400 text-lg">
                {testimonial.customerName} • {testimonial.campaignName}
              </p>
            </div>
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(testimonial.status)}`}>
              {testimonial.status === 'Completed' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              )}
              {testimonial.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Main Video Section */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-600/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
              <div className="relative bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center relative">
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/30 hover:scale-110 transition-transform duration-300 cursor-pointer group/play">
                      <svg className="w-8 h-8 text-white ml-1 group-hover/play:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Video Preview Label */}
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg">
                    <span className="text-slate-300 text-sm font-medium">Full Testimonial • 2:34</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Bar */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-6 shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Customer</p>
                  <p className="text-slate-100 font-bold">{testimonial.customerName}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Campaign</p>
                  <p className="text-slate-100 font-bold">{testimonial.campaignName}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Duration</p>
                  <p className="text-slate-100 font-bold">2:34</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Created</p>
                  <p className="text-slate-100 font-bold text-sm">
                    {new Date(testimonial.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Transcript Section */}
            {testimonial.status === 'Completed' && testimonial.transcript && (
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <div className="p-6 border-b border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-100">AI Transcript</h3>
                      <p className="text-slate-500 text-sm">Auto-generated with 99% accuracy</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{testimonial.transcript}</p>
                </div>
              </div>
            )}

            {/* 3. Highlights Section */}
            {testimonial.status === 'Completed' && testimonial.highlights && testimonial.highlights.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-pink-600/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">AI Highlights</h3>
                    <p className="text-slate-500 text-sm">Best moments from your testimonial</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {testimonial.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="group bg-slate-900/60 backdrop-blur-md border-l-4 border-indigo-500 rounded-r-xl overflow-hidden hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-400 text-xs font-bold">
                            Highlight {idx + 1}
                          </span>
                          <span className="text-slate-500 text-sm px-2 py-1 bg-slate-800/50 rounded-lg">
                            {highlight.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-100 text-lg font-medium italic leading-relaxed">
                          "{highlight.quote}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Clips Section */}
            {testimonial.status === 'Completed' && testimonial.clips && testimonial.clips.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-orange-600/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">Reel-Ready Clips</h3>
                    <p className="text-slate-500 text-sm">Optimized for social media</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {testimonial.clips.map((clip) => (
                    <div 
                      key={clip.id} 
                      className="group bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
                    >
                      {/* Thumbnail */}
                      <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
                        <span className="text-4xl">{clip.thumbnail}</span>
                        
                        {/* Duration Badge */}
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded text-slate-300 text-xs font-mono">
                          {clip.duration}
                        </div>
                        
                        {/* Play overlay */}
                        <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h4 className="text-slate-100 font-bold mb-1 text-sm">{clip.title}</h4>
                        <p className="text-slate-500 text-xs mb-3">{clip.timestamp}</p>
                        <button className="w-full px-3 py-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all cursor-pointer flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Processing State */}
            {testimonial.status === 'Processing' && (
              <div className="bg-cyan-500/10 border border-blue-500/30 rounded-2xl p-10 text-center backdrop-blur-md">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-2">Processing Your Testimonial</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  Our AI is analyzing your video. Transcript, highlights, and clips will appear here soon.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Customer Card */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <span className="text-white font-bold text-2xl">
                    {testimonial.customerName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-slate-100 font-bold text-lg">{testimonial.customerName}</h3>
                  <p className="text-slate-500 text-sm">{testimonial.campaignName}</p>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-700/50">
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(testimonial.status)}`}>
                    {testimonial.status === 'Completed' ? '✓' : '⟳'} {testimonial.status}
                  </span>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Created</p>
                  <p className="text-slate-100 font-medium">
                    {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                {testimonial.processedAt && (
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Processed</p>
                    <p className="text-slate-100 font-medium">
                      {new Date(testimonial.processedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 5. Action Section */}
            {testimonial.status === 'Completed' && (
              <div className="space-y-3">
                <button className="w-full px-4 py-3.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download All
                </button>

                <button 
                  onClick={copyShareLink}
                  className="w-full px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-bold transition-all hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  {copiedLink ? (
                    <>
                      <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share Link
                    </>
                  )}
                </button>

                <button 
                  onClick={copyEmbedCode}
                  className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700 hover:border-blue-500/50 text-slate-100 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer flex items-center justify-center gap-2"
                >
                  {copiedEmbed ? (
                    <>
                      <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Copy Embed Code
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Pro Tips */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-slate-800 rounded-xl p-6">
              <h4 className="text-slate-100 font-bold mb-3 flex items-center gap-2">
                <span className="text-lg">💡</span> Pro Tips
              </h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  Use clips on Instagram Reels for 3x engagement
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  Add to your website landing page
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  Share highlights in email campaigns
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
